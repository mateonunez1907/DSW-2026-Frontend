import type { FiltrosReserva, NuevaReserva, Reserva } from '../types/reserva'
import { solicitar } from './api'

export function getReservas(filtros: FiltrosReserva): Promise<Reserva[]> {
  const parametros = new URLSearchParams()

  if (filtros.estado) {
    parametros.set('estado', filtros.estado)
  }

  if (filtros.fecha) {
    parametros.set('fecha', filtros.fecha)
  }

  const consulta = parametros.toString()

  return solicitar<Reserva[]>(
    consulta ? `/api/reservas?${consulta}` : '/api/reservas'
  )
}

export function getReserva(id: number): Promise<Reserva> {
  return solicitar<Reserva>(`/api/reservas/${id}`)
}

export function crearReserva(datos: NuevaReserva): Promise<Reserva> {
  return solicitar<Reserva>('/api/reservas', { metodo: 'POST', cuerpo: datos })
}

export function cambiarEstadoReserva(
  id: number,
  estadoId: number
): Promise<Reserva> {
  return solicitar<Reserva>(`/api/reservas/${id}`, {
    metodo: 'PATCH',
    cuerpo: { estado: estadoId },
  })
}
