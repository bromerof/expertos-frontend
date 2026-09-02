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

  // Barra horizontal simple, sin librerias: el ancho representa el porcentaje del maximo
  const barra = (etiqueta, cantidad, maximo, color) => (
    <div key={etiqueta} className="mb-2">
      <div className="flex justify-between text-sm mb-0.5">
        <span className="text-gray-700">{etiqueta}</span>
        <span className="text-gray-500">{cantidad}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full"
          style={{
            width: maximo > 0 ? `${Math.max((cantidad / maximo) * 100, 3)}%` : '0%',
            backgroundColor: color
          }}
        />
      </div>
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
              {tarjeta('Vistas de perfil', stats.totalVistas, '👁️')}
              {tarjeta('Contactos realizados', stats.totalContactos, '💬')}
              {tarjeta('Necesidades publicadas', stats.totalNecesidades, '📋')}
              {tarjeta('Necesidades abiertas', stats.necesidadesAbiertas, '🔓')}
            </div>

            <h3 className="font-bold text-gray-600 mb-2">Finanzas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-3xl">
              {tarjeta('Aportes recibidos', stats.totalAportesAprobados, '💚')}
            </div>

            {/* Calidad / Confianza */}
            <h3 className="font-bold text-gray-600 mb-2">⭐ Calidad y confianza</h3>
            <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-md">
              <p className="text-2xl font-bold text-[#2C3E50] mb-3">
                {stats.calificacionPromedioGeneral} / 5{' '}
                <span className="text-sm font-normal text-gray-500">
                  ({stats.totalCalificaciones} calificacion{stats.totalCalificaciones !== 1 ? 'es' : ''})
                </span>
              </p>
              {[5, 4, 3, 2, 1].map((estrellas) =>
                barra(
                  '★'.repeat(estrellas),
                  stats.distribucionEstrellas[estrellas] || 0,
                  stats.totalCalificaciones,
                  '#FBBF24'
                )
              )}
            </div>

            {/* Salud del negocio: expertos Pro sin contactos */}
            <h3 className="font-bold text-gray-600 mb-2">🚨 Riesgo de cancelacion</h3>
            <div
              className={
                'border rounded p-4 mb-6 max-w-md ' +
                (stats.expertosProSinContactos.total > 0
                  ? 'bg-red-50 border-red-300'
                  : 'bg-green-50 border-green-300')
              }
            >
              <p className="font-bold text-lg">
                {stats.expertosProSinContactos.total} experto{stats.expertosProSinContactos.total !== 1 ? 's' : ''} Pro sin ningun contacto
              </p>
              {stats.expertosProSinContactos.total > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mt-1">
                    Estos expertos pagan el plan Pro pero todavia no han recibido ninguna oportunidad.
                    Vale la pena revisar su perfil o su categoria.
                  </p>
                  <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                    {stats.expertosProSinContactos.nombres.map((nombre, i) => (
                      <li key={i}>{nombre}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-gray-600 mt-1">Todos los expertos Pro han recibido al menos un contacto.</p>
              )}
            </div>

            {/* Ranking de expertos mas contactados */}
            <h3 className="font-bold text-gray-600 mb-2">🏆 Expertos con mas contactos</h3>
            <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-md">
              {stats.rankingContactos.length === 0 ? (
                <p className="text-sm text-gray-500">Todavia no hay contactos registrados.</p>
              ) : (
                <ol className="list-decimal list-inside text-sm text-gray-700 flex flex-col gap-1">
                  {stats.rankingContactos.map((e) => (
                    <li key={e._id}>
                      {e.nombre} — <span className="text-gray-500">{e.contactosRecibidos} contactos</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Oferta por categoria */}
            <h3 className="font-bold text-gray-600 mb-2">⚖️ Oferta por categoria</h3>
            <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-md">
              {stats.ofertaPorCategoria.length === 0 ? (
                <p className="text-sm text-gray-500">Aun no hay expertos aprobados.</p>
              ) : (
                stats.ofertaPorCategoria
                  .slice(0, 10)
                  .map((c) =>
                    barra(c.categoria, c.cantidad, stats.ofertaPorCategoria[0].cantidad, '#2C3E50')
                  )
              )}
              {stats.ofertaPorCategoria.length > 10 && (
                <p className="text-xs text-gray-400 mt-1">
                  Mostrando las 10 categorias con mas expertos, de {stats.ofertaPorCategoria.length} en total.
                </p>
              )}
            </div>

            {/* Cobertura geografica */}
            <h3 className="font-bold text-gray-600 mb-2">📍 Cobertura por departamento</h3>
            <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-2xl overflow-x-auto">
              {stats.coberturaPorDepartamento.length === 0 ? (
                <p className="text-sm text-gray-500">Aun no hay usuarios con ubicacion registrada.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-1 pr-4">Departamento</th>
                      <th className="py-1 pr-4">Expertos</th>
                      <th className="py-1 pr-4">Clientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.coberturaPorDepartamento.map((d) => (
                      <tr key={d.departamento} className="border-b border-gray-100">
                        <td className="py-1 pr-4">{d.departamento}</td>
                        <td className="py-1 pr-4">{d.expertos}</td>
                        <td className="py-1 pr-4">{d.clientes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EstadisticasAdmin