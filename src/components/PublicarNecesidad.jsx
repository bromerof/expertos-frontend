import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import SelectorProfesion from './SelectorProfesion'

function PublicarNecesidad() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [modalidad, setModalidad] = useState('cualquiera')
  const [profesionId, setProfesionId] = useState('')
  const [todasLasProfesiones, setTodasLasProfesiones] = useState([])

  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [departamentoId, setDepartamentoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')

  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [misNecesidades, setMisNecesidades] = useState([])
  const [errorLista, setErrorLista] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetch(API_URL + '/api/profesiones')
      .then(res => res.json())
      .then(data => setTodasLasProfesiones(data))
      .catch(err => console.error('Error al cargar profesiones:', err))

    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))

    cargarMisNecesidades()
  }, [token, navigate])

  const cargarMisNecesidades = () => {
    fetch(API_URL + '/api/necesidades/mias', {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar tus necesidades')
        }
        return data
      })
      .then((data) => setMisNecesidades(data))
      .catch((err) => setErrorLista(err.message))
  }

  const handleDepartamentoChange = (id) => {
    setDepartamentoId(id)
    setMunicipioId('')
    setMunicipios([])
    if (id) {
      fetch(API_URL + '/api/municipios?departamento=' + id)
        .then(res => res.json())
        .then(data => setMunicipios(data))
        .catch(err => console.error('Error al cargar municipios:', err))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!titulo.trim() || !descripcion.trim()) {
      setError('El titulo y la descripcion son obligatorios')
      return
    }

    setEnviando(true)

    fetch(API_URL + '/api/necesidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        profesion: profesionId || undefined,
        municipio: municipioId || undefined,
        modalidad
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al publicar la necesidad')
        }
        return data
      })
      .then(() => {
        setTitulo('')
        setDescripcion('')
        setProfesionId('')
        setDepartamentoId('')
        setMunicipioId('')
        setModalidad('cualquiera')
        setEnviando(false)
        cargarMisNecesidades()
      })
      .catch((err) => {
        setError(err.message)
        setEnviando(false)
      })
  }

  const handleCerrar = (id) => {
    fetch(API_URL + '/api/necesidades/' + id + '/cerrar', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cerrar la necesidad')
        }
        return data
      })
      .then(() => cargarMisNecesidades())
      .catch((err) => setErrorLista(err.message))
  }

  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Eliminar esta necesidad? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch(API_URL + '/api/necesidades/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al eliminar la necesidad')
        }
        return data
      })
      .then(() => cargarMisNecesidades())
      .catch((err) => setErrorLista(err.message))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-lg">
        <h2 className="text-xl font-bold mb-1">Publicar una necesidad</h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe lo que necesitas y los expertos con plan Pro podran contactarte directamente.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <div>
            <label className="block mb-1">Titulo</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Necesito arreglar una fuga de agua"
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Descripcion</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuenta con mas detalle que necesitas..."
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Profesion relacionada (opcional)</label>
            <SelectorProfesion
              todasLasProfesiones={todasLasProfesiones}
              valorProfesionId={profesionId}
              onSeleccionar={(p) => setProfesionId(p ? p._id : '')}
              placeholder="Ej. Plomero, Contador..."
            />
          </div>

          <div>
            <label className="block mb-1">Modalidad</label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cualquiera">Cualquiera</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Ciudad (opcional)</label>
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
                {municipios.map((muni) => (
                  <option key={muni._id} value={muni._id}>{muni.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f] disabled:opacity-60"
          >
            {enviando ? 'Publicando...' : 'Publica tu necesidad'}
          </button>
        </form>

        <div className="mt-10">
          <h3 className="font-bold mb-3">Mis necesidades publicadas</h3>

          {errorLista && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorLista}</p>
          )}

          {misNecesidades.length === 0 ? (
            <p className="text-gray-500 text-sm">Aun no has publicado ninguna necesidad.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {misNecesidades.map((n) => (
                <div key={n._id} className="bg-white border border-gray-300 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{n.titulo}</p>
                      <p className="text-sm text-gray-600">{n.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.estado === 'abierta' ? 'Abierta' : 'Cerrada'} · {new Date(n.fechaCreacion).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    {n.estado === 'abierta' && (
                      <button
                        onClick={() => handleCerrar(n._id)}
                        className="text-xs px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 whitespace-nowrap"
                      >
                        Cerrar
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleEliminar(n._id)}
                    className="text-xs text-[#E74C3C] underline mt-2 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicarNecesidad