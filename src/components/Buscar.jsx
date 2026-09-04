import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from './Header'

function Buscar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [expertos, setExpertos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [departamentoId, setDepartamentoId] = useState('')
  const [municipioNombre, setMunicipioNombre] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Si no hay sesion iniciada, no tiene sentido intentar cargar el listado:
    // mandamos directo a login en vez de mostrar el error del backend.
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Si vinimos desde el buscador de la landing, precargamos lo que la
    // persona ya escribio/eligio ahi, para no hacerla buscar dos veces
    const busquedaInicial = searchParams.get('busqueda') || ''
    const departamentoInicial = searchParams.get('departamento') || ''
    setBusqueda(busquedaInicial)
    setDepartamentoId(departamentoInicial)

    const paramsIniciales = {}
    if (busquedaInicial) paramsIniciales.busqueda = busquedaInicial
    if (departamentoInicial) paramsIniciales.departamento = departamentoInicial

    cargarExpertos(paramsIniciales)
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [navigate])

  const cargarExpertos = (params = {}) => {
    setError('')
    const token = localStorage.getItem('token')
    const query = new URLSearchParams(params).toString()

    fetch(API_URL + '/api/expertos' + (query ? '?' + query : ''), {
      cache: 'no-store',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar expertos')
        }
        return data
      })
      .then((data) => setExpertos(data))
      .catch((err) => {
        setExpertos([])
        setError(err.message)
      })
  }

  const handleDepartamentoChange = (id) => {
    setDepartamentoId(id)
    setMunicipioNombre('')
    setMunicipios([])
    if (id) {
      fetch(API_URL + '/api/municipios?departamento=' + id)
        .then(res => res.json())
        .then(data => setMunicipios(data))
        .catch(err => console.error('Error al cargar municipios:', err))
    }
  }

  const handleBuscar = () => {
    const params = {}
    if (busqueda.trim()) params.busqueda = busqueda.trim()
    if (municipioNombre) {
      params.ubicacion = municipioNombre
    } else if (departamentoId) {
      params.departamento = departamentoId
    }
    cargarExpertos(params)
  }

  const handleLimpiar = () => {
    setBusqueda('')
    setDepartamentoId('')
    setMunicipioNombre('')
    setMunicipios([])
    cargarExpertos()
  }

  const handleContactar = (e, expertoId) => {
    e.preventDefault()
    e.stopPropagation()

    const token = localStorage.getItem('token')
    fetch(API_URL + '/api/expertos/' + expertoId + '/contacto', {
      cache: 'no-store',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al generar el enlace de contacto')
        }
        return data
      })
      .then(data => {
        window.open(data.enlaceWhatsApp, '_blank')
      })
      .catch(err => setError(err.message))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <div className="flex gap-2 max-w-2xl">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            placeholder="Buscar por nombre o categoría..."
            className="w-full p-3 rounded border border-gray-300"
          />
          <button
            onClick={handleBuscar}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-4 sm:items-center">
          <select
            value={departamentoId}
            onChange={(e) => handleDepartamentoChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border rounded"
          >
            <option value="">Departamento</option>
            {departamentos.map((depto) => (
              <option key={depto._id} value={depto._id}>{depto.nombre}</option>
            ))}
          </select>

          <select
            value={municipioNombre}
            onChange={(e) => setMunicipioNombre(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border rounded"
            disabled={!departamentoId}
          >
            <option value="">Ciudad</option>
            {municipios.map((muni) => (
              <option key={muni._id} value={muni.nombre}>{muni.nombre}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleBuscar}
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
            >
              Filtrar
            </button>
            <button
              onClick={handleLimpiar}
              className="px-4 py-2 text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mt-4 max-w-lg">{error}</p>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          {!error && expertos.length === 0 ? (
            <p>No se encontraron expertos con esos criterios.</p>
          ) : (
            expertos.map((experto) => (
              <Link
                key={experto._id}
                to={'/experto/' + experto._id}
                className="bg-white p-4 rounded shadow w-64 block hover:shadow-lg transition cursor-pointer relative"
              >
                {experto.plan === 'pro' && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-[#2C3E50] text-xs font-bold rounded-full">
                    ⭐ Pro
                  </span>
                )}
                <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
                <p className="font-bold">{experto.nombre}</p>
                <p className="text-gray-500">
                  {experto.profesion && experto.profesion.nombre.trim().toLowerCase() === 'otra' && experto.otraProfesionTexto
                    ? experto.otraProfesionTexto
                    : experto.profesion && experto.profesion.nombre}
                  {experto.profesionesAdicionales && experto.profesionesAdicionales.length > 0 && (
                    <span className="text-xs text-gray-400"> +{experto.profesionesAdicionales.length} más</span>
                  )}
                </p>
                <button
                  onClick={(e) => handleContactar(e, experto._id)}
                  className="mt-2 px-3 py-1 bg-[#25D366] text-white rounded cursor-pointer hover:bg-[#1ebe57]"
                >
                  Contactar
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Buscar