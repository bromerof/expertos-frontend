import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from './Header'

function Calificar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const rol = localStorage.getItem('rol')

  const [persona, setPersona] = useState(null)
  const [puntuacion, setPuntuacion] = useState(0)
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [enviado, setEnviado] = useState(false)

  const [montoAporte, setMontoAporte] = useState('')
  const [errorAporte, setErrorAporte] = useState('')
  const [generandoAporte, setGenerandoAporte] = useState(false)

  useEffect(() => {
    if (!token) return

    fetch(`${API_URL}/api/expertos/${id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar el perfil')
        }
        return data
      })
      .then(data => setPersona(data))
      .catch(err => setErrorCarga(err.message))
  }, [id, token])

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

  const handleAportar = () => {
    setErrorAporte('')
    const montoNum = parseInt(montoAporte, 10)

    if (!montoNum || montoNum < 1000) {
      setErrorAporte('El aporte minimo es de $1.000 COP')
      return
    }

    setGenerandoAporte(true)

    fetch(API_URL + '/api/pagos/aporte/generar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ monto: montoNum })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al generar el aporte')
        }
        return data
      })
      .then((data) => {
        // Construimos un formulario y lo enviamos a Wompi (Web Checkout)
        const form = document.createElement('form')
        form.method = 'GET'
        form.action = 'https://checkout.wompi.co/p/'

        const campos = {
          'public-key': data.llavePublica,
          'currency': 'COP',
          'amount-in-cents': data.montoEnCentavos,
          'reference': data.referencia,
          'signature:integrity': data.firma,
          'redirect-url': data.redirectUrl
        }

        Object.entries(campos).forEach(([nombre, valor]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = nombre
          input.value = valor
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      })
      .catch((err) => {
        setErrorAporte(err.message)
        setGenerandoAporte(false)
      })
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <p className="mb-4">Debes iniciar sesión para poder calificar.</p>
          <Link to="/login" className="text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  if (errorCarga) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <p className="bg-red-100 text-red-700 p-3 rounded max-w-lg">{errorCarga}</p>
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
          <>
            <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
              Gracias por tu calificacion!
            </p>

            {rol === 'cliente' && (
              <div className="bg-white border border-gray-300 rounded p-4">
                <p className="font-bold mb-1">¿Quieres apoyar a EXPERTOS?</p>
                <p className="text-sm text-gray-600 mb-3">
                  Este aporte es totalmente voluntario y ayuda a mantener la plataforma funcionando.
                </p>

                {errorAporte && (
                  <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{errorAporte}</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={montoAporte}
                    onChange={(e) => setMontoAporte(e.target.value)}
                    placeholder="Ej. 5000"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleAportar}
                    disabled={generandoAporte}
                    className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f] disabled:opacity-60 whitespace-nowrap"
                  >
                    {generandoAporte ? 'Espera...' : 'Aportar'}
                  </button>
                </div>
              </div>
            )}
          </>
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