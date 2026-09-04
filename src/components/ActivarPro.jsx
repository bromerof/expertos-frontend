import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'

// NOTA IMPORTANTE: esta pantalla esta preparada pero AUN NO SE PUEDE PROBAR
// de punta a punta, porque Wompi todavia no ha activado 3D Secure para
// Fuentes de Pago en la cuenta de EXPERTOS (caso pendiente con su soporte).
// El codigo sigue la documentacion oficial, pero algunos detalles (el nombre
// exacto del campo que entrega el widget al tokenizar) deben confirmarse en
// la primera prueba real.

function ActivarPro() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = localStorage.getItem('token')
  const formRef = useRef(null)

  const [tokens, setTokens] = useState(null)
  const [error, setError] = useState(searchParams.get('error') || '')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetch(API_URL + '/api/pagos/token-aceptacion', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al preparar la activacion')
        }
        return data
      })
      .then((data) => {
        setTokens(data)
        setCargando(false)
      })
      .catch((err) => {
        setError(err.message)
        setCargando(false)
      })
  }, [token, navigate])

  // Una vez tenemos la llave publica, insertamos el script del widget de
  // Wompi en modo "tokenize" dentro del formulario, para que dibuje su
  // propio boton de captura de tarjeta.
  useEffect(() => {
    if (!tokens || !formRef.current) return

    const script = document.createElement('script')
    script.src = 'https://checkout.wompi.co/widget.js'
    script.setAttribute('data-render', 'button')
    script.setAttribute('data-widget-operation', 'tokenize')
    script.setAttribute('data-public-key', tokens.llavePublica)
    formRef.current.appendChild(script)

    return () => {
      if (formRef.current && formRef.current.contains(script)) {
        formRef.current.removeChild(script)
      }
    }
  }, [tokens])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-md">
        <h2 className="text-xl font-bold mb-1">Activar plan Pro</h2>
        <p className="text-sm text-gray-500 mb-4">
          Primer mes gratis. Despues, $4.900 COP/mes. Puedes cancelar cuando quieras.
        </p>

        <div className="bg-white border border-gray-300 rounded p-4 mb-4">
          <p className="font-bold mb-2">Beneficios del plan Pro</p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <li>Apareces primero en los resultados de busqueda</li>
            <li>Sello "Pro" visible en tu perfil y tarjeta</li>
            <li>Puedes publicar varias profesiones en tu cuenta</li>
            <li>Acceso a Oportunidades (necesidades publicadas por clientes)</li>
            <li>Estadisticas de vistas, contactos y apariciones en busquedas</li>
          </ul>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {cargando && <p>Preparando la activacion...</p>}

        {tokens && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <p className="text-sm text-gray-600 mb-3">
              Registra tu tarjeta para activar el mes gratis. No se te cobrara nada hoy.
            </p>
            <form ref={formRef} method="POST" action={`${API_URL}/api/pagos/registrar-fuente-pago`}>
              {/* El formulario nativo no puede llevar el header Authorization,
                  por eso el token viaja como campo oculto */}
              <input type="hidden" name="authToken" value={token} />
              <input type="hidden" name="tokenTerminos" value={tokens.tokenTerminos} />
              {tokens.tokenDatosPersonales && (
                <input type="hidden" name="tokenDatosPersonales" value={tokens.tokenDatosPersonales} />
              )}
              {/* El boton de Wompi se inserta aqui automaticamente */}
            </form>
            <p className="text-xs text-gray-400 mt-3">
              Esta funcion todavia esta en preparacion: Wompi debe activar la
              verificación de seguridad (3D Secure) en la cuenta de EXPERTOS
              antes de que el registro de la tarjeta funcione de principio a fin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivarPro