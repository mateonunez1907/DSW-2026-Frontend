import { useState } from 'react'
import type { NuevoUsuario } from '../types/usuario.ts'
import { crearUsuario } from '../services/usuario.service.ts'

interface FormularioUsuarioProps {
  onCreado: () => void
}

function FormularioUsuario({onCreado}: FormularioUsuarioProps){
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
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
      await crearUsuario(datos)

      setNombre('')
      setApellido('')
      setEmail('')
      setMensaje('Usuario creado correctamente.')

      onCreado()
    } catch {
      setError('No pudimos crear el usuario. Intentá nuevamente.')
    }finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby='titulo-crear-usuario'>
      <h2 id="titulo-crear-usuario">Crear usuario</h2>

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

          <button type= "submit">
            {guardando ? 'Guardando...' : 'Crear usuario'} 
          </button>
        </fieldset>
      </form>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

    </section>
  )
}

export default FormularioUsuario