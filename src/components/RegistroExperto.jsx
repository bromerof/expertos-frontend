import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Header from './Header'
import SelectorProfesion from './SelectorProfesion'

function RegistroExperto() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planElegido = searchParams.get('plan') === 'pro' ? 'pro' : 'free'
   const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    whatsapp: '',
    correo: '',
    contraseña: '',
    anosExperiencia: '',
        atiendePresencial: true,
    atiendeVirtual: false,
    coberturaVirtualNacional: false,
    tipoDocumento: 'CC',
    numeroDocumento: '',
    otraCategoriaTexto: '',
    otraProfesionTexto: ''
  })

  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  // Cada fila de ubicacion: { departamentoId, municipioId }
  const [ubicaciones, setUbicaciones] = useState([{ departamentoId: '', municipioId: '' }])

  const [todasLasProfesiones, setTodasLasProfesiones] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [profesionId, setProfesionId] = useState('')

  const [error, setError] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaReglas, setAceptaReglas] = useState(false)
  const [aceptaComunicaciones, setAceptaComunicaciones] = useState(false)

  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [fotoDocumentoFrente, setFotoDocumentoFrente] = useState(null)
  const [fotoDocumentoReverso, setFotoDocumentoReverso] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [pasoEnvio, setPasoEnvio] = useState('')

  useEffect(() => {
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))

    fetch(API_URL + '/api/profesiones')
      .then(res => res.json())
      .then(data => setTodasLasProfesiones(data))
      .catch(err => console.error('Error al cargar profesiones:', err))
  }, [])

  const cargarMunicipios = (departamentoId) => {
    if (municipiosPorDepartamento[departamentoId]) {
      return
    }
    fetch(API_URL + '/api/municipios?departamento=' + departamentoId)
      .then(res => res.json())
      .then(data => {
        setMunicipiosPorDepartamento((prev) => ({ ...prev, [departamentoId]: data }))
      })
      .catch(err => console.error('Error al cargar municipios:', err))
  }

  const handleSeleccionarProfesion = (profesion) => {
    if (!profesion) {
      setProfesionId('')
      setCategoriaId('')
      return
    }
    setProfesionId(profesion._id)
    setCategoriaId(profesion.categoria ? profesion.categoria._id : '')
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleDepartamentoChange = (index, departamentoId) => {
    const nuevas = [...ubicaciones]
    nuevas[index] = { departamentoId: departamentoId, municipioId: '' }
    setUbicaciones(nuevas)
    if (departamentoId) {
      cargarMunicipios(departamentoId)
    }
  }

  const handleMunicipioChange = (index, municipioId) => {
    const nuevas = [...ubicaciones]
    nuevas[index] = { ...nuevas[index], municipioId: municipioId }
    setUbicaciones(nuevas)
  }

  const agregarUbicacion = () => {
    setUbicaciones([...ubicaciones, { departamentoId: '', municipioId: '' }])
  }

  const quitarUbicacion = (index) => {
    const nuevas = ubicaciones.filter((_, i) => i !== index)
    setUbicaciones(nuevas)
  }

  const profesionSeleccionada = todasLasProfesiones.find(p => p._id === profesionId)
  const categoriaEsOtra = Boolean(
    profesionSeleccionada && profesionSeleccionada.categoria &&
    profesionSeleccionada.categoria.nombre.trim().toLowerCase() === 'otra'
  )
  const profesionEsOtra = Boolean(
    profesionSeleccionada && profesionSeleccionada.nombre.trim().toLowerCase() === 'otra'
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const confirmar = window.confirm('Revisa que toda tu informacion este correcta (especialmente tu nombre) antes de continuar. Deseas registrarte con estos datos?')
    if (!confirmar) return

    if (!profesionId) {
      setError('Debes seleccionar una categoria y una profesion')
      return
    }

    if (categoriaEsOtra && !formData.otraCategoriaTexto.trim()) {
      setError('Debes indicar cual es tu categoria especifica')
      return
    }

    if (profesionEsOtra && !formData.otraProfesionTexto.trim()) {
      setError('Debes indicar cual es tu profesion especifica')
      return
    }

    const idsMunicipios = ubicaciones
      .map(u => u.municipioId)
      .filter(id => id !== '')

    if (idsMunicipios.length === 0 && !formData.coberturaVirtualNacional) {
      setError('Debes seleccionar al menos una ubicacion, o marcar cobertura nacional virtual')
      return
    }

    if (!aceptaTerminos || !aceptaDatos || !aceptaReglas) {
      setError('Debes aceptar los Terminos de Uso, la Politica de Tratamiento de Datos y las Reglas para Expertos')
      return
    }

    if (!fotoPerfil || !fotoDocumentoFrente || !fotoDocumentoReverso) {
      setError('Debes subir tu foto de perfil y las dos fotos de tu documento de identidad')
      return
    }

    const datosCompletos = {
      ...formData,
      ubicaciones: idsMunicipios,
      profesion: profesionId,
      terminosAceptados: aceptaTerminos,
      datosAceptados: aceptaDatos,
      reglasAceptadas: aceptaReglas,
      comunicacionesAceptadas: aceptaComunicaciones
    }

    setEnviando(true)
    setPasoEnvio('Creando tu cuenta...')

    // Sube una sola foto a un endpoint ya existente, usando el token recien obtenido
    const subirFoto = (endpoint, campo, archivo, token, id) => {
      const datosFormulario = new FormData()
      datosFormulario.append(campo, archivo)
      return fetch(`${API_URL}/api/expertos/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: datosFormulario
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir una de tus fotos')
        }
        return data
      })
    }

    fetch(API_URL + '/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCompletos)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al registrar')
        }
        return data
      })
      .then(async (datosExperto) => {
        // Quedamos logueados automaticamente con el token que devuelve el registro
        localStorage.setItem('token', datosExperto.token)
        localStorage.setItem('expertoId', datosExperto._id)
        localStorage.setItem('rol', 'experto')

        setPasoEnvio('Subiendo tu foto de perfil...')
        await subirFoto('foto', 'foto', fotoPerfil, datosExperto.token, datosExperto._id)

        setPasoEnvio('Subiendo el frente de tu documento...')
        await subirFoto('foto-documento-frente', 'fotoDocumentoFrente', fotoDocumentoFrente, datosExperto.token, datosExperto._id)

        setPasoEnvio('Subiendo el reverso de tu documento...')
        await subirFoto('foto-documento-reverso', 'fotoDocumentoReverso', fotoDocumentoReverso, datosExperto.token, datosExperto._id)

        return datosExperto
      })
      .then((datosExperto) => {
        if (planElegido === 'pro') {
          navigate('/activar-pro')
        } else {
          navigate('/espera-aprobacion')
        }
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
        setPasoEnvio('')
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
            <Header />

      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-bold mb-1">Registro de experto</h2>
        <p className="text-sm text-gray-500 mb-4">
          {planElegido === 'pro'
            ? '⭐ Te vas a registrar con el plan Pro — primer mes gratis.'
            : 'Te vas a registrar con el plan Free.'}
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Profesion</label>
            <SelectorProfesion
              todasLasProfesiones={todasLasProfesiones}
              valorProfesionId={profesionId}
              onSeleccionar={handleSeleccionarProfesion}
              placeholder="Ej. Plomero, Contador, Fotografo..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Escribe para buscar. Si no encuentras tu profesion, busca "Otra".
            </p>
          </div>

          {categoriaEsOtra && (
            <div>
              <label className="block mb-1">¿Que otra categoria?</label>
              <input
                type="text"
                name="otraCategoriaTexto"
                value={formData.otraCategoriaTexto}
                onChange={handleChange}
                placeholder="Ej. Diseñador de paisajes"
                className="w-full p-2 border rounded"
                autoComplete="off"
                required
              />
            </div>
          )}

          {profesionEsOtra && (
            <div>
              <label className="block mb-1">¿Cual otra profesion?</label>
              <input
                type="text"
                name="otraProfesionTexto"
                value={formData.otraProfesionTexto}
                onChange={handleChange}
                placeholder="Ej. Paisajista"
                className="w-full p-2 border rounded"
                autoComplete="off"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este texto ayuda a que los clientes te encuentren cuando busquen justo lo que haces.
              </p>
            </div>
          )}

          <div>
            <label className="block mb-1">Descripcion</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Modalidad de atencion</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="atiendePresencial"
                  checked={formData.atiendePresencial}
                  onChange={handleChange}
                />
                Presencial
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="atiendeVirtual"
                  checked={formData.atiendeVirtual}
                  onChange={handleChange}
                />
                Virtual
              </label>
            </div>
          </div>

          {formData.atiendeVirtual && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="coberturaVirtualNacional"
                  checked={formData.coberturaVirtualNacional}
                  onChange={handleChange}
                />
                Mi servicio virtual cubre toda Colombia
              </label>
            </div>
          )}

          <div>
            <label className="block mb-1">Ciudades donde atiendes</label>
            {ubicaciones.map((ubicacion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={ubicacion.departamentoId}
                  onChange={(e) => handleDepartamentoChange(index, e.target.value)}
                  className="w-1/2 p-2 border rounded"
                >
                  <option value="">Departamento</option>
                  {departamentos.map((depto) => (
                    <option key={depto._id} value={depto._id}>{depto.nombre}</option>
                  ))}
                </select>

                <select
                  value={ubicacion.municipioId}
                  onChange={(e) => handleMunicipioChange(index, e.target.value)}
                  className="w-1/2 p-2 border rounded"
                  disabled={!ubicacion.departamentoId}
                >
                  <option value="">Municipio</option>
                  {(municipiosPorDepartamento[ubicacion.departamentoId] || []).map((muni) => (
                    <option key={muni._id} value={muni._id}>{muni.nombre}</option>
                  ))}
                </select>

                {ubicaciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => quitarUbicacion(index)}
                    className="px-3 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={agregarUbicacion}
              className="text-[#2C3E50] underline text-sm cursor-pointer hover:text-[#1a252f]"
            >
              + Agregar otra ciudad
            </button>
          </div>

          <div>
            <label className="block mb-1">Tipo de documento</label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="CC">Cedula de Ciudadania</option>
              <option value="CE">Cedula de Extranjeria</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Numero de documento</label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Correo electronico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Anos de experiencia</label>
            <input
              type="number"
              name="anosExperiencia"
              value={formData.anosExperiencia}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block mb-1">Foto de perfil</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setFotoPerfil(e.target.files[0])}
              className="w-full p-2 border rounded bg-white"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Una foto clara y reciente de tu rostro. Se mostrara en tu perfil publico.
            </p>
          </div>

          <div>
            <label className="block mb-1">Documento de identidad — frente</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setFotoDocumentoFrente(e.target.files[0])}
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Documento de identidad — reverso</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setFotoDocumentoReverso(e.target.files[0])}
              className="w-full p-2 border rounded bg-white"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Estas fotos solo las revisa el equipo de EXPERTOS para aprobar tu cuenta, nunca se muestran publicamente.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1"
              />
              <span>
                Acepto los{' '}
                <Link to="/terminos" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline">
                  Terminos de Uso
                </Link>
                .
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaDatos}
                onChange={(e) => setAceptaDatos(e.target.checked)}
                className="mt-1"
              />
              <span>
                He leido y acepto la{' '}
                <Link to="/politica-datos" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline">
                  Politica de Tratamiento de Datos Personales
                </Link>
                .
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaReglas}
                onChange={(e) => setAceptaReglas(e.target.checked)}
                className="mt-1"
              />
              <span>
                Acepto las{' '}
                <Link to="/reglas-expertos" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline">
                  Reglas para Expertos
                </Link>
                {' '}y declaro que la informacion profesional proporcionada es verdadera.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaComunicaciones}
                onChange={(e) => setAceptaComunicaciones(e.target.checked)}
                className="mt-1"
              />
              <span>
                Autorizo el envio de comunicaciones comerciales, promociones y novedades de Expertos (opcional).
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f] disabled:opacity-60"
          >
            {enviando ? pasoEnvio : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroExperto