import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

function AporteConfirmacion() {
  const [searchParams] = useSearchParams()
  const [estado, setEstado] = useState('verificando')
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const idTransaccion = searchParams.get('id')

    if (!idTransaccion) {
      setEstado('sin_datos')
      return
    }

    if (!token) {
      setEstado('sin_sesion')
      return
    }

    fetch(API_URL + '/api/pagos/verificar/' + idTransaccion, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al verificar el pago')
        }
        return data
      })
      .then((data) => setEstado(data.estado))
      .catch((err) => {
        setError(err.message)
        setEstado('error')
      })
  }, [searchParams, token])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Tu aporte</h2>

        {estado === 'verificando' && <p>Verificando tu pago...</p>}

        {estado === 'aprobada' && (
          <p className="bg-green-100 text-green-700 p-4 rounded">
            ¡Gracias por tu aporte! Tu pago fue aprobado correctamente.
          </p>
        )}

        {estado === 'rechazada' && (
          <p className="bg-red-100 text-red-700 p-4 rounded">
            Tu pago no pudo procesarse. Puedes intentarlo de nuevo mas tarde.
          </p>
        )}

        {estado === 'pendiente' && (
          <p className="bg-yellow-100 text-yellow-800 p-4 rounded">
            Tu pago esta pendiente de confirmación. Esto puede tomar unos minutos.
          </p>
        )}

        {estado === 'sin_datos' && (
          <p className="bg-red-100 text-red-700 p-4 rounded">
            No encontramos información sobre tu pago.
          </p>
        )}

        {estado === 'sin_sesion' && (
          <p className="bg-red-100 text-red-700 p-4 rounded">
            Debes iniciar sesión para verificar tu pago.
          </p>
        )}

        {estado === 'error' && (
          <p className="bg-red-100 text-red-700 p-4 rounded">{error}</p>
        )}

        <Link to="/buscar" className="inline-block mt-4 text-[#2C3E50] underline">
          Volver a la plataforma
        </Link>
      </div>
    </div>
  )
}

export default AporteConfirmacion