import type { Reserva, FiltrosReserva } from '../types/reserva'

export async function getReservas(
  filtros: FiltrosReserva
): Promise<Reserva[]> {
  const parametros = new URLSearchParams()

  if (filtros.estado) {
    parametros.set('estado', filtros.estado)
  }

  if (filtros.fecha) {
    parametros.set('fecha', filtros.fecha)
  }

  const consulta = parametros.toString()

  const url = consulta
    ? `/api/reservas?${consulta}`
    : '/api/reservas'

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las reservas')
  }

  const contenido: { data: Reserva[] } = await respuesta.json()

  return contenido.data
}

export async function getReserva(id: number): Promise<Reserva> {
  const respuesta = await fetch(`/api/reservas/${id}`)

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el detalle de la reserva')
  }

  const contenido: { data: Reserva } = await respuesta.json()

  return contenido.data
}