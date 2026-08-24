import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PanelAdmin() {
  const navigate = useNavigate()
  const [pendientes, setPendientes] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    cargarPendientes()
  }, [token, navigate])

  const cargarPendientes = () => {
    setCargando(true)
    fetch('http://localhost:3000/api/admin/expertos-pendientes', {
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

  const handleAprobar = (id) => {
    fetch('http://localhost:3000/api/admin/expertos/' + id + '/aprobar', {
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
    fetch('http://localhost:3000/api/admin/expertos/' + id + '/suspender', {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C3E50] p-4">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Expertos pendientes de aprobacion</h2>

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
                    <p className="text-gray-500">{experto.profesion && experto.profesion.nombre}</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PanelAdmin