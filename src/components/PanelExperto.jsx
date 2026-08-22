import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PanelExperto() {
  const navigate = useNavigate()
  const [experto, setExperto] = useState(null)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    ubicacion: '',
    whatsapp: '',
    anosExperiencia: ''
  })

  const expertoId = localStorage.getItem('expertoId')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!expertoId || !token) {
      navigate('/login')
      return
    }
    cargarExperto()
  }, [expertoId, token, navigate])

  const cargarExperto = () => {
    fetch('http://localhost:3000/api/expertos/' + expertoId, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setExperto(data)
        setFormData({
          nombre: data.nombre || '',
          categoria: data.categoria || '',
          descripcion: data.descripcion || '',
          ubicacion: data.ubicacion || '',
          whatsapp: data.whatsapp || '',
          anosExperiencia: data.anosExperiencia || ''
        })
      })
      .catch(err => console.error('Error al cargar el perfil:', err))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    setError('')

    fetch('http://localhost:3000/api/expertos/' + expertoId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(formData)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al actualizar el perfil')
        }
        return data
      })
      .then((data) => {
        setExperto(data)
        setEditando(false)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleEliminar = () => {
    const confirmar = window.confirm('Estas seguro de que quieres eliminar tu perfil? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch('http://localhost:3000/api/expertos/' + expertoId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al eliminar el perfil')
        }
        return data
      })
      .then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('expertoId')
        alert('Perfil eliminado correctamente')
        navigate('/')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expertoId')
    navigate('/login')
  }

  if (!experto) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C3E50] p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
        <button onClick={handleLogout} className="text-white underline">
          Cerrar sesion
        </button>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Mi panel</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {!editando ? (
          <div className="flex gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0"></div>

            <div>
              <h3 className="text-2xl font-bold">{experto.nombre}</h3>
              <p>Categoria: {experto.categoria}</p>
              <p>Ubicacion: {experto.ubicacion}</p>
              <p>Plan: {experto.plan}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-[#2C3E50] text-white rounded"
                >
                  Editar perfil
                </button>
                <button className="px-4 py-2 bg-[#2C3E50] text-white rounded">
                  Cambiar foto
                </button>
                <button
                  onClick={handleEliminar}
                  className="px-4 py-2 bg-[#E74C3C] text-white rounded"
                >
                  Eliminar perfil
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGuardar} className="flex flex-col gap-4 max-w-lg">
            <div>
              <label className="block mb-1">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Descripcion</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Ubicacion</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Anos de experiencia</label>
              <input
                type="number"
                name="anosExperiencia"
                value={formData.anosExperiencia}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-6 py-3 bg-gray-300 rounded font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default PanelExperto