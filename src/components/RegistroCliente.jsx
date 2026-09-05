import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'
import { useNavigate, Link } from 'react-router-dom'
import Header from './Header'

function RegistroCliente() {
  const navigate = useNavigate()
  const botonGoogleRef = useRef(null)

  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    correo: '',
    whatsapp: '',
    contraseña: '',
    atiendePresencial: true,
    atiendeVirtual: false,
    coberturaVirtualNacional: false
  })

  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaComunicaciones, setAceptaComunicaciones] = useState(false)

  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  // El cliente solo necesita UNA ubicacion (no varias como el experto)
  const [departamentoId, setDepartamentoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')

  const [error, setError] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [pasoEnvio, setPasoEnvio] = useState('')

  // Estado especifico del flujo de "Continuar con Google"
  const [credencialGoogle, setCredencialGoogle] = useState(null)
  const [fotoGoogleUrl, setFotoGoogleUrl] = useState('')

  useEffect(() => {
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [])

  // Cuando aparece un error, llevamos la pantalla arriba del todo para que se
  // vea sin importar en que parte del formulario estaba la persona
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [error])

  const handleCredentialResponse = (response) => {
    setError('')
    setEnviando(true)
    setPasoEnvio('Verificando tu cuenta de Google...')

    fetch(API_URL + '/api/auth/google/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al verificar con Google')
        }
        return data
      })
      .then((data) => {
        if (data.existe) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('expertoId', data.experto.id)
          localStorage.setItem('rol', 'cliente')
          navigate('/panel')
        } else {
          setCredencialGoogle(response.credential)
          setFormData((prev) => ({ ...prev, nombre: data.nombre, correo: data.correo }))
          setFotoGoogleUrl(data.foto)
          setEnviando(false)
          setPasoEnvio('')
        }
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
        setPasoEnvio('')
      })
  }

  // Dibuja el boton oficial de Google apenas la libreria este disponible
  useEffect(() => {
    if (credencialGoogle) return

    const intentarDibujar = () => {
      if (window.google && botonGoogleRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        })
        window.google.accounts.id.renderButton(botonGoogleRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: 320
        })
        return true
      }
      return false
    }

    if (!intentarDibujar()) {
      const intervalo = setInterval(() => {
        if (intentarDibujar()) clearInterval(intervalo)
      }, 300)
      return () => clearInterval(intervalo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credencialGoogle])

  const cargarMunicipios = (idDepartamento) => {
    if (municipiosPorDepartamento[idDepartamento]) {
      return
    }
    fetch(API_URL + '/api/municipios?departamento=' + idDepartamento)
      .then(res => res.json())
      .then(data => {
        setMunicipiosPorDepartamento((prev) => ({ ...prev, [idDepartamento]: data }))
      })
      .catch(err => console.error('Error al cargar municipios:', err))
  }

  const handleDepartamentoChange = (idDepartamento) => {
    setDepartamentoId(idDepartamento)
    setMunicipioId('')
    if (idDepartamento) {
      cargarMunicipios(idDepartamento)
    }
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const validarCamposComunes = () => {
    if (!municipioId && !formData.coberturaVirtualNacional) {
      setError('Debes seleccionar tu ciudad, o marcar cobertura nacional virtual')
      return false
    }
    if (!aceptaTerminos || !aceptaDatos) {
      setError('Debes aceptar los Términos de Uso y autorizar el tratamiento de tus datos personales')
      return false
    }
    return true
  }

  // Registro normal, con correo y contraseña (sin Google)
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const confirmar = window.confirm('Revisa que toda tu información esté correcta antes de continuar. ¿Deseas registrarte con estos datos?')
    if (!confirmar) return

    if (!validarCamposComunes()) return

    if (!fotoPerfil) {
      setError('Debes subir tu foto de perfil')
      return
    }

    const datosCompletos = {
      ...formData,
      ubicaciones: municipioId ? [municipioId] : [],
      rol: 'cliente',
      terminosAceptados: aceptaTerminos,
      datosAceptados: aceptaDatos,
      comunicacionesAceptadas: aceptaComunicaciones
    }

    setEnviando(true)
    setPasoEnvio('Creando tu cuenta...')

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
      .then(async (datosCliente) => {
        localStorage.setItem('token', datosCliente.token)
        localStorage.setItem('expertoId', datosCliente._id)
        localStorage.setItem('rol', 'cliente')

        setPasoEnvio('Subiendo tu foto de perfil...')
        const datosFormulario = new FormData()
        datosFormulario.append('foto', fotoPerfil)

        const res = await fetch(`${API_URL}/api/expertos/${datosCliente._id}/foto`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + datosCliente.token },
          body: datosFormulario
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir tu foto de perfil')
        }
      })
      .then(() => {
        navigate('/espera-aprobacion')
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
        setPasoEnvio('')
      })
  }

  // Completar registro cuando ya se verifico con Google (sin contraseña, sin subir foto)
  const handleSubmitGoogle = (e) => {
    e.preventDefault()
    setError('')

    const confirmar = window.confirm('Revisa que toda tu información esté correcta antes de continuar. ¿Deseas registrarte con estos datos?')
    if (!confirmar) return

    if (!validarCamposComunes()) return

    setEnviando(true)
    setPasoEnvio('Creando tu cuenta...')

    fetch(API_URL + '/api/auth/google/completar-registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: credencialGoogle,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        whatsapp: formData.whatsapp,
        ubicaciones: municipioId ? [municipioId] : [],
        atiendePresencial: formData.atiendePresencial,
        atiendeVirtual: formData.atiendeVirtual,
        coberturaVirtualNacional: formData.coberturaVirtualNacional,
        terminosAceptados: aceptaTerminos,
        datosAceptados: aceptaDatos,
        comunicacionesAceptadas: aceptaComunicaciones
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al completar el registro')
        }
        return data
      })
      .then((datosCliente) => {
        localStorage.setItem('token', datosCliente.token)
        localStorage.setItem('expertoId', datosCliente._id)
        localStorage.setItem('rol', 'cliente')
        navigate('/espera-aprobacion')
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
        <h2 className="text-xl font-bold mb-1">Registro de cliente</h2>
        <p className="text-sm text-gray-600 mb-1">
          Regístrate como cliente para comenzar a buscar el experto que necesitas.
        </p>
        <p className="text-sm text-yellow-600 mb-4">
          Los campos marcados con <span className="font-bold">*</span> son obligatorios.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 font-semibold">{error}</p>
        )}

        {enviando && !credencialGoogle && (
          <p className="text-sm text-gray-600 mb-4">{pasoEnvio}</p>
        )}

        {!credencialGoogle && (
          <>
            <div ref={botonGoogleRef} className="mb-4"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-400">o regístrate con tu correo</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </>
        )}

        {credencialGoogle && (
          <div className="bg-white border border-gray-300 rounded p-3 mb-4 flex items-center gap-3">
            {fotoGoogleUrl && (
              <img src={fotoGoogleUrl} alt="Foto de Google" className="w-12 h-12 rounded-full" />
            )}
            <div>
              <p className="font-bold text-sm">{formData.nombre}</p>
              <p className="text-xs text-gray-500">{formData.correo}</p>
            </div>
          </div>
        )}

        <form onSubmit={credencialGoogle ? handleSubmitGoogle : handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          {!credencialGoogle && (
            <>
              <div>
                <label className="block mb-1">Nombre completo <span className="text-red-600">*</span></label>
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
                <label className="block mb-1">Correo electrónico <span className="text-red-600">*</span></label>
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
                <label className="block mb-1">Contraseña <span className="text-red-600">*</span></label>
                <input
                  type="password"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  autoComplete="off"
                  required
                />
                <p className="text-xs text-yellow-600 mt-1">
                  Mínimo 6 caracteres.
                </p>
              </div>

              <div>
                <label className="block mb-1">Foto de perfil <span className="text-red-600">*</span></label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => setFotoPerfil(e.target.files[0])}
                  className="w-full p-2 border rounded bg-white"
                  required
                />
                <p className="text-xs text-yellow-600 mt-1">
                  Una foto clara y reciente de tu rostro, para que los expertos sepan con quién hablan.
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1">Tipo de documento <span className="text-red-600">*</span></label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Número de documento <span className="text-red-600">*</span></label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
            <p className="text-xs text-yellow-600 mt-1">
              Debe ser único: no puede estar ya registrado en otra cuenta de cliente.
            </p>
          </div>

          <div>
            <label className="block mb-1">WhatsApp <span className="text-red-600">*</span></label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
            <p className="text-xs text-yellow-600 mt-1">
              Incluye el indicativo del país si es posible, ej. 57 seguido de tu número.
            </p>
          </div>

          <div>
            <label className="block mb-2">Modalidad de atención que buscas <span className="text-red-600">*</span></label>
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
                Busco atención virtual sin importar la ciudad del experto
              </label>
            </div>
          )}

          <div>
            <label className="block mb-1">Ciudad donde requieres el servicio <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select
                value={departamentoId}
                onChange={(e) => handleDepartamentoChange(e.target.value)}
                className="w-1/2 p-2 border rounded"
              >
                <option value="">Departamento</option>
                {departamentos.map((depto) => (
                  <option key={depto._id} value={depto._id}>{depto.nombre}</option>
                ))}
              </select>

              <select
                value={municipioId}
                onChange={(e) => setMunicipioId(e.target.value)}
                className="w-1/2 p-2 border rounded"
                disabled={!departamentoId}
              >
                <option value="">Municipio</option>
                {(municipiosPorDepartamento[departamentoId] || []).map((muni) => (
                  <option key={muni._id} value={muni._id}>{muni.nombre}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Si buscas atención virtual sin importar la ciudad, marca la casilla de arriba en vez de elegir ciudad.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-yellow-600 font-semibold">
              Para completar tu registro, marca las siguientes casillas: <span className="text-red-600">*</span>
            </p>
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
                  Términos de Uso
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
                He leído y acepto la{' '}
                <Link to="/politica-datos" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline">
                  Política de Tratamiento de Datos Personales
                </Link>
                .
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
                Autorizo el envío de comunicaciones comerciales, promociones y novedades de Expertos (opcional).
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

export default RegistroCliente