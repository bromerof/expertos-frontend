import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'
import { useNavigate, Link } from 'react-router-dom'
import Header from './Header'

function Login() {
  const navigate = useNavigate()
  const botonGoogleRef = useRef(null)
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [rolSeleccionado, setRolSeleccionado] = useState('experto')
  const [error, setError] = useState('')
  const [errorGoogle, setErrorGoogle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const datosLogin = { correo: correo, contraseña: contrasena, rol: rolSeleccionado }

    fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosLogin)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al iniciar sesión')
        }
        return data
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('expertoId', data.experto.id)
        localStorage.setItem('rol', data.experto.rol)

        if (data.experto.rol === 'admin') {
          navigate('/admin')
        } else {
          navigate('/panel')
        }
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleCredentialResponse = (response) => {
    setErrorGoogle('')

    fetch(API_URL + '/api/auth/google/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al verificar con Google')
        }
        return data
      })
      .then((data) => {
        if (data.existe) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('expertoId', data.experto.id)
          localStorage.setItem('rol', 'cliente')
          navigate('/panel')
        } else {
          setErrorGoogle('Todavía no tienes una cuenta de cliente con este correo de Google. Regístrate primero.')
        }
      })
      .catch((err) => {
        setErrorGoogle(err.message)
      })
  }

  // Solo mostramos "Continuar con Google" cuando la persona quiere entrar
  // como cliente (los expertos siempre completan su registro completo)
  useEffect(() => {
    if (rolSeleccionado !== 'cliente') return

    const intentarDibujar = () => {
      if (window.google && botonGoogleRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        })
        window.google.accounts.id.renderButton(botonGoogleRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 320
        })
        return true
      }
      return false
    }

    if (!intentarDibujar()) {
      const intervalo = setInterval(() => {
        if (intentarDibujar()) clearInterval(intervalo)
      }, 300)
      return () => clearInterval(intervalo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolSeleccionado])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}
        {errorGoogle && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorGoogle}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1">
            ¿Cómo quieres ingresar?
          </label>
          <select
            value={rolSeleccionado}
            onChange={(e) => setRolSeleccionado(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="experto">Entrar como Experto</option>
            <option value="cliente">Entrar como Cliente</option>
            <option value="admin">Entrar como Administrador</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona el tipo de cuenta con la que quieres iniciar sesión.
          </p>
        </div>

        {rolSeleccionado === 'cliente' && (
          <>
            <div ref={botonGoogleRef} className="mb-4"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-400">o con tu correo</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
          >
            Iniciar sesión
          </button>

          <Link to="/olvide-contrasena" className="text-center text-[#2C3E50] underline text-sm">
            ¿Olvidaste tu contraseña?
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login