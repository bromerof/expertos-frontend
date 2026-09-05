import { useState } from 'react'
import { API_URL } from '../config'
import { Link } from 'react-router-dom'
import Header from './Header'

function OlvideContrasena() {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    fetch(API_URL + '/api/auth/olvide-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al procesar la solicitud')
        }
        return data
      })
      .then(() => {
        setEnviado(true)
        setEnviando(false)
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-1">Recuperar contraseña</h2>
        <p className="text-sm text-gray-600 mb-4">
          Escribe el correo con el que te registraste, y te enviaremos un enlace para crear una contraseña nueva.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {enviado ? (
          <div className="bg-green-100 text-green-700 p-4 rounded">
            <p className="mb-2">Si el correo existe en nuestra plataforma, te enviamos un enlace para restablecer tu contraseña.</p>
            <p className="text-sm">Revisa tu bandeja de entrada (y la carpeta de spam, por si acaso).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
            <div>
              <label className="block mb-1">Correo electrónico <span className="text-red-600">*</span></label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full p-2 border rounded"
                autoComplete="off"
                required
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f] disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <Link to="/login" className="inline-block mt-4 text-[#2C3E50] underline text-sm">
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  )
}

export default OlvideContrasena