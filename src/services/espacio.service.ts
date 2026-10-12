import type { Espacio } from '../types/espacio'

export async function getEspacios(): Promise<Espacio[]> {
  const respuesta = await fetch('/api/espacios');

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los espacios');
  }

  const contenido : { data: Espacio[] } = await respuesta.json();

  return contenido.data 
}


