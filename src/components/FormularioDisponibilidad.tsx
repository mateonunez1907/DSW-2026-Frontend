import { useState, type FormEvent } from 'react'
import type { Disponibilidad, NuevaDisponibilidad } from '../types/disponibilidad'
import type { Espacio } from '../types/espacio'
import {
  actualizarDisponibilidad,
  crearDisponibilidad,
} from '../services/disponibilidad.service'
import { mensajeDeError } from '../services/api'
import { aHoraCompleta, diasSemana, recortarHora } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Selector from './ui/Selector'
import Tarjeta from './ui/Tarjeta'

interface FormularioDisponibilidadProps {
  espacios: Espacio[]
  disponibilidad: Disponibilidad | null
  onGuardado: (mensaje: string) => void
  onCancelar: () => void
}

function FormularioDisponibilidad({
  espacios,
  disponibilidad,
  onGuardado,
  onCancelar,
}: FormularioDisponibilidadProps) {
  const [espacioId, setEspacioId] = useState(
    disponibilidad ? String(disponibilidad.espacio.id) : ''
  )
  const [dia, setDia] = useState(
    disponibilidad ? String(disponibilidad.diaSemana) : ''
  )
  const [horaInicio, setHoraInicio] = useState(
    disponibilidad ? recortarHora(disponibilidad.horaInicio) : ''
  )
  const [horaFin, setHoraFin] = useState(
    disponibilidad ? recortarHora(disponibilidad.horaFin) : ''
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    if (horaFin <= horaInicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio.')
      return
    }

    const datos: NuevaDisponibilidad = {
      espacio: Number(espacioId),
      diaSemana: Number(dia),
      horaInicio: aHoraCompleta(horaInicio),
      horaFin: aHoraCompleta(horaFin),
    }

    setError('')
    setGuardando(true)

    try {
      if (disponibilidad) {
        await actualizarDisponibilidad(disponibilidad.id, datos)
        onGuardado('Disponibilidad actualizada correctamente.')
      } else {
        await crearDisponibilidad(datos)
        onGuardado('Disponibilidad creada correctamente.')
      }
    } catch (fallo) {
      setError(
        mensajeDeError(fallo, 'No pudimos guardar la disponibilidad. Intentá nuevamente.')
      )
      setGuardando(false)
    }
  }

  return (
    <Tarjeta>
      <h3 className="mb-4 text-lg font-semibold">
        {disponibilidad ? 'Editar disponibilidad' : 'Nueva disponibilidad'}
      </h3>

      {espacios.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <Alerta tipo="info">
            Primero tiene que haber al menos un espacio registrado.
          </Alerta>
          <Boton variante="secundario" onClick={onCancelar}>
            Cerrar
          </Boton>
        </div>
      ) : (
        <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
          <Selector
            id="disponibilidad-espacio"
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

          <Selector
            id="disponibilidad-dia"
            etiqueta="Día de la semana"
            value={dia}
            onChange={(evento) => setDia(evento.target.value)}
            required
            disabled={guardando}
          >
            <option value="">Seleccioná un día</option>
            {diasSemana.map((nombre, indice) => (
              <option key={nombre} value={indice}>
                {nombre}
              </option>
            ))}
          </Selector>

          <Campo
            id="disponibilidad-hora-inicio"
            etiqueta="Desde"
            type="time"
            value={horaInicio}
            onChange={(evento) => setHoraInicio(evento.target.value)}
            required
            disabled={guardando}
          />

          <Campo
            id="disponibilidad-hora-fin"
            etiqueta="Hasta"
            type="time"
            value={horaFin}
            onChange={(evento) => setHoraFin(evento.target.value)}
            required
            disabled={guardando}
          />

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
              {guardando
                ? 'Guardando…'
                : disponibilidad
                  ? 'Guardar cambios'
                  : 'Crear disponibilidad'}
            </Boton>
          </div>
        </form>
      )}
    </Tarjeta>
  )
}

export default FormularioDisponibilidad
