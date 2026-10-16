import { useState } from 'react'
import type { Reserva } from '../types/reserva'
import { getReservas, getReserva, cambiarEstadoReserva, } from '../services/reserva.service'
import { getEstados } from '../services/estado.service'
import FormularioReserva from './FormularioReserva'

type EstadoCarga = 'inicial' | 'cargando' | 'exito' | 'error'

function GestionReservas() {
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')

  const [reservas, setReservas] = useState<Reserva[]>([])
  const [estadoLista, setEstadoLista] = useState<EstadoCarga>('inicial')

  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<Reserva | null>(null)

  const [estadoDetalle, setEstadoDetalle] =
    useState<EstadoCarga>('inicial')

  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')

  const consultando =
    estadoLista === 'cargando' ||
    estadoDetalle === 'cargando' ||
    guardando

  function limpiarMensajes() {
    setMensajeExito('')
    setMensajeError('')
  }

  function limpiarResultados() {
    setReservas([])
    setEstadoLista('inicial')
    setReservaSeleccionada(null)
    setEstadoDetalle('inicial')
    limpiarMensajes()
  }

  async function cargarReservas() {
    setEstadoLista('cargando')
    setReservaSeleccionada(null)
    setEstadoDetalle('inicial')

    try {
      const datos = await getReservas({
        estado: estadoFiltro,
        fecha: fechaFiltro,
      })

      setReservas(datos)
      setEstadoLista('exito')
    } catch {
      setEstadoLista('error')
    }
  }

  async function verDetalle(id: number) {
    limpiarMensajes()
    setReservaSeleccionada(null)
    setEstadoDetalle('cargando')

    try {
      const datos = await getReserva(id)

      setReservaSeleccionada(datos)
      setEstadoDetalle('exito')
    } catch {
      setEstadoDetalle('error')
    }
  }

  async function cambiarEstado(
    nombre: 'aprobada' | 'rechazada' | 'cancelada'
  ) {
    if (reservaSeleccionada === null || consultando) {
      return
    }

    if (nombre === 'cancelada') {
      const confirmado = window.confirm(
        '¿Querés cancelar esta reserva?'
      )

      if (!confirmado) {
        return
      }
    }

    limpiarMensajes()
    setGuardando(true)

    try {
      const estados = await getEstados()

      const nuevoEstado = estados.find(
        (estado) => estado.nombre === nombre
      )

      if (!nuevoEstado) {
        throw new Error('No se encontró el estado solicitado')
      }

      await cambiarEstadoReserva(
        reservaSeleccionada.id,
        nuevoEstado.id
      )

      setMensajeExito(`Reserva ${nombre} correctamente.`)

      await cargarReservas()
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado de la reserva'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-reservas">
      <h2 id="titulo-reservas">Reservas</h2>

      <FormularioReserva onCreada={() => { limpiarMensajes() 
        cargarReservas()}}/>

      <p>
        Elegí los filtros y presioná Buscar reservas.
        Podés dejar ambos vacíos para consultar todas.
      </p>

      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          limpiarMensajes()
          cargarReservas()
        }}
      >
        <div>
          <label htmlFor="filtro-estado-reserva">Estado</label>

          <select
            id="filtro-estado-reserva"
            name="estado"
            value={estadoFiltro}
            disabled={consultando}
            onChange={(evento) => {
              setEstadoFiltro(evento.target.value)
              limpiarResultados()
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="filtro-fecha-reserva">Fecha</label>

          <input
            id="filtro-fecha-reserva"
            name="fecha"
            type="date"
            value={fechaFiltro}
            disabled={consultando}
            onChange={(evento) => {
              setFechaFiltro(evento.target.value)
              limpiarResultados()
            }}
          />
        </div>

        <button type="submit" disabled={consultando}>
          {estadoLista === 'cargando'
            ? 'Buscando...'
            : 'Buscar reservas'}
        </button>
      </form>

      {guardando && (
        <p role="status">Procesando la solicitud...</p>
      )}

      {mensajeExito !== '' && (
        <p role="status">{mensajeExito}</p>
      )}

      {mensajeError !== '' && (
        <p role="alert">{mensajeError}</p>
      )}

      {estadoLista === 'cargando' && (
        <p role="status">Buscando reservas...</p>
      )}

      {estadoLista === 'error' && (
        <p role="alert">
          No pudimos cargar el listado de reservas.
          Presioná Buscar reservas para reintentar.
        </p>
      )}

      {estadoLista === 'exito' && reservas.length === 0 && (
        <p>No hay reservas que coincidan con los filtros.</p>
      )}

      {estadoLista === 'exito' && reservas.length > 0 && (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <h3>{reserva.espacio.nombre}</h3>

              <p>
                Usuario: {reserva.usuario.nombre}
                {' '}
                {reserva.usuario.apellido}
              </p>

              <p>Fecha: {reserva.fecha}</p>

              <p>
                Horario: {reserva.horaInicio} a {reserva.horaFin}
              </p>

              <p>Estado: {reserva.estado.nombre}</p>

              <button
                type="button"
                disabled={consultando}
                onClick={() => verDetalle(reserva.id)}
              >
                Ver detalle
              </button>
            </li>
          ))}
        </ul>
      )}

      {estadoDetalle === 'cargando' && (
        <p role="status">Cargando detalle de la reserva...</p>
      )}

      {estadoDetalle === 'error' && (
        <p role="alert">
          No pudimos cargar el detalle.
          Presioná Ver detalle nuevamente para reintentar.
        </p>
      )}

      {reservaSeleccionada !== null && (
        <section aria-labelledby="titulo-detalle-reserva">
          <h3 id="titulo-detalle-reserva">Detalle de la reserva</h3>

          <p>
            <strong>Fecha:</strong> {reservaSeleccionada.fecha}
          </p>

          <p>
            <strong>Horario:</strong> {reservaSeleccionada.horaInicio}
            {' a '}
            {reservaSeleccionada.horaFin}
          </p>

          <p>
            <strong>Estado:</strong> {reservaSeleccionada.estado.nombre}
          </p>

          <h4>Usuario</h4>

          <p>
            {reservaSeleccionada.usuario.nombre}
            {' '}
            {reservaSeleccionada.usuario.apellido}
          </p>

          <p>
            <strong>Email:</strong> {reservaSeleccionada.usuario.email}
          </p>

          <h4>Espacio</h4>

          <p>
            <strong>Nombre:</strong> {reservaSeleccionada.espacio.nombre}
          </p>

          <p>
            <strong>Descripción:</strong>{' '}
            {reservaSeleccionada.espacio.descripcion || 'Sin descripción'}
          </p>

          <p>
            <strong>Tipo:</strong> {reservaSeleccionada.espacio.tipo}
          </p>

          <p>
            <strong>Capacidad:</strong>{' '}
            {reservaSeleccionada.espacio.capacidad} personas
          </p>

          {reservaSeleccionada.estado.nombre === 'pendiente' && (
            <div>
              <h4>Resolver solicitud</h4>

              <button
                type="button"
                disabled={consultando}
                onClick={() => cambiarEstado('aprobada')}
              >
                Aprobar reserva
              </button>

              <button
                type="button"
                disabled={consultando}
                onClick={() => cambiarEstado('rechazada')}
              >
                Rechazar reserva
              </button>
            </div>
          )}

          {(
            reservaSeleccionada.estado.nombre === 'pendiente' ||
            reservaSeleccionada.estado.nombre === 'aprobada'
          ) && (
            <button
              type="button"
              disabled={consultando}
              onClick={() => cambiarEstado('cancelada')}
            >
              Cancelar reserva
            </button>
          )}

          <button
            type="button"
            disabled={consultando}
            onClick={() => {
              setReservaSeleccionada(null)
              setEstadoDetalle('inicial')
              limpiarMensajes()
            }}
          >
            Cerrar detalle
          </button>
        </section>
      )}
    </section>
  )
}

export default GestionReservas