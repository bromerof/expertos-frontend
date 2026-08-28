import { useState } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [rolSeleccionado, setRolSeleccionado] = useState('experto')
  const [error, setError] = useState('')

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
          throw new Error(data.mensaje || 'Error al iniciar sesion')
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

  return (
    <div className="min-h-screen bg-gray-50">
            <Header />

      <div className="p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Iniciar sesion</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1">Correo electronico</label>
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
            <label className="block mb-1">Contrasena</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">
              ¿Como quieres ingresar?
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
          </div>

                    <button
            type="submit"
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
          >
            Iniciar sesion
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login