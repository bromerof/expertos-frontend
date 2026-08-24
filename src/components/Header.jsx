function Header({ children }) {
  const handleSoporte = () => {
    const mensaje = 'Hola, necesito ayuda con la plataforma EXPERTOS.'
    const enlace = 'https://wa.me/573014676244?text=' + encodeURIComponent(mensaje)
    window.open(enlace, '_blank')
  }

  return (
    <header className="bg-[#2C3E50] p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      <div className="flex items-center gap-4">
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