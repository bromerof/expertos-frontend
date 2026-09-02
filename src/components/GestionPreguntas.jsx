import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

function GestionPreguntas() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [preguntas, setPreguntas] = useState([])
  const [error, setError] = useState('')

  const [editandoId, setEditandoId] = useState(null)
  const [seccion, setSeccion] = useState('')
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [orden, setOrden] = useState(0)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [errorForm, setErrorForm] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    cargarPreguntas()
  }, [token, navigate])

  const cargarPreguntas = () => {
    fetch(API_URL + '/api/preguntas-frecuentes', { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar las preguntas')
        }
        return data
      })
      .then((data) => setPreguntas(data))
      .catch((err) => setError(err.message))
  }

  const limpiarFormulario = () => {
    setEditandoId(null)
    setSeccion('')
    setPregunta('')
    setRespuesta('')
    setOrden(0)
    setErrorForm('')
  }

  const handleNueva = () => {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  const handleEditar = (item) => {
    setEditandoId(item._id)
    setSeccion(item.seccion)
    setPregunta(item.pregunta)
    setRespuesta(item.respuesta)
    setOrden(item.orden || 0)
    setMostrarFormulario(true)
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    setErrorForm('')

    if (!seccion.trim() || !pregunta.trim() || !respuesta.trim()) {
      setErrorForm('Seccion, pregunta y respuesta son obligatorias')
      return
    }

    const datos = { seccion, pregunta, respuesta, orden: Number(orden) || 0 }
    const url = editandoId ? `${API_URL}/api/preguntas-frecuentes/${editandoId}` : `${API_URL}/api/preguntas-frecuentes`
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
          throw new Error(data.mensaje || 'Error al guardar la pregunta')
        }
        return data
      })
      .then(() => {
        setMostrarFormulario(false)
        limpiarFormulario()
        cargarPreguntas()
      })
      .catch((err) => setErrorForm(err.message))
  }

  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Eliminar esta pregunta? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch(`${API_URL}/api/preguntas-frecuentes/${id}`, {
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
      .then(() => cargarPreguntas())
      .catch((err) => setError(err.message))
  }

  // Agrupamos por seccion para mostrarlas organizadas en la lista de gestion
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

      <div className="p-6">
        <div className="flex justify-between items-center mb-4 max-w-3xl">
          <h2 className="text-xl font-bold">Gestionar preguntas frecuentes</h2>
          <button
            onClick={() => (mostrarFormulario ? setMostrarFormulario(false) : handleNueva())}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
          >
            {mostrarFormulario ? 'Cancelar' : '+ Nueva pregunta'}
          </button>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-2xl">{error}</p>
        )}

        {mostrarFormulario && (
          <div className="bg-white border border-gray-300 rounded p-4 mb-6 max-w-lg">
            <h3 className="font-bold mb-3">{editandoId ? 'Editar pregunta' : 'Nueva pregunta'}</h3>

            {errorForm && (
              <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{errorForm}</p>
            )}

            <form onSubmit={handleGuardar} className="flex flex-col gap-3">
              <div>
                <label className="block mb-1">Seccion</label>
                <input
                  type="text"
                  value={seccion}
                  onChange={(e) => setSeccion(e.target.value)}
                  placeholder="Ej. General, Para clientes, Para expertos"
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si escribes una seccion que ya existe, la pregunta se agrupa ahi. Si escribes una nueva, se crea una seccion nueva.
                </p>
              </div>

              <div>
                <label className="block mb-1">Pregunta</label>
                <input
                  type="text"
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Respuesta</label>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Orden (opcional)</label>
                <input
                  type="number"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Numero mas bajo aparece primero dentro de su seccion.
                </p>
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

        {secciones.map((sec) => (
          <div key={sec.nombre} className="mb-6 max-w-3xl">
            <h3 className="font-bold text-gray-600 mb-2">{sec.nombre}</h3>
            <div className="flex flex-col gap-2">
              {sec.preguntas.map((item) => (
                <div key={item._id} className="bg-white border border-gray-300 rounded p-3 flex justify-between items-start gap-3">
                  <div>
                    <p className="font-bold text-sm">{item.pregunta}</p>
                    <p className="text-sm text-gray-600">{item.respuesta}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end flex-shrink-0">
                    <button onClick={() => handleEditar(item)} className="text-xs text-[#2C3E50] underline cursor-pointer">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(item._id)} className="text-xs text-[#E74C3C] underline cursor-pointer">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GestionPreguntas