import type { EstadoReserva } from '../types/estado'

export async function getEstados(): Promise<EstadoReserva[]> {
  const respuesta = await fetch('/api/estados')

  if (!respuesta.ok) {
    throw new Error('No se pudieron consultar los estados')
  }

  const contenido: { data: EstadoReserva[] } = await respuesta.json()

  return contenido.data
}