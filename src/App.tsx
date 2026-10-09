import { useState } from 'react'
import type { Usuario } from './types/usuario'
import { getUsuario, eliminarUsuario } from './services/usuario.service'
import ListaUsuarios from './components/ListaUsuarios'
import FormularioUsuario from './components/FormularioUsuario'
import './App.css'

type EstadoCarga = 'inicial' | 'cargando' | 'error' | 'exito'

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [estado, setEstado] = useState<EstadoCarga>('inicial')

  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null)

  const [usuarioEnEdicion, setUsuarioEnEdicion] =
    useState<Usuario | null>(null)

  const [eliminando, setEliminando] = useState(false)
  const [errorEliminacion, setErrorEliminacion] = useState('')
  const [mensajeEliminacion, setMensajeEliminacion] = useState('')
  
  async function cargarUsuarios() {
    setEstado('cargando')
    setUsuarioSeleccionado(null)

    try {
      const datos = await getUsuario()
      setUsuarios(datos)
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  function seleccionarUsuario(usuario: Usuario) {
    if(eliminando){
      return
    }
    
    setUsuarioSeleccionado(usuario)
    setErrorEliminacion('')
    setMensajeEliminacion('')
  }

  function finalizarGuardado() {
    setUsuarioEnEdicion(null)
    setErrorEliminacion('')
    setMensajeEliminacion('')
    cargarUsuarios()
  }

  async function eliminarSeleccionado(){
    if(usuarioSeleccionado === null || eliminando){
      return
    }

    const usuario = usuarioSeleccionado

    const confirmado = window.confirm(
      `Querés eliminar ${usuario.nombre} ${usuario.apellido}?`
    )

    if (!confirmado){
      return
    }

    setEliminando(true)
    setErrorEliminacion('')
    setMensajeEliminacion('')

    try{
      await eliminarUsuario(usuario.id)

      setUsuarioEnEdicion(null)
      setErrorEliminacion('Usuario eliminado correctamente.')

      await cargarUsuarios()
    } catch {
      setErrorEliminacion(
        'No pudimos eliminar el usuario, intente nuevamente'
      )
    } finally{
      setEliminando(false)
    }
  }

  return (
    <main className="app">
      <h1>Sistema de reservas de espacios</h1>

      <FormularioUsuario
        key={usuarioEnEdicion ? usuarioEnEdicion.id : 'nuevo'}
        usuario={usuarioEnEdicion}
        onGuardado={finalizarGuardado}
        onCancelar={() => setUsuarioEnEdicion(null)}
      />

      <section aria-labelledby="titulo-usuarios">
        <h2 id="titulo-usuarios">Usuarios</h2>
        <p>Consultá los usuarios registrados en el sistema.</p>

        <button
          type="button"
          onClick={cargarUsuarios}
          disabled={estado === 'cargando' || eliminando}
        >
          {estado === 'inicial' && 'Cargar usuarios'}
          {estado === 'cargando' && 'Cargando…'}
          {estado === 'exito' && 'Actualizar listado'}
          {estado === 'error' && 'Reintentar'}
        </button>

        {estado === 'cargando' && (
          <p role="status">Cargando usuarios…</p>
        )}

        {estado === 'error' && (
          <p role="alert">
            No pudimos cargar los usuarios. Intentá nuevamente.
          </p>
        )}

        {errorEliminacion && (
          <p role="alert">{errorEliminacion}</p>
        )}

        {mensajeEliminacion && (
          <p role="status">{mensajeEliminacion}</p>
        )}

        {estado === 'exito' && usuarios.length === 0 && (
          <p>No hay usuarios registrados.</p>
        )}

        {estado === 'exito' && usuarios.length > 0 && (
          <ListaUsuarios
            usuarios={usuarios}
            onSeleccionar={seleccionarUsuario}
          />
        )}

        {usuarioSeleccionado !== null && (
          <section aria-labelledby="titulo-detalle">
            <h3 id="titulo-detalle">Detalle del usuario</h3>

            <p>
              <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
            </p>

            <p>
              <strong>Apellido:</strong> {usuarioSeleccionado.apellido}
            </p>

            <p>
              <strong>Email:</strong> {usuarioSeleccionado.email}
            </p>

            <button
              type="button"
              onClick={() => setUsuarioEnEdicion(usuarioSeleccionado)}
              disabled = {eliminando}
            >
              Editar usuario
            </button>

            <button
              type="button"
              onClick = {eliminarSeleccionado}
              disabled = {eliminando || usuarioEnEdicion !== null}
            >
              {eliminando ? 'Eliminando' : 'Eliminar usuario'}
            </button>

            {usuarioEnEdicion !== null &&(
              <p>
                Guardá o cancelá la edición antes de eliminar.
              </p>
            )}

            <button
              type="button"
              onClick={() => setUsuarioSeleccionado(null)}
              disabled={eliminando}
            >
              Cerrar detalle
            </button>
          </section>
        )}
      </section>
    </main>
  )
}

export default App