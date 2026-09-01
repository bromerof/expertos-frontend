import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

// Convierte **texto** en negrita dentro de una linea
function procesarNegritas(texto) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g)
  return partes.map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>
    }
    return parte
  })
}

// "Traductor" simple de markdown: ## subtitulo, - listas, **negrita**, y parrafos normales
function renderizarContenido(texto) {
  const lineas = texto.split('\n')
  const bloques = []
  let listaActual = []

  const cerrarLista = () => {
    if (listaActual.length > 0) {
      bloques.push(
        <ul key={'ul-' + bloques.length} className="list-disc list-inside mb-3">
          {listaActual}
        </ul>
      )
      listaActual = []
    }
  }

  lineas.forEach((linea, i) => {
    const lineaTrim = linea.trim()

    if (lineaTrim === '') {
      cerrarLista()
      return
    }

    if (lineaTrim.startsWith('## ')) {
      cerrarLista()
      bloques.push(
        <h3 key={i} className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">
          {procesarNegritas(lineaTrim.slice(3))}
        </h3>
      )
      return
    }

    if (lineaTrim.startsWith('- ')) {
      listaActual.push(<li key={i}>{procesarNegritas(lineaTrim.slice(2))}</li>)
      return
    }

    cerrarLista()
    bloques.push(
      <p key={i} className="mb-3 text-gray-700 leading-relaxed">
        {procesarNegritas(lineaTrim)}
      </p>
    )
  })

  cerrarLista()
  return bloques
}

function ArticuloBlog() {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/blog/${id}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar el articulo')
        }
        return data
      })
      .then((data) => setArticulo(data))
      .catch((err) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <p className="bg-red-100 text-red-700 p-3 rounded max-w-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!articulo) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto p-6">
        <Link to="/blog" className="text-[#2C3E50] underline text-sm">
          ← Volver al blog
        </Link>

        {articulo.imagenPortada && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded mt-4 mb-4">
            <img src={articulo.imagenPortada} alt={articulo.titulo} className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-[#2C3E50] mb-1">{articulo.titulo}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {articulo.autor && articulo.autor.nombre ? `Por ${articulo.autor.nombre} — ` : ''}
          {new Date(articulo.fechaPublicacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div>{renderizarContenido(articulo.contenido)}</div>
      </div>
    </div>
  )
}

export default ArticuloBlog