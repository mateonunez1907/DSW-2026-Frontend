import type { Reserva, FiltrosReserva, NuevaReserva,} from '../types/reserva'

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

export async function cambiarEstadoReserva(
  id: number,
  estadoId: number
): Promise<void> {
  const respuesta = await fetch(`/api/reservas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      estado: estadoId,
    }),
  })

  if (!respuesta.ok) {
    const contenido: { message?: string } | null =
      await respuesta.json().catch(() => null)

    throw new Error(
      contenido?.message || 'No se pudo cambiar el estado de la reserva'
    )
  }
}

export async function crearReserva(
  datos: NuevaReserva
): Promise<void> {
  const respuesta = await fetch('/api/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    const contenido: { message?: string } | null =
      await respuesta.json().catch(() => null)

    throw new Error(
      contenido?.message || 'No se pudo crear la reserva'
    )
  }
}