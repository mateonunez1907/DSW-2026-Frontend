import type { Usuario} from '../types/usuario';


// Todos los users

export async function getUsuario(): Promise<Usuario[]> {
  const respuesta = await fetch('/api/usuarios');

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los usuarios');
  }

  const contenido : { data: Usuario[] } = await respuesta.json();

  return contenido.data 
}

