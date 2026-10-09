import { useState } from 'react'
import type { Usuario } from './types/usuario'
import { getUsuario } from './services/usuario.service'
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
    setUsuarioSeleccionado(usuario)
  }

  function finalizarGuardado() {
    setUsuarioEnEdicion(null)
    cargarUsuarios()
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
          disabled={estado === 'cargando'}
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
            >
              Editar usuario
            </button>

            <button
              type="button"
              onClick={() => setUsuarioSeleccionado(null)}
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