import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import logo from '../assets/logo.png'

const CATEGORIAS_DESTACADAS_CHIPS = ['Tecnología', 'Diseño', 'Marketing', 'Finanzas', 'Educación', 'Legal']

function Landing() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetch(API_URL + '/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data.slice(0, 10)))
      .catch(err => console.error('Error al cargar categorias:', err))
  }, [])

  const handleSoporte = () => {
    const mensaje = 'Hola, necesito ayuda con la plataforma EXPERTOS.'
    const enlace = 'https://wa.me/573014676244?text=' + encodeURIComponent(mensaje)
    window.open(enlace, '_blank')
  }

  const handleOpinion = () => {
    const mensaje = 'Hola, quiero compartir mi opinion sobre la plataforma EXPERTOS.'
    const enlace = 'https://wa.me/573014676244?text=' + encodeURIComponent(mensaje)
    window.open(enlace, '_blank')
  }

  const irABuscar = () => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')

    if (token && rol === 'cliente') {
      navigate('/buscar')
    } else {
      navigate('/registro-cliente')
    }
  }

  const handleBuscarHero = (e) => {
    e.preventDefault()
    irABuscar()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barra superior fija: igual sin importar si hay sesion iniciada */}
      <header className="bg-[#2C3E50] px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo EXPERTOS" className="h-10 w-10" />
          <span className="text-white text-2xl font-bold">EXPERTOS</span>
        </div>

        <nav className="flex items-center gap-6 flex-wrap text-white">
          <button onClick={irABuscar} className="underline cursor-pointer hover:text-gray-300">
            Buscar expertos
          </button>
          <a href="#categorias" className="underline cursor-pointer hover:text-gray-300">
            Categorías
          </a>
          <a href="#como-funciona" className="underline cursor-pointer hover:text-gray-300">
            Cómo funciona
          </a>
          <Link to="/elegir-plan" className="underline cursor-pointer hover:text-gray-300">
            Regístrate como experto
          </Link>
        </nav>

        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/login" className="text-white underline cursor-pointer hover:text-gray-300">
            Iniciar sesión
          </Link>
          <Link to="/registro-cliente" className="text-white underline cursor-pointer hover:text-gray-300">
            Regístrate como cliente
          </Link>
          <button
            onClick={handleSoporte}
            className="px-4 py-2 bg-white text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-gray-200"
          >
            ¿Necesitas ayuda? Soporte
          </button>
          <button
            onClick={handleOpinion}
            className="px-4 py-2 bg-white text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-gray-200"
          >
            Danos tu opinión
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-3xl mx-auto">
        <p className="text-[#2C3E50] font-semibold mb-2">👋 ¡Bienvenido a EXPERTOS!</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
          Encuentra al experto que necesitas.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Conecta con profesionales especializados y encuentra soluciones para tus necesidades,
          de forma fácil, segura y flexible.
        </p>

        <form onSubmit={handleBuscarHero} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. Diseñador gráfico, contador, programador..."
            className="w-full p-3 rounded border border-gray-300"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f] whitespace-nowrap"
          >
            Buscar expertos
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {CATEGORIAS_DESTACADAS_CHIPS.map((nombre) => (
            <span key={nombre} className="px-3 py-1 bg-[#F5F5F5] text-[#2C3E50] rounded-full text-sm">
              {nombre}
            </span>
          ))}
        </div>
      </section>

      {/* Dos caminos */}
      <section className="px-6 py-12 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <p className="text-3xl mb-2">👤</p>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-2">¿Necesitas un experto?</h3>
            <p className="text-gray-600 mb-4">
              Encuentra profesionales especializados para resolver tus necesidades.
            </p>
            <button
              onClick={irABuscar}
              className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
            >
              Buscar expertos →
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow text-center">
            <p className="text-3xl mb-2">💼</p>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-2">¿Eres experto?</h3>
            <p className="text-gray-600 mb-4">
              Comparte tu experiencia, ofrece tus servicios y encuentra nuevas oportunidades.
            </p>
            <Link
              to="/elegir-plan"
              className="inline-block px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
            >
              Quiero ser experto →
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias reales del catalogo */}
      <section id="categorias" className="px-6 py-12 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">¿Qué necesitas?</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categorias.map((cat) => (
            <span
              key={cat._id}
              className="px-4 py-2 bg-[#F5F5F5] text-[#2C3E50] rounded-full text-sm"
            >
              {cat.nombre}
            </span>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="px-6 py-12 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-8">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-400 font-bold">01</p>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-1">Busca</h3>
              <p className="text-gray-600">🔎 Encuentra el experto según lo que necesitas.</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-bold">02</p>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-1">Conecta</h3>
              <p className="text-gray-600">💬 Revisa su perfil, experiencia y ponte en contacto directamente.</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-bold">03</p>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-1">Acuerda</h3>
              <p className="text-gray-600">
                🤝 Define directamente con el experto el servicio, precio, modalidad y condiciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-8 text-center">¿Por qué EXPERTOS?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-bold text-[#2C3E50]">🔹 Profesionales especializados</p>
            <p className="text-gray-600">Encuentra personas con conocimientos y experiencia.</p>
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">🔹 Información transparente</p>
            <p className="text-gray-600">Conoce el perfil y experiencia antes de contratar.</p>
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">🔹 Libertad para acordar</p>
            <p className="text-gray-600">Cliente y experto definen las condiciones del servicio.</p>
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">🔹 Una plataforma, múltiples soluciones</p>
            <p className="text-gray-600">Encuentra profesionales de diferentes áreas.</p>
          </div>
        </div>
      </section>

      {/* Seccion para expertos */}
      <section className="px-6 py-12 bg-[#2C3E50] text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Tu experiencia tiene valor.</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Convierte tus conocimientos y habilidades en nuevas oportunidades profesionales.
        </p>
        <Link
          to="/elegir-plan"
          className="inline-block px-6 py-3 bg-white text-[#2C3E50] rounded font-bold cursor-pointer hover:bg-gray-200 mb-8"
        >
          Regístrate como experto →
        </Link>

        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6 text-left">
          <div>
            <p className="font-bold">1. Crea tu perfil</p>
          </div>
          <div>
            <p className="font-bold">2. Publica tus servicios</p>
          </div>
          <div>
            <p className="font-bold">3. Conecta con clientes</p>
          </div>
        </div>
      </section>

      {/* Seccion comercial: EXPERTO PRO */}
      <section className="px-6 py-12 bg-[#F5F5F5]">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border-2 border-yellow-400 relative">
          <span className="absolute -top-4 left-8 px-3 py-1 bg-yellow-400 text-[#2C3E50] text-sm font-bold rounded-full">
            ⭐ Haz visible tu experiencia
          </span>
          <h2 className="text-3xl font-bold text-[#2C3E50] mt-2 mb-1">EXPERTO PRO</h2>
          <p className="text-gray-600 mb-6">Todo lo que necesitas para destacar entre los demás expertos.</p>

          <ul className="grid sm:grid-cols-2 gap-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Apareces primero en los resultados de búsqueda</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Sello "Pro" visible en tu perfil y tarjeta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Publica varias profesiones en tu cuenta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Acceso a Oportunidades: necesidades publicadas por clientes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Estadísticas de vistas, contactos y búsquedas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Todo lo del plan Free, incluido</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm text-green-700 font-bold mb-1">Primer mes GRATIS</p>
              <p className="text-2xl font-bold text-[#2C3E50]">
                $4.900<span className="text-base font-normal text-gray-500"> COP/mes después</span>
              </p>
            </div>
            <Link
              to="/registro?plan=pro"
              className="px-6 py-3 bg-yellow-400 text-[#2C3E50] rounded font-bold text-center cursor-pointer hover:bg-yellow-500 whitespace-nowrap"
            >
              Quiero ser EXPERTO PRO →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios de ejemplo */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-8 text-center">
          ⭐ Lo que dicen nuestros usuarios
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "Encontré rápidamente un profesional que pudo solucionar mi problema."
            </p>
            <p className="font-bold text-[#2C3E50]">Laura — Emprendedora</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "EXPERTOS me permitió encontrar nuevos clientes y mostrar mi experiencia."
            </p>
            <p className="font-bold text-[#2C3E50]">Andrés — Consultor</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "Necesitaba un plomero con urgencia y en minutos encontré uno cerca de mi casa."
            </p>
            <p className="font-bold text-[#2C3E50]">Ana — Ama de casa</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "Desde que me uní a EXPERTOS he conseguido mas clientes en mi zona sin repartir volantes."
            </p>
            <p className="font-bold text-[#2C3E50]">Juan — Electricista</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "Gracias a EXPERTOS enseño matematicas de forma virtual a estudiantes de todo Colombia."
            </p>
            <p className="font-bold text-[#2C3E50]">David — Profesor de matemáticas</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              "He podido ofrecer mis servicios de desarrollo de software y paginas web a clientes que nunca hubiera conocido de otra forma."
            </p>
            <p className="font-bold text-[#2C3E50]">Marcela — Desarrolladora de software</p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-12 bg-[#F5F5F5] text-center">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">¿Necesitas una solución?</h2>
        <p className="text-gray-600 mb-4">Hay un experto para eso.</p>
        <button
          onClick={irABuscar}
          className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f] mb-8"
        >
          Encuentra un experto →
        </button>

        <p className="text-gray-600 mb-1">¿Tienes conocimientos para compartir?</p>
        <Link to="/elegir-plan" className="text-[#2C3E50] underline font-bold cursor-pointer hover:text-[#1a252f]">
          Regístrate como experto →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] text-white text-center py-8 text-sm">
        <div className="flex justify-center gap-6">
          <Link to="/preguntas-frecuentes" className="text-base font-bold underline hover:text-gray-300">
            Preguntas frecuentes
          </Link>
          <Link to="/blog" className="text-base font-bold underline hover:text-gray-300">
            Blog
          </Link>
        </div>
        <p className="mt-3 text-gray-300">© {new Date().getFullYear()} EXPERTOS. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Landing