import { useState } from 'react'
import { API_URL } from '../config'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Header from './Header'

function RestablecerContrasena() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [nuevaContraseña, setNuevaContraseña] = useState('')
  const [confirmarContraseña, setConfirmarContraseña] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('El enlace no es válido. Solicita uno nuevo.')
      return
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (nuevaContraseña.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres')
      return
    }

    setEnviando(true)

    fetch(API_URL + '/api/auth/restablecer-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nuevaContraseña })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al restablecer la contraseña')
        }
        return data
      })
      .then(() => {
        setExito(true)
        setEnviando(false)
        setTimeout(() => navigate('/login'), 2500)
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
      })
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6 max-w-sm mx-auto">
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
            Este enlace no es válido. Vuelve a solicitar la recuperación de tu contraseña.
          </p>
          <Link to="/olvide-contrasena" className="text-[#2C3E50] underline text-sm">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Crea tu nueva contraseña</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {exito ? (
          <p className="bg-green-100 text-green-700 p-4 rounded">
            ¡Listo! Tu contraseña fue actualizada. Te llevamos a iniciar sesión...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
            <div>
              <label className="block mb-1">Nueva contraseña <span className="text-red-600">*</span></label>
              <input
                type="password"
                value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)}
                className="w-full p-2 border rounded"
                autoComplete="off"
                required
              />
              <p className="text-xs text-yellow-600 mt-1">Mínimo 6 caracteres.</p>
            </div>

            <div>
              <label className="block mb-1">Confirma la contraseña <span className="text-red-600">*</span></label>
              <input
                type="password"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
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
              {enviando ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RestablecerContrasena