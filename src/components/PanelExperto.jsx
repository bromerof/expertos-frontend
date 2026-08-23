import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PanelExperto() {
  const navigate = useNavigate()
  const [experto, setExperto] = useState(null)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    whatsapp: '',
    anosExperiencia: '',
    atiendePresencial: true,
    atiendeVirtual: false
  })
  const [ubicaciones, setUbicaciones] = useState([{ departamentoId: '', municipioId: '' }])
  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  const expertoId = localStorage.getItem('expertoId')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!expertoId || !token) {
      navigate('/login')
      return
    }
    cargarExperto()
    fetch('http://localhost:3000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [expertoId, token, navigate])

  const cargarExperto = () => {
    fetch('http://localhost:3000/api/expertos/' + expertoId, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setExperto(data)
        setFormData({
          nombre: data.nombre || '',
          categoria: data.categoria || '',
          descripcion: data.descripcion || '',
          whatsapp: data.whatsapp || '',
          anosExperiencia: data.anosExperiencia || '',
          atiendePresencial: data.atiendePresencial ?? true,
          atiendeVirtual: data.atiendeVirtual ?? false
        })
      })
      .catch(err => console.error('Error al cargar el perfil:', err))
  }

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

  const iniciarEdicion = () => {
    if (experto.ubicaciones && experto.ubicaciones.length > 0) {
      const ubicacionesIniciales = experto.ubicaciones.map((u) => {
        const departamentoId = u.departamento ? u.departamento._id : ''
        if (departamentoId) {
          cargarMunicipios(departamentoId)
        }
        return { departamentoId: departamentoId, municipioId: u._id }
      })
      setUbicaciones(ubicacionesIniciales)
    } else {
      setUbicaciones([{ departamentoId: '', municipioId: '' }])
    }
    setEditando(true)
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

  const handleGuardar = (e) => {
    e.preventDefault()
    setError('')

    const idsMunicipios = ubicaciones
      .map(u => u.municipioId)
      .filter(id => id !== '')

    if (idsMunicipios.length === 0) {
      setError('Debes seleccionar al menos una ubicacion')
      return
    }

    const datosCompletos = { ...formData, ubicaciones: idsMunicipios }

    fetch('http://localhost:3000/api/expertos/' + expertoId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(datosCompletos)
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al actualizar el perfil')
        }
        return data
      })
      .then(() => {
        cargarExperto()
        setEditando(false)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleEliminar = () => {
    const confirmar = window.confirm('Estas seguro de que quieres eliminar tu perfil? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch('http://localhost:3000/api/expertos/' + expertoId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al eliminar el perfil')
        }
        return data
      })
      .then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('expertoId')
        alert('Perfil eliminado correctamente')
        navigate('/')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expertoId')
    navigate('/login')
  }

  if (!experto) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#2C3E50] p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">EXPERTOS</h1>
        <button onClick={handleLogout} className="text-white underline">
          Cerrar sesion
        </button>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Mi panel</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {!editando ? (
          <div className="flex gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0"></div>

            <div>
              <h3 className="text-2xl font-bold">{experto.nombre}</h3>
              <p>Categoria: {experto.categoria}</p>
              <p>
                Ubicaciones: {experto.ubicaciones && experto.ubicaciones.map(u => u.nombre).join(', ')}
              </p>
              <p>Plan: {experto.plan}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={iniciarEdicion}
                  className="px-4 py-2 bg-[#2C3E50] text-white rounded"
                >
                  Editar perfil
                </button>
                <button className="px-4 py-2 bg-[#2C3E50] text-white rounded">
                  Cambiar foto
                </button>
                <button
                  onClick={handleEliminar}
                  className="px-4 py-2 bg-[#E74C3C] text-white rounded"
                >
                  Eliminar perfil
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGuardar} className="flex flex-col gap-4 max-w-lg">
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
              <label className="block mb-1">Anos de experiencia</label>
              <input
                type="number"
                name="anosExperiencia"
                value={formData.anosExperiencia}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-6 py-3 bg-gray-300 rounded font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default PanelExperto