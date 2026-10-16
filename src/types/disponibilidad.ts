export interface Disponibilidad {
  id: number
  diaSemana: number
  horaInicio: string
  horaFin: string
  espacio: {
    id: number
    nombre: string
  }
}

export interface NuevaDisponibilidad {
  espacio: number
  diaSemana: number
  horaInicio: string
  horaFin: string
}
