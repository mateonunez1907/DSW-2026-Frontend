import type { Espacio, NuevoEspacio } from '../types/espacio'

export async function getEspacios(): Promise<Espacio[]> {
  const respuesta = await fetch('/api/espacios');

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los espacios');
  }

  const contenido : { data: Espacio[] } = await respuesta.json();

  return contenido.data 
}

export async function crearEspacio(
  datos: NuevoEspacio
): Promise<Espacio>{
  const respuesta = await fetch('/api/espacios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No se pudo crear el espacio')
  }

  const contenido: {data: Espacio} = await respuesta.json()

  return contenido.data
}
