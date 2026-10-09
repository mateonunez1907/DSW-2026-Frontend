import type { Usuario, NuevoUsuario} from '../types/usuario';

// Todos los users

export async function getUsuario(): Promise<Usuario[]> {
  const respuesta = await fetch('/api/usuarios');

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los usuarios');
  }

  const contenido : { data: Usuario[] } = await respuesta.json();

  return contenido.data 
}

export async function crearUsuario(  datos: NuevoUsuario): Promise<Usuario>{
  const respuesta = await fetch ('/api/usuarios',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok){
    throw new Error('No se pudo crear el usuario :(')
  }

  const contenido: { data : Usuario } = await respuesta.json()

  return contenido.data
}

export async function actualizarUsuario(
  id: string,
  datos: NuevoUsuario
): Promise<Usuario> {
  const respuesta = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No se pudo actualizar el usuario')
  }

  const contenido: { data: Usuario } = await respuesta.json()

  return contenido.data
}

export async function eliminarUsuario(id: string): Promise<void> {
  const respuesta = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
  })

  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar el usuario')
  }
}