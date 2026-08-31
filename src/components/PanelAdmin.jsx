import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function PanelAdmin() {
  const navigate = useNavigate()
  const [pendientes, setPendientes] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const [mostrarFormularioAdmin, setMostrarFormularioAdmin] = useState(false)
  const [formDataAdmin, setFormDataAdmin] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    tipoDocumento: 'CC',
    numeroDocumento: ''
  })
  const [errorAdmin, setErrorAdmin] = useState('')
  const [mensajeExitoAdmin, setMensajeExitoAdmin] = useState('')

  const [todosLosExpertos, setTodosLosExpertos] = useState([])
  const [errorPro, setErrorPro] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    cargarPendientes()
    cargarTodosLosExpertos()
  }, [token, navigate])

  const cargarPendientes = () => {
    setCargando(true)
    fetch(API_URL + '/api/admin/expertos-pendientes', {
      cache: 'no-store',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar pendientes')
        }
        return data
      })
      .then((data) => {
        setPendientes(data)
        setCargando(false)
      })
      .catch((err) => {
        setError(err.message)
        setCargando(false)
      })
  }

  const cargarTodosLosExpertos = () => {
    fetch(API_URL + '/api/admin/expertos-todos', {
      cache: 'no-store',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar expertos')
        }
        return data
      })
      .then((data) => setTodosLosExpertos(data))
      .catch((err) => setErrorPro(err.message))
  }

  const handleAprobar = (id) => {
    fetch(API_URL + '/api/admin/expertos/' + id + '/aprobar', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al aprobar')
        }
        return data
      })
      .then(() => {
        cargarPendientes()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleSuspender = (id) => {
    fetch(API_URL + '/api/admin/expertos/' + id + '/suspender', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al suspender')
        }
        return data
      })
      .then(() => {
        cargarPendientes()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleTogglePro = (id, planActual) => {
    setErrorPro('')
    const ruta = planActual === 'pro' ? 'quitar-pro' : 'activar-pro'

    fetch(API_URL + '/api/admin/expertos/' + id + '/' + ruta, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cambiar el plan')
        }
        return data
      })
      .then(() => {
        cargarTodosLosExpertos()
      })
      .catch((err) => {
        setErrorPro(err.message)
      })
  }

  const handleChangeAdmin = (e) => {
    const { name, value } = e.target
    setFormDataAdmin({ ...formDataAdmin, [name]: value })
  }

  const handleCrearAdmin = (e) => {
    e.preventDefault()
    setErrorAdmin('')
    setMensajeExitoAdmin('')

    fetch(API_URL + '/api/admin/crear-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(formDataAdmin)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al crear el administrador')
        }
        return data
      })
      .then((adminCreado) => {
        setMensajeExitoAdmin('Administrador "' + adminCreado.nombre + '" creado correctamente.')
        setFormDataAdmin({
          nombre: '',
          correo: '',
          contraseña: '',
          tipoDocumento: 'CC',
          numeroDocumento: ''
        })
      })
      .catch((err) => {
        setErrorAdmin(err.message)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
            <Header />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4 max-w-3xl">
          <h2 className="text-xl font-bold">Expertos pendientes de aprobacion</h2>
          <button
            onClick={() => {
              setMostrarFormularioAdmin(!mostrarFormularioAdmin)
              setErrorAdmin('')
              setMensajeExitoAdmin('')
            }}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
          >
            {mostrarFormularioAdmin ? 'Cancelar' : '+ Crear administrador'}
          </button>
        </div>

        {mostrarFormularioAdmin && (
          <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-md">
            <h3 className="font-bold mb-3">Crear nuevo administrador</h3>

            {errorAdmin && (
              <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorAdmin}</p>
            )}
            {mensajeExitoAdmin && (
              <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{mensajeExitoAdmin}</p>
            )}

            <form onSubmit={handleCrearAdmin} className="flex flex-col gap-3">
              <div>
                <label className="block mb-1">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formDataAdmin.nombre}
                  onChange={handleChangeAdmin}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Correo electronico</label>
                <input
                  type="email"
                  name="correo"
                  value={formDataAdmin.correo}
                  onChange={handleChangeAdmin}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  value={formDataAdmin.contraseña}
                  onChange={handleChangeAdmin}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Tipo de documento</label>
                <select
                  name="tipoDocumento"
                  value={formDataAdmin.tipoDocumento}
                  onChange={handleChangeAdmin}
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
                  value={formDataAdmin.numeroDocumento}
                  onChange={handleChangeAdmin}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
              >
                Crear administrador
              </button>
            </form>
          </div>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-2xl">{error}</p>
        )}

        {cargando ? (
          <p>Cargando...</p>
        ) : pendientes.length === 0 ? (
          <p>No hay expertos pendientes de aprobacion.</p>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {pendientes.map((experto) => (
              <div
                key={experto._id}
                className="bg-white border border-gray-300 rounded p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{experto.nombre}</p>
                    {experto.rol === 'cliente' ? (
                      <p className="text-gray-500 font-semibold">Cliente</p>
                    ) : (
                      <p className="text-gray-500">{experto.profesion && experto.profesion.nombre}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {experto.tipoDocumento}: {experto.numeroDocumento}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAprobar(experto._id)}
                      className="px-4 py-2 bg-[#27AE60] text-white rounded cursor-pointer hover:bg-[#1e8449]"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleSuspender(experto._id)}
                      className="px-4 py-2 bg-[#E74C3C] text-white rounded cursor-pointer hover:bg-[#c0392b]"
                    >
                      Suspender
                    </button>
                  </div>
                </div>
                {experto.rol !== 'cliente' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-bold mb-2">Documento de identidad:</p>
                  <div className="flex gap-4">
                                        {experto.fotoDocumentoFrente ? (
                      <a href={experto.fotoDocumentoFrente} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                        <img
                          src={experto.fotoDocumentoFrente}
                          alt="Frente del documento"
                          className="w-32 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-center mt-1 text-[#2C3E50] underline">Ver frente</p>
                      </a>
                    ) : (
                      <p className="text-red-600 text-sm">Frente no subido</p>
                    )}

                                       {experto.fotoDocumentoReverso ? (
                      <a href={experto.fotoDocumentoReverso} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                        <img
                          src={experto.fotoDocumentoReverso}
                          alt="Reverso del documento"
                          className="w-32 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-center mt-1 text-[#2C3E50] underline">Ver reverso</p>
                      </a>
                    ) : (
                      <p className="text-red-600 text-sm">Reverso no subido</p>
                    )}
                  </div>
                </div>
              )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-1">Gestionar plan Pro (prueba)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Activa o quita el plan Pro manualmente en cualquier cuenta de experto, mientras Wompi no este conectado.
            Esto no genera ningun cobro real.
          </p>

          {errorPro && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorPro}</p>
          )}

          {todosLosExpertos.length === 0 ? (
            <p className="text-gray-500">No hay expertos registrados todavia.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todosLosExpertos.map((experto) => (
                <div
                  key={experto._id}
                  className="bg-white border border-gray-300 rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">
                      {experto.nombre}{' '}
                      {experto.plan === 'pro' && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-[#2C3E50] text-xs font-bold rounded-full">
                          ⭐ Pro
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{experto.correo}</p>
                  </div>
                  <button
                    onClick={() => handleTogglePro(experto._id, experto.plan)}
                    className={
                      experto.plan === 'pro'
                        ? 'px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400'
                        : 'px-4 py-2 bg-yellow-400 text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-yellow-500'
                    }
                  >
                    {experto.plan === 'pro' ? 'Quitar Pro' : 'Activar Pro'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PanelAdmin