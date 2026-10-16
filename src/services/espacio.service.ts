import type {
  Espacio,
  FiltroDisponibilidad,
  NuevoEspacio,
} from '../types/espacio'
import { solicitar } from './api'
import { aHoraCompleta } from '../utils/horarios'

export function getEspacios(filtro?: FiltroDisponibilidad): Promise<Espacio[]> {
  if (!filtro || filtro.modo === 'todos') {
    return solicitar<Espacio[]>('/api/espacios')
  }

  const parametros = new URLSearchParams({
    disponibilidad: filtro.modo,
    fecha: filtro.fecha,
    horaInicio: aHoraCompleta(filtro.horaInicio),
    horaFin: aHoraCompleta(filtro.horaFin),
  })

  return solicitar<Espacio[]>(`/api/espacios?${parametros}`)
}

export function crearEspacio(datos: NuevoEspacio): Promise<Espacio> {
  return solicitar<Espacio>('/api/espacios', { metodo: 'POST', cuerpo: datos })
}

export function actualizarEspacio(
  id: number,
  datos: NuevoEspacio
): Promise<Espacio> {
  return solicitar<Espacio>(`/api/espacios/${id}`, {
    metodo: 'PUT',
    cuerpo: datos,
  })
}

export function eliminarEspacio(id: number): Promise<void> {
  return solicitar(`/api/espacios/${id}`, { metodo: 'DELETE' })
}
