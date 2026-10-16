import { useState, type FormEvent } from 'react'
import type { NuevoUsuario, Usuario } from '../types/usuario'
import { actualizarUsuario, crearUsuario } from '../services/usuario.service'
import { mensajeDeError } from '../services/api'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Tarjeta from './ui/Tarjeta'

interface FormularioUsuarioProps {
  usuario: Usuario | null
  onGuardado: (mensaje: string) => void
  onCancelar: () => void
}

function FormularioUsuario({
  usuario,
  onGuardado,
  onCancelar,
}: FormularioUsuarioProps) {
  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [apellido, setApellido] = useState(usuario?.apellido ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    const datos: NuevoUsuario = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
    }

    setError('')
    setGuardando(true)

    try {
      if (usuario) {
        await actualizarUsuario(usuario.id, datos)
        onGuardado('Usuario actualizado correctamente.')
      } else {
        await crearUsuario(datos)
        onGuardado('Usuario creado correctamente.')
      }
    } catch (fallo) {
      setError(
        mensajeDeError(fallo, 'No pudimos guardar el usuario. Intentá nuevamente.')
      )
      setGuardando(false)
    }
  }

  return (
    <Tarjeta>
      <h3 className="mb-4 text-lg font-semibold">
        {usuario ? 'Editar usuario' : 'Nuevo usuario'}
      </h3>

      <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
        <Campo
          id="usuario-nombre"
          etiqueta="Nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          autoComplete="given-name"
          required
          disabled={guardando}
        />

        <Campo
          id="usuario-apellido"
          etiqueta="Apellido"
          value={apellido}
          onChange={(evento) => setApellido(evento.target.value)}
          autoComplete="family-name"
          required
          disabled={guardando}
        />

        <div className="sm:col-span-2">
          <Campo
            id="usuario-email"
            etiqueta="Email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            autoComplete="email"
            required
            disabled={guardando}
          />
        </div>

        {error && (
          <div className="sm:col-span-2">
            <Alerta tipo="error">{error}</Alerta>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : usuario ? 'Guardar cambios' : 'Crear usuario'}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  )
}

export default FormularioUsuario
