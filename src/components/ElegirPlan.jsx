import { Link } from 'react-router-dom'
import Header from './Header'

function ElegirPlan() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1 text-center">¿Con qué plan quieres empezar?</h2>
        <p className="text-gray-500 mb-8 text-center">
          Puedes cambiar de plan cuando quieras después de registrarte.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-300 rounded p-6 flex flex-col">
            <p className="font-bold text-lg mb-1">Free</p>
            <p className="text-2xl font-bold text-[#2C3E50] mb-4">$0</p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-2 mb-6 flex-1">
              <li>Perfil público con tu profesión</li>
              <li>Apareces en las búsquedas</li>
              <li>Recibes contactos por WhatsApp</li>
              <li>Recibes calificaciones</li>
            </ul>
            <Link
              to="/registro?plan=free"
              className="text-center px-4 py-3 border border-[#2C3E50] text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-gray-100"
            >
              Continuar con Free
            </Link>
          </div>

          <div className="bg-[#2C3E50] rounded p-6 flex flex-col text-white relative">
            <span className="absolute -top-3 right-4 px-2 py-0.5 bg-yellow-400 text-[#2C3E50] text-xs font-bold rounded-full">
              ⭐ Recomendado
            </span>
            <p className="font-bold text-lg mb-1">Pro</p>
            <p className="text-2xl font-bold mb-1">$4.900<span className="text-sm font-normal">/mes</span></p>
            <p className="text-xs text-gray-300 mb-4">Primer mes gratis</p>
            <ul className="text-sm list-disc list-inside space-y-2 mb-6 flex-1">
              <li>Todo lo del plan Free, y además:</li>
              <li>Apareces primero en los resultados de búsqueda</li>
              <li>Sello "Pro" visible en tu perfil y tarjeta</li>
              <li>Puedes publicar varias profesiones en tu cuenta</li>
              <li>Acceso a Oportunidades (necesidades publicadas por clientes)</li>
              <li>Estadísticas de vistas, contactos y búsquedas</li>
              <li>Galería de fotos de tus trabajos</li>
            </ul>
            <Link
              to="/registro?plan=pro"
              className="text-center px-4 py-3 bg-yellow-400 text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-yellow-500"
            >
              Continuar con Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElegirPlan