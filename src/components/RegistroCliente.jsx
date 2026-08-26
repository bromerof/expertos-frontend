import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

function RegistroCliente() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    correo: '',
    whatsapp: '',
    contraseña: '',
    atiendePresencial: true,
    atiendeVirtual: false,
    coberturaVirtualNacional: false
  })

  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  // El cliente solo necesita UNA ubicacion (no varias como el experto)
  const [departamentoId, setDepartamentoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [])

  const cargarMunicipios = (idDepartamento) => {
    if (municipiosPorDepartamento[idDepartamento]) {
      return
    }
    fetch(API_URL + '/api/municipios?departamento=' + idDepartamento)
      .then(res => res.json())
      .then(data => {
        setMunicipiosPorDepartamento((prev) => ({ ...prev, [idDepartamento]: data }))
      })
      .catch(err => console.error('Error al cargar municipios:', err))
  }

  const handleDepartamentoChange = (idDepartamento) => {
    setDepartamentoId(idDepartamento)
    setMunicipioId('')
    if (idDepartamento) {
      cargarMunicipios(idDepartamento)
    }
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const confirmar = window.confirm('Revisa que toda tu informacion este correcta antes de continuar. Deseas registrarte con estos datos?')
    if (!confirmar) return

    if (!municipioId && !formData.coberturaVirtualNacional) {
      setError('Debes seleccionar tu ciudad, o marcar cobertura nacional virtual')
      return
    }

    const datosCompletos = {
      ...formData,
      ubicaciones: municipioId ? [municipioId] : [],
      rol: 'cliente'
    }

    fetch(API_URL + '/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCompletos)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al registrar')
        }
        return data
      })
      .then(() => {
        alert('Registro exitoso! Ahora puedes iniciar sesion.')
        navigate('/login')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Registro de cliente</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Tipo de documento</label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="CC">Cedula de Ciudadania</option>
              <option value="CE">Cedula de Extranjeria</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Numero de documento</label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Correo electronico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Modalidad de atencion que buscas</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="atiendePresencial"
                  checked={formData.atiendePresencial}
                  onChange={handleChange}
                />
                Presencial
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="atiendeVirtual"
                  checked={formData.atiendeVirtual}
                  onChange={handleChange}
                />
                Virtual
              </label>
            </div>
          </div>

          {formData.atiendeVirtual && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="coberturaVirtualNacional"
                  checked={formData.coberturaVirtualNacional}
                  onChange={handleChange}
                />
                Busco atencion virtual sin importar la ciudad del experto
              </label>
            </div>
          )}

          <div>
            <label className="block mb-1">Ciudad donde requieres el servicio</label>
            <div className="flex gap-2">
              <select
                value={departamentoId}
                onChange={(e) => handleDepartamentoChange(e.target.value)}
                className="w-1/2 p-2 border rounded"
              >
                <option value="">Departamento</option>
                {departamentos.map((depto) => (
                  <option key={depto._id} value={depto._id}>{depto.nombre}</option>
                ))}
              </select>

              <select
                value={municipioId}
                onChange={(e) => setMunicipioId(e.target.value)}
                className="w-1/2 p-2 border rounded"
                disabled={!departamentoId}
              >
                <option value="">Municipio</option>
                {(municipiosPorDepartamento[departamentoId] || []).map((muni) => (
                  <option key={muni._id} value={muni._id}>{muni.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroCliente