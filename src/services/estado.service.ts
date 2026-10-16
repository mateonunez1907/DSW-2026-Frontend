import type { EstadoReserva } from '../types/estado'
import { solicitar } from './api'

export function getEstados(): Promise<EstadoReserva[]> {
  return solicitar<EstadoReserva[]>('/api/estados')
}
