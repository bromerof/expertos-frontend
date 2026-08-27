import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../config'
import Header from './Header'
import Insignias from './Insignias'

function PanelExperto() {
  const navigate = useNavigate()
  const [experto, setExperto] = useState(null)
  const [error, setError] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    whatsapp: '',
    anosExperiencia: '',
    atiendePresencial: true,
    atiendeVirtual: false
  })
  const [ubicaciones, setUbicaciones] = useState([{ departamentoId: '', municipioId: '' }])
  const [departamentos, setDepartamentos] = useState([])
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({})

  const [categorias, setCategorias] = useState([])
  const [profesionesPorCategoria, setProfesionesPorCategoria] = useState({})
  const [categoriaId, setCategoriaId] = useState('')
  const [profesionId, setProfesionId] = useState('')

  const [numeroBusqueda, setNumeroBusqueda] = useState('')
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const [misCalificaciones, setMisCalificaciones] = useState(null)

  const expertoId = localStorage.getItem('expertoId')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!expertoId || !token) {
      navigate('/login')
      return
    }
    cargarExperto()
    fetch(API_URL + '/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error al cargar departamentos:', err))

    fetch(API_URL + '/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Error al cargar categorias:', err))
  }, [expertoId, token, navigate])

  const cargarExperto = () => {
    setErrorCarga('')

    fetch(API_URL + '/api/expertos/' + expertoId, {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al cargar el perfil')
        }
        return data
      })
      .then(data => {
        setExperto(data)
        setFormData({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          whatsapp: data.whatsapp || '',
          anosExperiencia: data.anosExperiencia || '',
          atiendePresencial: data.atiendePresencial ?? true,
          atiendeVirtual: data.atiendeVirtual ?? false
        })
      })
      .catch(err => {
        setErrorCarga(err.message)
      })

    fetch(API_URL + '/api/calificaciones/' + expertoId, {
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setMisCalificaciones(data))
      .catch(err => console.error('Error al cargar las calificaciones:', err))
  }

  const cargarMunicipios = (departamentoId) => {
    if (municipiosPorDepartamento[departamentoId]) {
      return
    }
    fetch(API_URL + '/api/municipios?departamento=' + departamentoId)
      .then(res => res.json())
      .then(data => {
        setMunicipiosPorDepartamento((prev) => ({ ...prev, [departamentoId]: data }))
      })
      .catch(err => console.error('Error al cargar municipios:', err))
  }

  const cargarProfesiones = (categoriaId) => {
    if (profesionesPorCategoria[categoriaId]) {
      return
    }
    fetch(API_URL + '/api/profesiones?categoria=' + categoriaId)
      .then(res => res.json())
      .then(data => {
        setProfesionesPorCategoria((prev) => ({ ...prev, [categoriaId]: data }))
      })
      .catch(err => console.error('Error al cargar profesiones:', err))
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

    // Precargamos la categoria y profesion actuales del experto
    if (experto.profesion && experto.profesion.categoria) {
      const categoriaActualId = experto.profesion.categoria._id
      setCategoriaId(categoriaActualId)
      setProfesionId(experto.profesion._id)
      cargarProfesiones(categoriaActualId)
    } else {
      setCategoriaId('')
      setProfesionId('')
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

  const handleCategoriaChange = (nuevaCategoriaId) => {
    setCategoriaId(nuevaCategoriaId)
    setProfesionId('')
    if (nuevaCategoriaId) {
      cargarProfesiones(nuevaCategoriaId)
    }
  }

  const handleProfesionChange = (nuevaProfesionId) => {
    setProfesionId(nuevaProfesionId)
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    setError('')

    if (experto.rol !== 'cliente' && !profesionId) {
      setError('Debes seleccionar una categoria y una profesion')
      return
    }

    const idsMunicipios = ubicaciones
      .map(u => u.municipioId)
      .filter(id => id !== '')

    if (idsMunicipios.length === 0) {
      setError('Debes seleccionar al menos una ubicacion')
      return
    }

    const datosCompletos = { ...formData, ubicaciones: idsMunicipios }
    if (profesionId) {
      datosCompletos.profesion = profesionId
    }

    fetch(API_URL + '/api/expertos/' + expertoId, {
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

  const handleBuscarReputacion = () => {
    setErrorBusqueda('')
    setResultadoBusqueda(null)

    if (!numeroBusqueda.trim()) {
      setErrorBusqueda('Escribe un numero de WhatsApp para buscar')
      return
    }

    fetch(API_URL + '/api/calificaciones/buscar/' + numeroBusqueda.trim(), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al buscar la reputacion')
        }
        return data
      })
      .then((data) => {
        setResultadoBusqueda(data)
      })
      .catch((err) => {
        setErrorBusqueda(err.message)
      })
  }

  const handleEliminar = () => {
    const confirmar = window.confirm('Estas seguro de que quieres eliminar tu perfil? Esta accion no se puede deshacer.')
    if (!confirmar) return

    fetch(API_URL + '/api/expertos/' + expertoId, {
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
        localStorage.removeItem('rol')
        alert('Perfil eliminado correctamente')
        navigate('/')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

    const handleSubirFotoPerfil = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    const datosFormulario = new FormData()
    datosFormulario.append('foto', archivo)
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(archivo.type)) {
      setError('Solo se permiten archivos JPG o PNG')
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB')
      return
    }
    fetch(API_URL + '/api/expertos/' + expertoId + '/foto', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: datosFormulario
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir la foto')
        }
        return data
      })
      .then(() => {
        cargarExperto()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

    const handleSubirFotoDocumentoFrente = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(archivo.type)) {
      setError('Solo se permiten archivos JPG o PNG')
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB')
      return
    }

    const datosFormulario = new FormData()
    datosFormulario.append('fotoDocumentoFrente', archivo)

    fetch(API_URL + '/api/expertos/' + expertoId + '/foto-documento-frente', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: datosFormulario
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir la foto')
        }
        return data
      })
      .then(() => {
        cargarExperto()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleSubirFotoDocumentoReverso = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(archivo.type)) {
      setError('Solo se permiten archivos JPG o PNG')
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB')
      return
    }

    const datosFormulario = new FormData()
    datosFormulario.append('fotoDocumentoReverso', archivo)

    fetch(API_URL + '/api/expertos/' + expertoId + '/foto-documento-reverso', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: datosFormulario
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al subir la foto')
        }
        return data
      })
      .then(() => {
        cargarExperto()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  if (errorCarga) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <p className="bg-red-100 text-red-700 p-3 rounded max-w-lg">{errorCarga}</p>
        </div>
      </div>
    )
  }

  if (!experto) {
    return <p className="p-6">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Mi panel</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 max-w-lg">{error}</p>
        )}

        {!editando ? (
          <div className="flex gap-6">
                       <div className="flex flex-col items-center gap-2">
              {experto.foto ? (
                <img src={experto.foto} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-xs text-center p-2">
                  Sin foto de perfil
                </div>
              )}
              <label className="text-sm text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]">
                {experto.foto ? 'Cambiar foto' : 'Subir foto de perfil'}
                <input type="file" accept="image/*" onChange={handleSubirFotoPerfil} className="hidden" />
              </label>
            </div>
                      
              <div>
              <h3 className="text-2xl font-bold">{experto.nombre}</h3>
              <p className="text-sm text-gray-500">
                Miembro desde: {new Date(experto.fechaCreacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {misCalificaciones && misCalificaciones.total > 0 && (
                <div className="mb-2">
                  <p>
                    <span className="text-yellow-500">
                      {'★'.repeat(Math.round(misCalificaciones.promedio))}
                      {'☆'.repeat(5 - Math.round(misCalificaciones.promedio))}
                    </span>
                    {' '}{misCalificaciones.promedio}/5 ({misCalificaciones.total} calificacion{misCalificaciones.total !== 1 ? 'es' : ''})
                  </p>
                  <Insignias promedio={misCalificaciones.promedio} total={misCalificaciones.total} />
                </div>
              )}

              {experto.rol !== 'cliente' && (
                <>
                  <p>Categoria: {experto.profesion && experto.profesion.categoria && experto.profesion.categoria.nombre}</p>
                  <p>Profesion: {experto.profesion && experto.profesion.nombre}</p>
                </>
              )}
              <p>
                Ubicaciones: {experto.ubicaciones && experto.ubicaciones.map(u => u.nombre).join(', ')}
              </p>
              {experto.rol !== 'cliente' && (
                <p>Plan: {experto.plan}</p>
              )}

                             {experto.rol !== 'cliente' && (
                <div className="mt-3">
                  <p className="font-bold text-sm">Documento de identidad:</p>
                  <p className="text-xs text-gray-500 mb-1">Formatos permitidos: JPG, PNG. Tamano maximo: 5MB</p>

                  <div className="mb-2">
                    {experto.fotoDocumentoFrente ? (
                      <p className="text-green-700 text-sm">Frente: subido correctamente</p>
                    ) : (
                      <p className="text-red-600 text-sm">Falta subir el frente del documento</p>
                    )}
                    <label className="text-sm text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]">
                      {experto.fotoDocumentoFrente ? 'Cambiar foto del frente' : 'Subir foto del frente'}
                      <input type="file" accept="image/png, image/jpeg" onChange={handleSubirFotoDocumentoFrente} className="hidden" />
                    </label>
                  </div>

                  <div>
                    {experto.fotoDocumentoReverso ? (
                      <p className="text-green-700 text-sm">Reverso: subido correctamente</p>
                    ) : (
                      <p className="text-red-600 text-sm">Falta subir el reverso del documento</p>
                    )}
                    <label className="text-sm text-[#2C3E50] underline cursor-pointer hover:text-[#1a252f]">
                      {experto.fotoDocumentoReverso ? 'Cambiar foto del reverso' : 'Subir foto del reverso'}
                      <input type="file" accept="image/png, image/jpeg" onChange={handleSubirFotoDocumentoReverso} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={iniciarEdicion}
                  className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
                >
                  Editar perfil
                </button>
                <button
                  onClick={handleEliminar}
                  className="px-4 py-2 bg-[#E74C3C] text-white rounded cursor-pointer hover:bg-[#c0392b]"
                >
                  Eliminar perfil
                </button>
              </div>

              {experto.rol === 'experto' && (
                <div className="mt-6 pt-6 border-t border-gray-200 max-w-md">
                  <h3 className="font-bold mb-2">Verificar reputacion de un cliente</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Antes de aceptar un servicio, puedes revisar la reputacion de un cliente buscando su numero de WhatsApp.
                  </p>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={numeroBusqueda}
                      onChange={(e) => setNumeroBusqueda(e.target.value)}
                      placeholder="Numero de WhatsApp"
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={handleBuscarReputacion}
                      className="px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f] whitespace-nowrap"
                    >
                      Buscar
                    </button>
                  </div>

                  {errorBusqueda && (
                    <p className="bg-red-100 text-red-700 p-3 rounded">{errorBusqueda}</p>
                  )}

                  {resultadoBusqueda && (
                    <div className="bg-white border border-gray-300 rounded p-3">
                      <p className="font-bold">{resultadoBusqueda.nombre}</p>
                      <p className="text-sm text-gray-600 capitalize">Rol: {resultadoBusqueda.rol}</p>
                      <p className="mt-1">
                        {resultadoBusqueda.total > 0
                          ? `${'★'.repeat(Math.round(resultadoBusqueda.promedio))}${'☆'.repeat(5 - Math.round(resultadoBusqueda.promedio))} (${resultadoBusqueda.promedio}/5, ${resultadoBusqueda.total} calificacion${resultadoBusqueda.total !== 1 ? 'es' : ''})`
                          : 'Todavia no tiene calificaciones'}
                      </p>
                      {resultadoBusqueda.comentarios.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                          {resultadoBusqueda.comentarios.map((comentario, index) => (
                            <li key={index}>{comentario}</li>
                          ))}
                        </ul>
                      )}
                      <Link
                        to={`/calificar/${resultadoBusqueda.id}`}
                        className="inline-block mt-3 px-4 py-2 bg-[#2C3E50] text-white rounded cursor-pointer hover:bg-[#1a252f]"
                      >
                        Calificar a este cliente
                      </Link>
                    </div>
                  )}
                </div>
              )}
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

            {experto.rol !== 'cliente' && (
              <>
                <div>
                  <label className="block mb-1">Categoria</label>
                  <select
                    value={categoriaId}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Selecciona una categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Profesion especifica</label>
                  <select
                    value={profesionId}
                    onChange={(e) => handleProfesionChange(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={!categoriaId}
                  >
                    <option value="">Selecciona una profesion</option>
                    {(profesionesPorCategoria[categoriaId] || []).map((prof) => (
                      <option key={prof._id} value={prof._id}>{prof.nombre}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {experto.rol !== 'cliente' && (
              <div>
                <label className="block mb-1">Descripcion</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

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
                      className="px-3 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={agregarUbicacion}
                className="text-[#2C3E50] underline text-sm cursor-pointer hover:text-[#1a252f]"
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

            {experto.rol !== 'cliente' && (
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
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-[#2C3E50] text-white rounded font-bold cursor-pointer hover:bg-[#1a252f]"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-6 py-3 bg-gray-300 rounded font-bold cursor-pointer hover:bg-gray-400"
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