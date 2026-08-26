import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './Header'

function Calificar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [persona, setPersona] = useState(null)
  const [puntuacion, setPuntuacion] = useState(0)
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/expertos/${id}`)
      .then(res => res.json())
      .then(data => setPersona(data))
      .catch(err => console.error('Error al cargar el perfil:', err))
  }, [id])

  const handleEnviar = () => {
    setError('')

    if (puntuacion === 0) {
      setError('Debes seleccionar de 1 a 5 estrellas')
      return
    }

    fetch(API_URL + '/api/calificaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        receptorId: id,
        puntuacion: puntuacion,
        comentario: comentario
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al enviar la calificacion')
        }
        return data
      })
      .then(() => {
        setEnviado(true)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <p className="mb-4">Debes iniciar sesion para poder calificar.</p>
          <Link to="/login" className="text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]">
            Ir a iniciar sesion
          </Link>
        </div>
      </div>
    )
  }

  if (!persona) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-md">
        <h2 className="text-xl font-bold mb-2">Calificar a {persona.nombre}</h2>

        {enviado ? (
          <p className="bg-green-100 text-green-700 p-3 rounded">
            Gracias por tu calificacion!
          </p>
        ) : (
          <>
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
            )}

            <p className="mb-2">Selecciona tu puntuacion:</p>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((numero) => (
                <button
                  key={numero}
                  type="button"
                  onClick={() => setPuntuacion(numero)}
                  className="text-4xl cursor-pointer"
                >
                  {numero <= puntuacion ? '★' : '☆'}
                </button>
              ))}
            </div>

            <label className="block mb-1">Comentario (opcional)</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Cuenta como fue tu experiencia..."
            />

            <button
              onClick={handleEnviar}
              className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
            >
              Enviar calificacion
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Calificar