import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate, Link } from 'react-router-dom'
import Header from './Header'

function RegistroExperto() {
  const navigate = useNavigate()
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

  const [categorias, setCategorias] = useState([])
  const [profesionesPorCategoria, setProfesionesPorCategoria] = useState({})
  const [categoriaId, setCategoriaId] = useState('')
  const [profesionId, setProfesionId] = useState('')

  const [error, setError] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaReglas, setAceptaReglas] = useState(false)
  const [aceptaComunicaciones, setAceptaComunicaciones] = useState(false)

  useEffect(() => {
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))

    fetch(API_URL + '/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Error al cargar categorias:', err))
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

  const cargarProfesiones = (categoriaId) => {
    if (profesionesPorCategoria[categoriaId]) {
      return
    }
    fetch(API_URL + '/api/profesiones?categoria=' + categoriaId)
      .then(res => res.json())
      .then(data => {
        setProfesionesPorCategoria((prev) => ({ ...prev, [categoriaId]: data }))
      })
      .catch(err => console.error('Error al cargar profesiones:', err))
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

  const handleCategoriaChange = (nuevaCategoriaId) => {
    setCategoriaId(nuevaCategoriaId)
    setProfesionId('')
    if (nuevaCategoriaId) {
      cargarProfesiones(nuevaCategoriaId)
    }
  }

  const handleProfesionChange = (nuevaProfesionId) => {
    setProfesionId(nuevaProfesionId)
  }

  const profesionSeleccionada = (profesionesPorCategoria[categoriaId] || [])
    .find(p => p._id === profesionId)
  const categoriaSeleccionada = categorias.find(c => c._id === categoriaId)
  const categoriaEsOtra = Boolean(
    categoriaSeleccionada && categoriaSeleccionada.nombre.trim().toLowerCase() === 'otra'
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

    const datosCompletos = {
      ...formData,
      ubicaciones: idsMunicipios,
      profesion: profesionId,
      terminosAceptados: aceptaTerminos,
      datosAceptados: aceptaDatos,
      reglasAceptadas: aceptaReglas,
      comunicacionesAceptadas: aceptaComunicaciones
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
      .then(() => {
        alert('Registro exitoso! Ahora puedes iniciar sesion.')
        navigate('/login')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
            <Header />

      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Registro de experto</h2>

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
            <label className="block mb-1">Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => handleCategoriaChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona una categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si no encuentras tu categoria, selecciona "Otra".
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

          <div>
            <label className="block mb-1">Profesion especifica</label>
            <select
              value={profesionId}
              onChange={(e) => handleProfesionChange(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!categoriaId}
            >
              <option value="">Selecciona una profesion</option>
              {(profesionesPorCategoria[categoriaId] || []).map((prof) => (
                <option key={prof._id} value={prof._id}>{prof.nombre}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si no encuentras tu profesion, selecciona "Otra".
            </p>
          </div>

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
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroExperto