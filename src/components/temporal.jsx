import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

function GestionBlog() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [articulos, setArticulos] = useState([])
  const [error, setError] = useState('')

  const [editandoId, setEditandoId] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [resumen, setResumen] = useState('')
  const [contenido, setContenido] = useState('')
  const [estado, setEstado] = useState('borrador')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [errorForm, setErrorForm] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    cargarArticulos()
  }, [token, navigate])

  const cargarArticulos = () => {
    fetch(API_URL + '/api/blog/admin/todos', {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar articulos')
        }
        return data
      })
      .then((data) => setArticulos(data))
      .catch((err) => setError(err.message))
  }

  const limpiarFormulario = () => {
    setEditandoId(null)
    setTitulo('')
    setResumen('')
    setContenido('')
    setEstado('borrador')
    setErrorForm('')
  }

  const handleNuevo = () => {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  const handleEditar = (articulo) => {
    setEditandoId(articulo._id)
    setTitulo(articulo.titulo)
    setResumen(articulo.resumen)
    setContenido(articulo.contenido)
    setEstado(articulo.estado)
    setMostrarFormulario(true)
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    setErrorForm('')

    if (!titulo.trim() || !resumen.trim() || !contenido.trim()) {
      setErrorForm('Titulo, resumen y contenido son obligatorios')
      return
    }

    const datos = { titulo, resumen, contenido, estado }
    const url = editandoId ? `${API_URL}/api/blog/${editandoId}` : `${API_URL}/api/blog`
    const metodo = editandoId ? 'PUT' : 'POST'

    fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(datos)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al guardar el articulo')
        }
        return data
      })
      .then(() => {
        setMostrarFormulario(false)
        limpiarFormulario()
        cargarArticulos()
      })
      .catch((err) => setErrorForm(err.message))
  }

  const handleSubirPortada = (articuloId, archivo) => {
    if (!archivo) return

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(archivo.type)) {
      setError('Solo se permiten archivos JPG o PNG')
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB')
      return
    }

    const datosFormulario = new FormData()
    datosFormulario.append('imagenPortada', archivo)

    fetch(`${API_URL}/api/blog/${articuloId}/portada`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: datosFormulario
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir la imagen')
        }
        return data
      })
      .then(() => cargarArticulos())
      .catch((err) => setError(err.message))
  }

  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Eliminar este articulo? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch(`${API_URL}/api/blog/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al eliminar')
        }
        return data
      })
      .then(() => cargarArticulos())
      .catch((err) => setError(err.message))
  }

  const handleCambiarEstado = (articulo) => {
    const nuevoEstado = articulo.estado === 'publicado' ? 'borrador' : 'publicado'

    fetch(`${API_URL}/api/blog/${articulo._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ estado: nuevoEstado })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cambiar el estado')
        }
        return data
      })
      .then(() => cargarArticulos())
      .catch((err) => setError(err.message))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4 max-w-3xl">
          <h2 className="text-xl font-bold">Gestionar blog</h2>
          <button
            onClick={() => (mostrarFormulario ? setMostrarFormulario(false) : handleNuevo())}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
          >
            {mostrarFormulario ? 'Cancelar' : '+ Nuevo articulo'}
          </button>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-2xl">{error}</p>
        )}

        {mostrarFormulario && (
          <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-lg">
            <h3 className="font-bold mb-3">{editandoId ? 'Editar articulo' : 'Nuevo articulo'}</h3>

            {errorForm && (
              <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{errorForm}</p>
            )}

            <form onSubmit={handleGuardar} className="flex flex-col gap-3">
              <div>
                <label className="block mb-1">Titulo</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Resumen (se muestra en la lista)</label>
                <textarea
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Contenido</label>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  className="w-full p-2 border rounded font-mono text-sm"
                  rows={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa **texto** para negrita, ## Titulo para subtitulos, y "- " al inicio de una linea para listas.
                  Cada parrafo en una linea nueva.
                </p>
              </div>

              <div>
                <label className="block mb-1">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
              >
                Guardar
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col gap-3 max-w-3xl">
          {articulos.map((a) => (
            <div key={a._id} className="bg-white border border-gray-300 rounded p-4">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="flex gap-3">
                  {a.imagenPortada ? (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img src={a.imagenPortada} alt={a.titulo} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 text-center p-1">
                      Sin portada
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{a.titulo}</p>
                    <p className="text-sm text-gray-500">{a.resumen}</p>
                    <span
                      className={
                        'inline-block mt-1 text-xs px-2 py-0.5 rounded-full ' +
                        (a.estado === 'publicado' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')
                      }
                    >
                      {a.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <button onClick={() => handleEditar(a)} className="text-xs text-[#2C3E50] underline cursor-pointer">
                    Editar
                  </button>
                  <button onClick={() => handleCambiarEstado(a)} className="text-xs text-[#2C3E50] underline cursor-pointer">
                    {a.estado === 'publicado' ? 'Pasar a borrador' : 'Publicar'}
                  </button>
                  <label className="text-xs text-[#2C3E50] underline cursor-pointer">
                    Subir portada
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleSubirPortada(a._id, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <button onClick={() => handleEliminar(a._id)} className="text-xs text-[#E74C3C] underline cursor-pointer">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GestionBlog