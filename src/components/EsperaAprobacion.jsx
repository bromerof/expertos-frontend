import { Link } from 'react-router-dom'
import Header from './Header'

function EsperaAprobacion() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-5xl mb-4">⏳</p>
        <h2 className="text-xl font-bold text-[#2C3E50] mb-2">¡Registro exitoso!</h2>
        <p className="text-gray-600 mb-6">
          Ya recibimos tu informacion y tus fotos. Un administrador va a revisar tu cuenta
          antes de activarla — normalmente esto toma entre 20 y 30 minutos.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Puedes cerrar esta pagina tranquilamente. Cuando quieras verificar si ya fuiste
          aprobado, entra a tu panel.
        </p>
        <Link
          to="/panel"
          className="inline-block px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
        >
          Ir a mi panel
        </Link>
      </div>
    </div>
  )
}

export default EsperaAprobacion