import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate, Link } from 'react-router-dom'
import Header from './Header'
import SelectorProfesion from './SelectorProfesion'

// Quita tildes y pasa a minusculas, igual que en el resto de la plataforma
function quitarTildes(texto) {
  if (!texto) return ''
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function Oportunidades() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [necesidades, setNecesidades] = useState(null)
  const [bloqueadoPorPlan, setBloqueadoPorPlan] = useState(false)
  const [mensajeBloqueo, setMensajeBloqueo] = useState('')
  const [error, setError] = useState('')

  const [todasLasProfesiones, setTodasLasProfesiones] = useState([])
  const [profesionFiltroId, setProfesionFiltroId] = useState('')
  const [palabraClave, setPalabraClave] = useState('')

  const cargarNecesidades = (idProfesion) => {
    const params = idProfesion ? '?profesion=' + idProfesion : ''
    fetch(API_URL + '/api/necesidades' + params, {
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
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    cargarNecesidades()

    fetch(API_URL + '/api/profesiones')
      .then(res => res.json())
      .then(data => setTodasLasProfesiones(data))
      .catch(err => console.error('Error al cargar profesiones:', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate])

  const handleSeleccionarProfesion = (profesion) => {
    const id = profesion ? profesion._id : ''
    setProfesionFiltroId(id)
    cargarNecesidades(id)
  }

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
            <p className="text-xs text-gray-300 mb-4">
              Con el plan Pro, esto se activa de inmediato.
            </p>
            <Link
              to="/activar-pro"
              className="inline-block px-4 py-2 bg-yellow-400 text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-yellow-500"
            >
              Activar plan Pro →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // La palabra clave se filtra en el propio navegador (ya cargamos la lista);
  // el filtro de profesion, en cambio, ya vino filtrado desde el backend
  const terminoClave = quitarTildes(palabraClave)
  const necesidadesFiltradas = necesidades && terminoClave.trim()
    ? necesidades.filter((n) =>
        quitarTildes(n.titulo).includes(terminoClave) ||
        quitarTildes(n.descripcion).includes(terminoClave)
      )
    : necesidades

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-1">Oportunidades</h2>
        <p className="text-sm text-gray-500 mb-4">
          Necesidades publicadas por clientes que buscan un experto como tu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl">
          <div className="flex-1">
            <SelectorProfesion
              todasLasProfesiones={todasLasProfesiones}
              valorProfesionId={profesionFiltroId}
              onSeleccionar={handleSeleccionarProfesion}
              placeholder="Filtrar por profesión..."
            />
          </div>
          <input
            type="text"
            value={palabraClave}
            onChange={(e) => setPalabraClave(e.target.value)}
            placeholder="Buscar por palabra clave..."
            className="flex-1 p-2 border rounded"
          />
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {necesidadesFiltradas === null ? (
          <p>Cargando...</p>
        ) : necesidadesFiltradas.length === 0 ? (
          <p className="text-gray-500">No hay necesidades que coincidan con este filtro.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {necesidadesFiltradas.map((n) => (
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