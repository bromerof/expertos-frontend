import { Routes, Route } from 'react-router-dom'
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

function App() {
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
    </Routes>
  )
}

export default App