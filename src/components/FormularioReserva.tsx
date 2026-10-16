import { useState, type FormEvent } from 'react'
import type { Espacio } from '../types/espacio'
import type { NuevaReserva } from '../types/reserva'
import type { Usuario } from '../types/usuario'
import { crearReserva } from '../services/reserva.service'
import { mensajeDeError } from '../services/api'
import { aHoraCompleta } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Selector from './ui/Selector'
import Tarjeta from './ui/Tarjeta'

interface FormularioReservaProps {
  usuarios: Usuario[]
  espacios: Espacio[]
  onCreada: (mensaje: string) => void
  onCancelar: () => void
}

function FormularioReserva({
  usuarios,
  espacios,
  onCreada,
  onCancelar,
}: FormularioReservaProps) {
  const [usuarioId, setUsuarioId] = useState('')
  const [espacioId, setEspacioId] = useState('')
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const hayOpciones = usuarios.length > 0 && espacios.length > 0

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (guardando) {
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
      horaInicio: aHoraCompleta(horaInicio),
      horaFin: aHoraCompleta(horaFin),
    }

    setError('')
    setGuardando(true)

    try {
      await crearReserva(datos)
      onCreada('Reserva creada. Quedó pendiente de aprobación.')
    } catch (fallo) {
      setError(mensajeDeError(fallo, 'No pudimos crear la reserva. Intentá nuevamente.'))
      setGuardando(false)
    }
  }

  return (
    <Tarjeta>
      <h3 className="mb-4 text-lg font-semibold">Nueva reserva</h3>

      {!hayOpciones ? (
        <div className="flex flex-col items-start gap-3">
          <Alerta tipo="info">
            Para reservar tiene que haber al menos un usuario y un espacio registrados.
          </Alerta>
          <Boton variante="secundario" onClick={onCancelar}>
            Cerrar
          </Boton>
        </div>
      ) : (
        <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
          <Selector
            id="reserva-usuario"
            etiqueta="Usuario"
            value={usuarioId}
            onChange={(evento) => setUsuarioId(evento.target.value)}
            required
            disabled={guardando}
          >
            <option value="">Seleccioná un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} {usuario.apellido}
              </option>
            ))}
          </Selector>

          <Selector
            id="reserva-espacio"
            etiqueta="Espacio"
            value={espacioId}
            onChange={(evento) => setEspacioId(evento.target.value)}
            required
            disabled={guardando}
          >
            <option value="">Seleccioná un espacio</option>
            {espacios.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre}
              </option>
            ))}
          </Selector>

          <Campo
            id="reserva-fecha"
            etiqueta="Fecha"
            type="date"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            required
            disabled={guardando}
          />

          <div className="grid grid-cols-2 gap-4">
            <Campo
              id="reserva-hora-inicio"
              etiqueta="Desde"
              type="time"
              value={horaInicio}
              onChange={(evento) => setHoraInicio(evento.target.value)}
              required
              disabled={guardando}
            />
            <Campo
              id="reserva-hora-fin"
              etiqueta="Hasta"
              type="time"
              value={horaFin}
              onChange={(evento) => setHoraFin(evento.target.value)}
              required
              disabled={guardando}
            />
          </div>

          {error && (
            <div className="sm:col-span-2">
              <Alerta tipo="error">{error}</Alerta>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Crear reserva'}
            </Boton>
          </div>
        </form>
      )}
    </Tarjeta>
  )
}

export default FormularioReserva
