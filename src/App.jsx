import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import PerfilExperto from './components/PerfilExperto'
import RegistroExperto from './components/RegistroExperto'
import RegistroCliente from './components/RegistroCliente'
import Login from './components/Login'
import PanelExperto from './components/PanelExperto'
import PanelAdmin from './components/PanelAdmin'
import Calificar from './components/Calificar'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/experto/:id" element={<PerfilExperto />} />
      <Route path="/registro" element={<RegistroExperto />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />    
      <Route path="/login" element={<Login />} />
      <Route path="/panel" element={<PanelExperto />} />
      <Route path="/admin" element={<PanelAdmin />} />
      <Route path="/calificar/:id" element={<Calificar />} />
    </Routes>
  )
}

export default App