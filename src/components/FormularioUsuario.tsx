import { useState } from 'react'
import type {Usuario, NuevoUsuario } from '../types/usuario.ts'
import { crearUsuario, actualizarUsuario } from '../services/usuario.service.ts'

interface FormularioUsuarioProps {
  usuario: Usuario | null
  onGuardado: () => void
  onCancelar: () => void
}

function FormularioUsuario({usuario, onGuardado, onCancelar}: FormularioUsuarioProps){
  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '')
  const [apellido, setApellido] = useState(usuario ? usuario.apellido : '')
  const [email, setEmail] = useState(usuario ? usuario.email : '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function guardarUsuario(){
    if(guardando) {
      return 
    }

    setError('')
    setMensaje('')

    const datos: NuevoUsuario = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
    }

    if ( !datos.nombre || !datos.apellido || !datos.email ){
      setError('Complete todos los campos.')
      return
    }

    setGuardando(true)

    try {
      if (usuario) {
        await actualizarUsuario(usuario.id, datos)
        setMensaje('Usuario actualizado correctamente.')
      } else {
        await crearUsuario(datos)
        setMensaje('Usuario creado correctamente.')
      }

      setNombre('')
      setApellido('')
      setEmail('')

      onGuardado()
    } catch {
      setError('No pudimos guardar el usuario. Intentá nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby='titulo-formulario-usuario'>
      <h2 id="titulo-formulario-usuario">
        {usuario ? 'Editar usuario' : 'Crear usuario'}
      </h2>

      <form 
        onSubmit={(evento) =>{
          evento.preventDefault()
          guardarUsuario()
        }}
      >
      
        <fieldset disabled ={guardando}> 
          <legend>Datos del usuario</legend>

          <div>
            <label htmlFor='nombre'>Nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              autoComplete = "given-name"
              required
              />
          </div>

          <div>
            <label htmlFor='apellido'>Apellido</label>
            <input 
              id = "apellido"
              type = "text"
              value = {apellido}
              onChange={(evento) => setApellido(evento.target.value)}
              autoComplete='family-name'
              required
            />
          </div>

          <div>
            <label htmlFor='email'>Email</label>
            <input 
              id = "email"
              type = "email"
              value = {email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit">
            {guardando
              ? 'Guardando…'
              : usuario
                ? 'Guardar cambios'
                : 'Crear usuario'}
          </button>

          {usuario !== null && (
            <button type="button" onClick={onCancelar}>
              Cancelar edición
            </button>
          )}
        </fieldset>
      </form>
      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

    </section>
  )
}

export default FormularioUsuario