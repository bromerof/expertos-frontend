import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

function Blog() {
  const [articulos, setArticulos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/api/blog')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar el blog')
        }
        return data
      })
      .then((data) => setArticulos(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Blog de EXPERTOS</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {articulos.length === 0 ? (
          <p className="text-gray-500">Aun no hay articulos publicados.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {articulos.map((a) => (
              <Link
                key={a._id}
                to={`/blog/${a._id}`}
                className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition block"
              >
                {a.imagenPortada && (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={a.imagenPortada} alt={a.titulo} className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(a.fechaPublicacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="font-bold text-[#2C3E50] mb-1">{a.titulo}</h3>
                  <p className="text-sm text-gray-600">{a.resumen}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog