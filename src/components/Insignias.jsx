// Insignias.jsx — Muestra las insignias ganadas segun el promedio y total de calificaciones

function Insignias({ promedio, total }) {
  const insignias = []

  if (total >= 1) {
    insignias.push({ nombre: 'Primer servicio', emoji: '🎉' })
  }

  if (promedio === 5) {
    insignias.push({ nombre: '5 estrellas', emoji: '🌟' })
  } else if (promedio > 4) {
    insignias.push({ nombre: 'Calificacion superior a 4', emoji: '⭐' })
  }

  if (insignias.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {insignias.map((insignia) => (
        <span
          key={insignia.nombre}
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold"
        >
          {insignia.emoji} {insignia.nombre}
        </span>
      ))}
    </div>
  )
}

export default Insignias