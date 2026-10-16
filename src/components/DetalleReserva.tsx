import { useCallback, useState } from 'react'
import type { EstadoReserva } from '../types/estado'
import type { Reserva } from '../types/reserva'
import { cambiarEstadoReserva, getReserva } from '../services/reserva.service'
import { mensajeDeError } from '../services/api'
import { useCarga } from '../hooks/useCarga'
import { formatearFecha, recortarHora } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Carga from './ui/Carga'
import Insignia from './ui/Insignia'
import Tarjeta from './ui/Tarjeta'

interface Accion {
  estado: string
  etiqueta: string
  variante: 'primario' | 'secundario' | 'peligro'
  exito: string
  confirmar?: string
}

const accionesPorEstado: Record<string, Accion[]> = {
  pendiente: [
    {
      estado: 'aprobada',
      etiqueta: 'Aprobar',
      variante: 'primario',
      exito: 'Reserva aprobada correctamente.',
    },
    {
      estado: 'rechazada',
      etiqueta: 'Rechazar',
      variante: 'peligro',
      exito: 'Reserva rechazada correctamente.',
    },
    {
      estado: 'cancelada',
      etiqueta: 'Cancelar reserva',
      variante: 'secundario',
      exito: 'Reserva cancelada correctamente.',
      confirmar: '¿Querés cancelar esta reserva?',
    },
  ],
  aprobada: [
    {
      estado: 'cancelada',
      etiqueta: 'Cancelar reserva',
      variante: 'secundario',
      exito: 'Reserva cancelada correctamente.',
      confirmar: '¿Querés cancelar esta reserva?',
    },
  ],
}

interface DetalleReservaProps {
  id: number
  estados: EstadoReserva[]
  onCerrar: () => void
  onEstadoCambiado: (mensaje: string) => void
}

function DetalleReserva({
  id,
  estados,
  onCerrar,
  onEstadoCambiado,
}: DetalleReservaProps) {
  const obtener = useCallback(() => getReserva(id), [id])
  const {
    datos: reserva,
    estado,
    error,
    recargar,
  } = useCarga<Reserva | null>(obtener, null)

  const [procesando, setProcesando] = useState(false)
  const [errorAccion, setErrorAccion] = useState('')

  async function ejecutar(accion: Accion) {
    if (procesando) {
      return
    }

    if (accion.confirmar && !window.confirm(accion.confirmar)) {
      return
    }

    const nuevoEstado = estados.find((candidato) => candidato.nombre === accion.estado)

    if (!nuevoEstado) {
      setErrorAccion('No pudimos identificar el estado solicitado. Recargá la página.')
      return
    }

    setProcesando(true)
    setErrorAccion('')

    try {
      await cambiarEstadoReserva(id, nuevoEstado.id)
      onEstadoCambiado(accion.exito)
      recargar()
    } catch (fallo) {
      setErrorAccion(
        mensajeDeError(fallo, 'No pudimos cambiar el estado de la reserva.')
      )
    } finally {
      setProcesando(false)
    }
  }

  return (
    <Tarjeta className="bg-slate-50">
      <Carga estado={estado} error={error} onReintentar={recargar}>
        {reserva && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">Detalle de la reserva</h4>
              <Insignia texto={reserva.estado.nombre} />
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-700">Fecha y horario</dt>
                <dd className="text-slate-600">
                  {formatearFecha(reserva.fecha)}, de {recortarHora(reserva.horaInicio)} a{' '}
                  {recortarHora(reserva.horaFin)}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">Usuario</dt>
                <dd className="text-slate-600">
                  {reserva.usuario.nombre} {reserva.usuario.apellido}
                  <br />
                  <span className="break-all">{reserva.usuario.email}</span>
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">Espacio</dt>
                <dd className="text-slate-600">
                  {reserva.espacio.nombre} ({reserva.espacio.tipo})
                  <br />
                  Capacidad: {reserva.espacio.capacidad} personas
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">Descripción del espacio</dt>
                <dd className="text-slate-600">
                  {reserva.espacio.descripcion || 'Sin descripción'}
                </dd>
              </div>
            </dl>

            {errorAccion && <Alerta tipo="error">{errorAccion}</Alerta>}

            <div className="flex flex-col gap-2 sm:flex-row">
              {(accionesPorEstado[reserva.estado.nombre] ?? []).map((accion) => (
                <Boton
                  key={accion.estado}
                  variante={accion.variante}
                  disabled={procesando}
                  onClick={() => ejecutar(accion)}
                >
                  {accion.etiqueta}
                </Boton>
              ))}

              <Boton variante="secundario" onClick={onCerrar} disabled={procesando}>
                Cerrar
              </Boton>
            </div>
          </div>
        )}
      </Carga>
    </Tarjeta>
  )
}

export default DetalleReserva
