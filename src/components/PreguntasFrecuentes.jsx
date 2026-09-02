import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Header from './Header'

function PreguntaAcordeon({ pregunta, respuesta, abierta, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex justify-between items-center gap-3 font-semibold text-[#2C3E50] cursor-pointer"
      >
        <span>{pregunta}</span>
        <span className="text-xl flex-shrink-0">{abierta ? '−' : '+'}</span>
      </button>
      {abierta && (
        <p className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">{respuesta}</p>
      )}
    </div>
  )
}

function PreguntasFrecuentes() {
  const [preguntas, setPreguntas] = useState([])
  const [error, setError] = useState('')
  const [abierta, setAbierta] = useState(null)

  useEffect(() => {
    fetch(API_URL + '/api/preguntas-frecuentes')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar las preguntas frecuentes')
        }
        return data
      })
      .then((data) => setPreguntas(data))
      .catch((err) => setError(err.message))
  }, [])

  const toggle = (id) => {
    setAbierta(abierta === id ? null : id)
  }

  // Agrupamos las preguntas por seccion dinamicamente, en el orden en que
  // aparecen (el backend ya las entrega ordenadas por seccion y "orden")
  const secciones = []
  preguntas.forEach((p) => {
    let seccion = secciones.find((s) => s.nombre === p.seccion)
    if (!seccion) {
      seccion = { nombre: p.seccion, preguntas: [] }
      secciones.push(seccion)
    }
    seccion.preguntas.push(p)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">Preguntas frecuentes</h2>
        <p className="text-gray-500 text-sm mb-8">
          Si no encuentras la respuesta que buscas, usa el botón de soporte para escribirnos.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {secciones.length === 0 && !error && (
          <p className="text-gray-500">Cargando...</p>
        )}

        {secciones.map((seccion) => (
          <div key={seccion.nombre} className="mb-8">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{seccion.nombre}</h3>
            <div className="flex flex-col gap-2">
              {seccion.preguntas.map((item) => (
                <PreguntaAcordeon
                  key={item._id}
                  pregunta={item.pregunta}
                  respuesta={item.respuesta}
                  abierta={abierta === item._id}
                  onToggle={() => toggle(item._id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreguntasFrecuentes