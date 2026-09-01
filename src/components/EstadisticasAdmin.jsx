import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function EstadisticasAdmin() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetch(API_URL + '/api/admin/estadisticas', {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar las estadisticas')
        }
        return data
      })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
  }, [token, navigate])

  const tarjeta = (titulo, valor, emoji) => (
    <div className="bg-white border border-gray-300 rounded p-4 text-center">
      <p className="text-3xl mb-1">{emoji}</p>
      <p className="text-2xl font-bold text-[#2C3E50]">{valor}</p>
      <p className="text-sm text-gray-500">{titulo}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Estadisticas de la plataforma</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {!stats ? (
          <p>Cargando...</p>
        ) : (
          <>
            <h3 className="font-bold text-gray-600 mb-2">Expertos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-3xl">
              {tarjeta('Total expertos', stats.totalExpertos, '🧑‍💼')}
              {tarjeta('Aprobados', stats.expertosAprobados, '✅')}
              {tarjeta('Pendientes', stats.expertosPendientes, '⏳')}
              {tarjeta('Plan Pro', stats.expertosPro, '⭐')}
            </div>

            <h3 className="font-bold text-gray-600 mb-2">Clientes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-3xl">
              {tarjeta('Total clientes', stats.totalClientes, '👤')}
              {tarjeta('Aprobados', stats.clientesAprobados, '✅')}
            </div>

            <h3 className="font-bold text-gray-600 mb-2">Actividad</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-3xl">
              {tarjeta('Calificaciones', stats.totalCalificaciones, '⭐')}
              {tarjeta('Necesidades publicadas', stats.totalNecesidades, '📋')}
              {tarjeta('Necesidades abiertas', stats.necesidadesAbiertas, '🔓')}
              {tarjeta('Aportes recibidos', stats.totalAportesAprobados, '💚')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EstadisticasAdmin