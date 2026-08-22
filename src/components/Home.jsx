import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [expertos, setExpertos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/expertos')
      .then(res => res.json())
      .then(data => setExpertos(data))
      .catch(err => console.error('Error al cargar expertos:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2C3E50] p-4">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      </header>

      {/* Barra de búsqueda */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Buscar por categoría, ubicación..."
          className="w-full max-w-2xl p-3 rounded border border-gray-300"
        />

        {/* Filtros */}
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 border rounded">Categoría</button>
          <button className="px-4 py-2 border rounded">Ubicación</button>
          <button className="px-4 py-2 border rounded">Calificación</button>
        </div>

        {/* Lista de expertos */}
        <div className="flex flex-wrap gap-4 mt-6">
          {expertos.map((experto) => (
            <Link
              key={experto._id}
              to={`/experto/${experto._id}`}
              className="bg-white p-4 rounded shadow w-64 block hover:shadow-lg transition"
            >
              <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
              <p className="font-bold">{experto.nombre}</p>
              <p className="text-gray-500">{experto.categoria}</p>
              <button className="mt-2 px-3 py-1 bg-[#2C3E50] text-white rounded">
                Contactar
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home