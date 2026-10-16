import type {
  Disponibilidad,
  NuevaDisponibilidad,
} from '../types/disponibilidad'
import { solicitar } from './api'

export function getDisponibilidades(): Promise<Disponibilidad[]> {
  return solicitar<Disponibilidad[]>('/api/disponibilidades')
}

export function crearDisponibilidad(
  datos: NuevaDisponibilidad
): Promise<Disponibilidad> {
  return solicitar<Disponibilidad>('/api/disponibilidades', {
    metodo: 'POST',
    cuerpo: datos,
  })
}

export function actualizarDisponibilidad(
  id: number,
  datos: NuevaDisponibilidad
): Promise<Disponibilidad> {
  return solicitar<Disponibilidad>(`/api/disponibilidades/${id}`, {
    metodo: 'PUT',
    cuerpo: datos,
  })
}

export function eliminarDisponibilidad(id: number): Promise<void> {
  return solicitar(`/api/disponibilidades/${id}`, { metodo: 'DELETE' })
}
