import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Header({ children }) {
  const handleSoporte = () => {
    const mensaje = 'Hola, necesito ayuda con la plataforma EXPERTOS.'
    const enlace = 'https://wa.me/573014676244?text=' + encodeURIComponent(mensaje)
    window.open(enlace, '_blank')
  }

  return (
    <header className="bg-[#2C3E50] p-4 flex flex-wrap justify-between items-center gap-3">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo EXPERTOS" className="h-10 w-10" />
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          to="/registro"
          className="text-white underline cursor-pointer hover:text-gray-300"
        >
          Soy Experto
        </Link>
        <Link
          to="/registro-cliente"
          className="text-white underline cursor-pointer hover:text-gray-300"
        >
          Soy Cliente
        </Link>
        <button
          onClick={handleSoporte}
          className="px-4 py-2 bg-white text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-gray-200"
        >
          ¿Necesitas ayuda? Soporte
        </button>
        {children}
      </div>
    </header>
  )
}

export default Header