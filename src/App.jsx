import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Landing from './components/Landing'
import Buscar from './components/Buscar'
import PerfilExperto from './components/PerfilExperto'
import RegistroExperto from './components/RegistroExperto'
import RegistroCliente from './components/RegistroCliente'
import Login from './components/Login'
import PanelExperto from './components/PanelExperto'
import PanelAdmin from './components/PanelAdmin'
import Calificar from './components/Calificar'
import Terminos from './components/Terminos'
import PoliticaDatos from './components/PoliticaDatos'
import ReglasExpertos from './components/ReglasExpertos'
import PreguntasFrecuentes from './components/PreguntasFrecuentes'
import PublicarNecesidad from './components/PublicarNecesidad'
import Oportunidades from './components/Oportunidades'
import AporteConfirmacion from './components/AporteConfirmacion'
import EstadisticasAdmin from './components/EstadisticasAdmin'
import Blog from './components/Blog'
import ArticuloBlog from './components/ArticuloBlog'
import GestionBlog from './components/GestionBlog'
import OfertasAdmin from './components/OfertasAdmin'
import ActivarPro from './components/ActivarPro'
import GestionPreguntas from './components/GestionPreguntas'
import OlvideContrasena from './components/OlvideContrasena'
import RestablecerContrasena from './components/RestablecerContrasena'
import ElegirPlan from './components/ElegirPlan'
import EsperaAprobacion from './components/EsperaAprobacion'

// Cierra la sesion automaticamente despues de 1 hora sin ninguna actividad
// (sin clics, sin escribir, sin moverse). Se reinicia cada vez que la
// persona hace algo, para que solo se cierre si de verdad esta inactiva.
const TIEMPO_INACTIVIDAD_MS = 60 * 60 * 1000 // 1 hora

function App() {
  const navigate = useNavigate()
  const ubicacion = useLocation()
  const temporizadorRef = useRef(null)

  // Avisa a Google Analytics cada vez que la persona cambia de pantalla.
  // Es necesario hacerlo asi (a mano) porque, al ser una aplicacion de una
  // sola pagina, el navegador nunca "recarga" de verdad entre pantallas, y
  // Analytics por si solo no se entera de esos cambios.
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: ubicacion.pathname + ubicacion.search,
        page_title: document.title
      })
    }
  }, [ubicacion])

  useEffect(() => {
    const cerrarSesionPorInactividad = () => {
      const token = localStorage.getItem('token')
      if (!token) return // nadie logueado, no hay nada que cerrar

      localStorage.removeItem('token')
      localStorage.removeItem('expertoId')
      localStorage.removeItem('rol')
      navigate('/login')
    }

    const reiniciarTemporizador = () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current)
      temporizadorRef.current = setTimeout(cerrarSesionPorInactividad, TIEMPO_INACTIVIDAD_MS)
    }

    const eventos = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    eventos.forEach((evento) => window.addEventListener(evento, reiniciarTemporizador))

    reiniciarTemporizador()

    return () => {
      eventos.forEach((evento) => window.removeEventListener(evento, reiniciarTemporizador))
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current)
    }
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route path="/experto/:id" element={<PerfilExperto />} />
      <Route path="/registro" element={<RegistroExperto />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />    
      <Route path="/login" element={<Login />} />
      <Route path="/panel" element={<PanelExperto />} />
      <Route path="/admin" element={<PanelAdmin />} />
      <Route path="/calificar/:id" element={<Calificar />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/politica-datos" element={<PoliticaDatos />} />
      <Route path="/reglas-expertos" element={<ReglasExpertos />} />
      <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
      <Route path="/publicar-necesidad" element={<PublicarNecesidad />} />
      <Route path="/oportunidades" element={<Oportunidades />} />
      <Route path="/aporte-confirmacion" element={<AporteConfirmacion />} />
      <Route path="/admin/estadisticas" element={<EstadisticasAdmin />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<ArticuloBlog />} />
      <Route path="/admin/blog" element={<GestionBlog />} />
      <Route path="/admin/ofertas" element={<OfertasAdmin />} />
      <Route path="/activar-pro" element={<ActivarPro />} />
      <Route path="/admin/preguntas" element={<GestionPreguntas />} />
      <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
      <Route path="/elegir-plan" element={<ElegirPlan />} />
      <Route path="/espera-aprobacion" element={<EsperaAprobacion />} />
    </Routes>
  )
}

export default App