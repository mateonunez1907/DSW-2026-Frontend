export const diasSemana = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export function aHoraCompleta(hora: string): string {
  return hora.length === 5 ? `${hora}:00` : hora
}

export function recortarHora(hora: string): string {
  return hora.slice(0, 5)
}

export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}
