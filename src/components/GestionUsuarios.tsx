import { useCallback, useState } from 'react'
import type { Usuario } from '../types/usuario'
import { eliminarUsuario, getUsuarios } from '../services/usuario.service'
import { mensajeDeError } from '../services/api'
import { useCarga } from '../hooks/useCarga'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Carga from './ui/Carga'
import EncabezadoSeccion from './ui/EncabezadoSeccion'
import FormularioUsuario from './FormularioUsuario'
import ListaUsuarios from './ListaUsuarios'

function GestionUsuarios() {
  const obtener = useCallback(() => getUsuarios(), [])
  const {
    datos: usuarios,
    estado,
    error,
    recargar,
  } = useCarga<Usuario[]>(obtener, [])

  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [enEdicion, setEnEdicion] = useState<Usuario | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState('')
  const [eliminando, setEliminando] = useState(false)

  function abrirFormulario(usuario: Usuario | null) {
    setEnEdicion(usuario)
    setFormularioAbierto(true)
    setMensaje('')
    setErrorAccion('')
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setEnEdicion(null)
  }

  function alGuardar(texto: string) {
    cerrarFormulario()
    setMensaje(texto)
    recargar()
  }

  async function eliminar(usuario: Usuario) {
    if (eliminando) {
      return
    }

    const confirmado = window.confirm(
      `¿Querés eliminar a ${usuario.nombre} ${usuario.apellido}?`
    )

    if (!confirmado) {
      return
    }

    setEliminando(true)
    setMensaje('')
    setErrorAccion('')

    try {
      await eliminarUsuario(usuario.id)
      setMensaje('Usuario eliminado correctamente.')
      recargar()
    } catch (fallo) {
      setErrorAccion(
        mensajeDeError(fallo, 'No pudimos eliminar el usuario. Intentá nuevamente.')
      )
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-usuarios" className="flex flex-col gap-4">
      <EncabezadoSeccion
        id="titulo-usuarios"
        titulo="Usuarios"
        descripcion="Personas que pueden reservar espacios."
      >
        {!formularioAbierto && (
          <Boton onClick={() => abrirFormulario(null)}>Nuevo usuario</Boton>
        )}
      </EncabezadoSeccion>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}
      {errorAccion && <Alerta tipo="error">{errorAccion}</Alerta>}

      {formularioAbierto && (
        <FormularioUsuario
          key={enEdicion?.id ?? 'nuevo'}
          usuario={enEdicion}
          onGuardado={alGuardar}
          onCancelar={cerrarFormulario}
        />
      )}

      <Carga estado={estado} error={error} onReintentar={recargar}>
        {usuarios.length === 0 ? (
          <p className="text-sm text-slate-600">
            Todavía no hay usuarios registrados.
          </p>
        ) : (
          <ListaUsuarios
            usuarios={usuarios}
            deshabilitado={eliminando}
            onEditar={abrirFormulario}
            onEliminar={eliminar}
          />
        )}
      </Carga>
    </section>
  )
}

export default GestionUsuarios
