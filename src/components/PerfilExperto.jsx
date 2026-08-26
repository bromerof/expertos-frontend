import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './Header'

function PerfilExperto() {
  const { id } = useParams()
  const [experto, setExperto] = useState(null)
  const [mostrarAvisoCalificar, setMostrarAvisoCalificar] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3000/api/expertos/${id}`)
      .then(res => res.json())
      .then(data => setExperto(data))
      .catch(err => console.error('Error al cargar el experto:', err))
  }, [id])

  if (!experto) {
    return <p className="p-6">Cargando...</p>
  }

  const handleContactar = () => {
    const token = localStorage.getItem('token')

    const opciones = { cache: 'no-store' }
    if (token) {
      opciones.headers = { 'Authorization': 'Bearer ' + token }
    }

    fetch(`http://localhost:3000/api/expertos/${id}/contacto`, opciones)
      .then(res => res.json())
      .then(data => {
        window.open(data.enlaceWhatsApp, '_blank')
        // Si el cliente esta logueado, le recordamos que puede calificar
        // a este experto mas adelante, cuando termine el servicio
        if (token) {
          setMostrarAvisoCalificar(true)
        }
      })
      .catch(err => console.error('Error al generar el enlace de contacto:', err))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 flex gap-6">
        {/* Foto */}
        <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0"></div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold">{experto.nombre}</h2>
          <p>Categoría: {experto.profesion && experto.profesion.categoria && experto.profesion.categoria.nombre}</p>
          <p>Profesión: {experto.profesion && experto.profesion.nombre}</p>

          {experto.ubicaciones && experto.ubicaciones.length > 0 && (
            <p>Ubicaciones: {experto.ubicaciones.map(u => u.nombre).join(', ')}</p>
          )}

          {experto.coberturaVirtualNacional && (
            <p>Cobertura virtual: Todo Colombia</p>
          )}

          {(!experto.ubicaciones || experto.ubicaciones.length === 0) && !experto.coberturaVirtualNacional && (
            <p>Ubicaciones: No especificadas</p>
          )}

          <p>Años de experiencia: {experto.anosExperiencia}</p>

          <p className="mt-4 max-w-xl text-gray-700">{experto.descripcion}</p>

          <button
            onClick={handleContactar}
            className="mt-4 px-6 py-3 bg-[#25D366] text-white rounded font-bold cursor-pointer hover:bg-[#1ebe57]"
          >
            Contactar por WhatsApp
          </button>

          {mostrarAvisoCalificar && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded max-w-md">
              <p className="text-sm text-gray-700">
                Cuando termines de recibir el servicio, no olvides calificar tu experiencia con {experto.nombre}.
              </p>
              <Link
                to={`/calificar/${id}`}
                className="inline-block mt-2 text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]"
              >
                Calificar ahora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfilExperto