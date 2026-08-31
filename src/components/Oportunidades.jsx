import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function Oportunidades() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [necesidades, setNecesidades] = useState(null)
  const [bloqueadoPorPlan, setBloqueadoPorPlan] = useState(false)
  const [mensajeBloqueo, setMensajeBloqueo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetch(API_URL + '/api/necesidades', {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 403) {
            setBloqueadoPorPlan(true)
            setMensajeBloqueo(data.mensaje || 'Esta funcion es exclusiva del plan Pro')
            return null
          }
          throw new Error(data.mensaje || 'Error al cargar las oportunidades')
        }
        return data
      })
      .then((data) => {
        if (data) setNecesidades(data)
      })
      .catch((err) => setError(err.message))
  }, [token, navigate])

  const contactarCliente = (necesidad) => {
    const numeroLimpio = necesidad.cliente.whatsapp.replace(/\D/g, '')
    const numeroConPais = numeroLimpio.startsWith('57') ? numeroLimpio : '57' + numeroLimpio
    const mensaje = `Hola ${necesidad.cliente.nombre}, vi tu publicacion en EXPERTOS sobre "${necesidad.titulo}" y quisiera ofrecerte mis servicios.`
    window.open(`https://wa.me/${numeroConPais}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  if (bloqueadoPorPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <div className="p-6 bg-[#2C3E50] rounded max-w-lg text-white">
            <p className="font-bold mb-2">⭐ Oportunidades es una funcion exclusiva del plan Pro</p>
            <p className="text-sm mb-3">{mensajeBloqueo}</p>
            <ul className="text-sm list-disc list-inside mb-2 space-y-1">
              <li>Ve las necesidades que publican los clientes en tiempo real</li>
              <li>Contacta directamente por WhatsApp a quien la publico</li>
              <li>Consigue clientes sin esperar a que te encuentren buscando</li>
            </ul>
            <p className="text-xs text-gray-300">
              Muy pronto podras activar tu plan Pro directamente desde tu panel.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-1">Oportunidades</h2>
        <p className="text-sm text-gray-500 mb-4">
          Necesidades publicadas por clientes que buscan un experto como tu.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {necesidades === null ? (
          <p>Cargando...</p>
        ) : necesidades.length === 0 ? (
          <p className="text-gray-500">No hay necesidades publicadas por el momento.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {necesidades.map((n) => (
              <div key={n._id} className="bg-white p-4 rounded shadow w-72">
                <p className="font-bold">{n.titulo}</p>
                <p className="text-sm text-gray-600 mt-1">{n.descripcion}</p>

                {n.profesion && (
                  <p className="text-xs text-gray-400 mt-2">Categoria: {n.profesion.nombre}</p>
                )}
                {n.municipio && (
                  <p className="text-xs text-gray-400">Ciudad: {n.municipio.nombre}</p>
                )}
                <p className="text-xs text-gray-400 capitalize">Modalidad: {n.modalidad}</p>
                <p className="text-xs text-gray-400">
                  Publicado: {new Date(n.fechaCreacion).toLocaleDateString('es-CO')}
                </p>

                <button
                  onClick={() => contactarCliente(n)}
                  className="mt-3 w-full px-3 py-2 bg-[#25D366] text-white rounded font-bold cursor-pointer hover:bg-[#1ebe57]"
                >
                  Contactar por WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Oportunidades