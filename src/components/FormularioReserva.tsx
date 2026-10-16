import { useState } from 'react'
import type { Usuario } from '../types/usuario'
import type { Espacio } from '../types/espacio'
import type { NuevaReserva } from '../types/reserva'
import { getUsuario } from '../services/usuario.service'
import { getEspacios } from '../services/espacio.service'
import { crearReserva } from '../services/reserva.service'

interface FormularioReservaProps {
  onCreada: () => void
}

type EstadoCarga = 'inicial' | 'cargando' | 'exito' | 'error'

function FormularioReserva({ onCreada }: FormularioReservaProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [estadoOpciones, setEstadoOpciones] =
    useState<EstadoCarga>('inicial')

  const [usuarioId, setUsuarioId] = useState('')
  const [espacioId, setEspacioId] = useState('')
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const hayOpciones = usuarios.length > 0 && espacios.length > 0

  async function cargarOpciones() {
    setEstadoOpciones('cargando')
    setError('')
    setMensaje('')

    try {
      const datosUsuarios = await getUsuario()
      const datosEspacios = await getEspacios()

      setUsuarios(datosUsuarios)
      setEspacios(datosEspacios)
      setUsuarioId('')
      setEspacioId('')
      setEstadoOpciones('exito')
    } catch {
      setEstadoOpciones('error')
    }
  }

  async function guardarReserva() {
    if (guardando) {
      return
    }

    setError('')
    setMensaje('')

    if (
      !usuarioId ||
      !espacioId ||
      !fecha ||
      !horaInicio ||
      !horaFin
    ) {
      setError('Completá todos los campos.')
      return
    }

    if (horaFin <= horaInicio) {
      setError('La hora de finalización debe ser posterior a la de inicio.')
      return
    }

    const datos: NuevaReserva = {
      usuario: Number(usuarioId),
      espacio: Number(espacioId),
      fecha,
      horaInicio: `${horaInicio}:00`,
      horaFin: `${horaFin}:00`,
    }

    setGuardando(true)

    try {
      await crearReserva(datos)

      setUsuarioId('')
      setEspacioId('')
      setFecha('')
      setHoraInicio('')
      setHoraFin('')

      setMensaje('Reserva creada. Quedó pendiente de aprobación.')
      onCreada()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la reserva'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-crear-reserva">
      <h3 id="titulo-crear-reserva">Crear reserva</h3>

      <button
        type="button"
        onClick={cargarOpciones}
        disabled={estadoOpciones === 'cargando' || guardando}
      >
        {estadoOpciones === 'inicial' && 'Nueva reserva'}
        {estadoOpciones === 'cargando' && 'Cargando opciones...'}
        {estadoOpciones === 'exito' && 'Actualizar usuarios y espacios'}
        {estadoOpciones === 'error' && 'Reintentar carga'}
      </button>

      {estadoOpciones === 'cargando' && (
        <p role="status">Cargando usuarios y espacios...</p>
      )}

      {estadoOpciones === 'error' && (
        <p role="alert">
          No pudimos cargar los usuarios y espacios. Intentá nuevamente.
        </p>
      )}

      {estadoOpciones === 'exito' && !hayOpciones && (
        <p>
          Para reservar debe haber al menos un usuario y un espacio
          registrados.
        </p>
      )}

      {estadoOpciones === 'exito' && hayOpciones && (
        <form
          onSubmit={(evento) => {
            evento.preventDefault()
            guardarReserva()
          }}
        >
          <fieldset disabled={guardando}>
            <legend>Datos de la reserva</legend>

            <div>
              <label htmlFor="reserva-usuario">Usuario</label>
              <select
                id="reserva-usuario"
                value={usuarioId}
                onChange={(evento) => setUsuarioId(evento.target.value)}
                required
              >
                <option value="">Seleccioná un usuario</option>

                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido} — {usuario.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reserva-espacio">Espacio</label>
              <select
                id="reserva-espacio"
                value={espacioId}
                onChange={(evento) => setEspacioId(evento.target.value)}
                required
              >
                <option value="">Seleccioná un espacio</option>

                {espacios.map((espacio) => (
                  <option key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reserva-fecha">Fecha</label>
              <input
                id="reserva-fecha"
                type="date"
                value={fecha}
                onChange={(evento) => setFecha(evento.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="reserva-hora-inicio">Hora de inicio</label>
              <input
                id="reserva-hora-inicio"
                type="time"
                step={60}
                value={horaInicio}
                onChange={(evento) => setHoraInicio(evento.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="reserva-hora-fin">Hora de finalización</label>
              <input
                id="reserva-hora-fin"
                type="time"
                step={60}
                value={horaFin}
                onChange={(evento) => setHoraFin(evento.target.value)}
                required
              />
            </div>

            <button type="submit">
              {guardando ? 'Guardando...' : 'Crear reserva'}
            </button>
          </fieldset>
        </form>
      )}

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}
    </section>
  )
}

export default FormularioReserva