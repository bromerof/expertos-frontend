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
    </Routes>
  )
}

export default App