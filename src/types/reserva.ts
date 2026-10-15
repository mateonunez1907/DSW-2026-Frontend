export interface Reserva {
  id: number
  fecha: string
  horaInicio: string
  horaFin: string

  usuario: {
    id: number
    nombre: string
    apellido: string
    email: string
  }

  espacio: {
    id: number
    nombre: string
    descripcion?: string | null
    capacidad: number
    tipo: string
  }

  estado: {
    id: number
    nombre: string
  }
}

export interface FiltrosReserva {
  estado?: string
  fecha?: string
}