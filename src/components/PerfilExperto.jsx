import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function PerfilExperto() {
  const { id } = useParams()
  const [experto, setExperto] = useState(null)

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
     fetch(`http://localhost:3000/api/expertos/${id}/contacto`, { cache: 'no-store' })
    .then(res => res.json())
    .then(data => {
      window.open(data.enlaceWhatsApp, '_blank')
    })
    .catch(err => console.error('Error al generar el enlace de contacto:', err))
}
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2C3E50] p-4">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      </header>

      <div className="p-6 flex gap-6">
        {/* Foto */}
        <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0"></div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold">{experto.nombre}</h2>
          <p>Categoría: {experto.categoria}</p>
         <p>Ubicaciones: {experto.ubicaciones && experto.ubicaciones.map(u => u.nombre).join(', ')}</p>
          <p>Años de experiencia: {experto.anosExperiencia}</p>

          <p className="mt-4 max-w-xl text-gray-700">{experto.descripcion}</p>

          <button
  onClick={handleContactar}
  className="mt-4 px-6 py-3 bg-[#25D366] text-white rounded font-bold"
>
  Contactar por WhatsApp
</button>
        </div>
      </div>
    </div>
  )
}

export default PerfilExperto