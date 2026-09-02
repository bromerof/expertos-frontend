import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

function OfertasAdmin() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [ofertas, setOfertas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    cargarOfertas()
  }, [token, navigate])

  const cargarOfertas = () => {
    fetch(API_URL + '/api/necesidades/admin/todas', {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar las ofertas')
        }
        return data
      })
      .then((data) => setOfertas(data))
      .catch((err) => setError(err.message))
  }

  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Eliminar esta oferta? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch(`${API_URL}/api/necesidades/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al eliminar la oferta')
        }
        return data
      })
      .then(() => cargarOfertas())
      .catch((err) => setError(err.message))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-1">Ofertas publicadas por clientes</h2>
        <p className="text-sm text-gray-500 mb-4">
          Aqui puedes ver todas las necesidades publicadas, abiertas y cerradas, y eliminar alguna si hace falta moderarla.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-2xl">{error}</p>
        )}

        {ofertas.length === 0 ? (
          <p className="text-gray-500">Todavia no hay ninguna oferta publicada.</p>
        ) : (
          <div className="flex flex-col gap-3 max-w-3xl">
            {ofertas.map((o) => (
              <div key={o._id} className="bg-white border border-gray-300 rounded p-4">
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <p className="font-bold">{o.titulo}</p>
                    <p className="text-sm text-gray-600">{o.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Publicado por: {o.cliente ? o.cliente.nombre : 'Cliente eliminado'}
                      {o.cliente && o.cliente.correo ? ` (${o.cliente.correo})` : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.profesion ? o.profesion.nombre : 'Sin profesion especifica'}
                      {o.municipio ? ` — ${o.municipio.nombre}` : ''}
                      {' — '}{o.modalidad}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(o.fechaCreacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <span
                      className={
                        'inline-block mt-1 text-xs px-2 py-0.5 rounded-full ' +
                        (o.estado === 'abierta' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')
                      }
                    >
                      {o.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEliminar(o._id)}
                    className="text-xs text-[#E74C3C] underline cursor-pointer whitespace-nowrap"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OfertasAdmin