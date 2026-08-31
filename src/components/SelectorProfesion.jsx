import { useState, useEffect, useRef } from 'react'

// Quita tildes y pasa a minusculas, igual que en el backend, para que "fotografo"
// tambien encuentre "Fotógrafo" mientras se escribe
function quitarTildes(texto) {
  if (!texto) return ''
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function SelectorProfesion({ todasLasProfesiones, valorProfesionId, onSeleccionar, placeholder }) {
  const [texto, setTexto] = useState('')
  const [mostrarLista, setMostrarLista] = useState(false)
  const contenedorRef = useRef(null)

  // Si el valor seleccionado cambia desde afuera (ej. al cargar datos existentes),
  // reflejamos el nombre correspondiente en el campo de texto
  useEffect(() => {
    const seleccionada = todasLasProfesiones.find(p => p._id === valorProfesionId)
    setTexto(seleccionada ? seleccionada.nombre : '')
  }, [valorProfesionId, todasLasProfesiones])

  const termino = quitarTildes(texto)
  const coincidencias = termino
    ? todasLasProfesiones
        .filter(p => quitarTildes(p.nombre).includes(termino))
        .slice(0, 8)
    : []

  return (
    <div className="relative" ref={contenedorRef}>
      <input
        type="text"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value)
          setMostrarLista(true)
          if (e.target.value.trim() === '') {
            onSeleccionar(null)
          }
        }}
        onFocus={() => setMostrarLista(true)}
        onBlur={() => setTimeout(() => setMostrarLista(false), 150)}
        placeholder={placeholder || 'Escribe tu profesion...'}
        className="w-full p-2 border rounded"
        autoComplete="off"
      />
      {mostrarLista && coincidencias.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-56 overflow-y-auto shadow-lg">
          {coincidencias.map((p) => (
            <li
              key={p._id}
              onMouseDown={() => {
                onSeleccionar(p)
                setTexto(p.nombre)
                setMostrarLista(false)
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
            >
              {p.nombre}
              {p.categoria && (
                <span className="text-gray-400"> ({p.categoria.nombre})</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {mostrarLista && texto.trim() !== '' && coincidencias.length === 0 && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 p-2 text-sm text-gray-500 shadow-lg">
          Sin coincidencias. Busca "Otra" para elegirla manualmente.
        </div>
      )}
    </div>
  )
}

export default SelectorProfesion