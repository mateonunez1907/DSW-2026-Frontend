export interface Espacio {
  id: number
  nombre: string
  descripcion?: string | null
  capacidad: number
  tipo: string
}

export interface NuevoEspacio {
  nombre: string
  descripcion?: string
  capacidad: number
  tipo: string
}

export type ModoDisponibilidad = 'todos' | 'disponibles' | 'no_disponibles'

export interface FiltroDisponibilidad {
  modo: ModoDisponibilidad
  fecha: string
  horaInicio: string
  horaFin: string
}
