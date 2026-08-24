import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RegistroExperto() {
  const navigate = useNavigate()
   const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    whatsapp: '',
    correo: '',
    contraseña: '',
    anosExperiencia: '',
        atiendePresencial: true,
    atiendeVirtual: false,
    coberturaVirtualNacional: false,
    tipoDocumento: 'CC',
    numeroDocumento: ''
  })

  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  // Cada fila de ubicacion: { departamentoId, municipioId }
  const [ubicaciones, setUbicaciones] = useState([{ departamentoId: '', municipioId: '' }])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [])

  const cargarMunicipios = (departamentoId) => {
    if (municipiosPorDepartamento[departamentoId]) {
      return
    }
    fetch('http://localhost:3000/api/municipios?departamento=' + departamentoId)
      .then(res => res.json())
      .then(data => {
        setMunicipiosPorDepartamento((prev) => ({ ...prev, [departamentoId]: data }))
      })
      .catch(err => console.error('Error al cargar municipios:', err))
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleDepartamentoChange = (index, departamentoId) => {
    const nuevas = [...ubicaciones]
    nuevas[index] = { departamentoId: departamentoId, municipioId: '' }
    setUbicaciones(nuevas)
    if (departamentoId) {
      cargarMunicipios(departamentoId)
    }
  }

  const handleMunicipioChange = (index, municipioId) => {
    const nuevas = [...ubicaciones]
    nuevas[index] = { ...nuevas[index], municipioId: municipioId }
    setUbicaciones(nuevas)
  }

  const agregarUbicacion = () => {
    setUbicaciones([...ubicaciones, { departamentoId: '', municipioId: '' }])
  }

  const quitarUbicacion = (index) => {
    const nuevas = ubicaciones.filter((_, i) => i !== index)
    setUbicaciones(nuevas)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
        const confirmar = window.confirm('Revisa que toda tu informacion este correcta (especialmente tu nombre) antes de continuar. Deseas registrarte con estos datos?')
    if (!confirmar) return

        const idsMunicipios = ubicaciones
      .map(u => u.municipioId)
      .filter(id => id !== '')

    if (idsMunicipios.length === 0 && !formData.coberturaVirtualNacional) {
      setError('Debes seleccionar al menos una ubicacion, o marcar cobertura nacional virtual')
      return
    }

    const datosCompletos = { ...formData, ubicaciones: idsMunicipios }

    fetch('http://localhost:3000/api/auth/registro', {
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
      .then((expertoCreado) => {
        alert('Registro exitoso! Ahora puedes iniciar sesion.')
        navigate('/experto/' + expertoCreado._id)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C3E50] p-4">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
      </header>

      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Registro de experto</h2>

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
            <label className="block mb-1">Categoria</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Descripcion</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Modalidad de atencion</label>
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
                Mi servicio virtual cubre toda Colombia
              </label>
            </div>
          )}

          <div>
            <label className="block mb-1">Ciudades donde atiendes</label>
            {ubicaciones.map((ubicacion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={ubicacion.departamentoId}
                  onChange={(e) => handleDepartamentoChange(index, e.target.value)}
                  className="w-1/2 p-2 border rounded"
                >
                  <option value="">Departamento</option>
                  {departamentos.map((depto) => (
                    <option key={depto._id} value={depto._id}>{depto.nombre}</option>
                  ))}
                </select>

                <select
                  value={ubicacion.municipioId}
                  onChange={(e) => handleMunicipioChange(index, e.target.value)}
                  className="w-1/2 p-2 border rounded"
                  disabled={!ubicacion.departamentoId}
                >
                  <option value="">Municipio</option>
                  {(municipiosPorDepartamento[ubicacion.departamentoId] || []).map((muni) => (
                    <option key={muni._id} value={muni._id}>{muni.nombre}</option>
                  ))}
                </select>

                {ubicaciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => quitarUbicacion(index)}
                    className="px-3 bg-gray-300 rounded"
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={agregarUbicacion}
              className="text-[#2C3E50] underline text-sm"
            >
              + Agregar otra ciudad
            </button>
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
            <label className="block mb-1">Anos de experiencia</label>
            <input
              type="number"
              name="anosExperiencia"
              value={formData.anosExperiencia}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroExperto