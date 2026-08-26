cat > /home/claude/Home.jsx << 'ENDOFFILE'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { Link } from 'react-router-dom'
import Header from './Header'

function Home() {
  const [expertos, setExpertos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [departamentoId, setDepartamentoId] = useState('')
  const [municipioNombre, setMunicipioNombre] = useState('')

  useEffect(() => {
    cargarExpertos()
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))
  }, [])

  const cargarExpertos = (params = {}) => {
    const query = new URLSearchParams(params).toString()
    fetch(API_URL + '/api/expertos' + (query ? '?' + query : ''), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setExpertos(data))
      .catch(err => console.error('Error al cargar expertos:', err))
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
    if (municipioNombre) params.ubicacion = municipioNombre
    cargarExpertos(params)
  }

  const handleLimpiar = () => {
    setBusqueda('')
    setDepartamentoId('')
    setMunicipioNombre('')
    setMunicipios([])
    cargarExpertos()
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
            placeholder="Buscar por nombre o categoria..."
            className="w-full p-3 rounded border border-gray-300"
          />
          <button
            onClick={handleBuscar}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
          >
            Buscar
          </button>
        </div>

        <div className="flex gap-3 mt-4 items-center">
          <select
            value={departamentoId}
            onChange={(e) => handleDepartamentoChange(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Departamento</option>
            {departamentos.map((depto) => (
              <option key={depto._id} value={depto._id}>{depto.nombre}</option>
            ))}
          </select>

          <select
            value={municipioNombre}
            onChange={(e) => setMunicipioNombre(e.target.value)}
            className="px-3 py-2 border rounded"
            disabled={!departamentoId}
          >
            <option value="">Ciudad</option>
            {municipios.map((muni) => (
              <option key={muni._id} value={muni.nombre}>{muni.nombre}</option>
            ))}
          </select>

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

        <div className="flex flex-wrap gap-4 mt-6">
          {expertos.length === 0 ? (
            <p>No se encontraron expertos con esos criterios.</p>
          ) : (
            expertos.map((experto) => (
              <Link
                key={experto._id}
                to={'/experto/' + experto._id}
                className="bg-white p-4 rounded shadow w-64 block hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
                <p className="font-bold">{experto.nombre}</p>
                <p className="text-gray-500">{experto.profesion && experto.profesion.nombre}</p>
                <button className="mt-2 px-3 py-1 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]">
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

export default Home
ENDOFFILE
cd /home/claude && node -e "
const babel = require('@babel/core');
const fs = require('fs');
const code = fs.readFileSync('Home.jsx', 'utf8');
try {
  babel.transformSync(code, { presets: ['@babel/preset-react'], filename: 'Home.jsx' });
  console.log('✅ Home.jsx: sintaxis válida');
} catch (e) {
  console.log('❌ Home.jsx: ERROR -', e.message);
}
"