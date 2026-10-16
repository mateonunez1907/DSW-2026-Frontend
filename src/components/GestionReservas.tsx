import { useCallback, useState, type FormEvent } from 'react'
import type { Espacio } from '../types/espacio'
import type { EstadoReserva } from '../types/estado'
import type { FiltrosReserva, Reserva } from '../types/reserva'
import type { Usuario } from '../types/usuario'
import { getEspacios } from '../services/espacio.service'
import { getEstados } from '../services/estado.service'
import { getReservas } from '../services/reserva.service'
import { getUsuarios } from '../services/usuario.service'
import { useCarga } from '../hooks/useCarga'
import { formatearFecha, recortarHora } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Carga from './ui/Carga'
import EncabezadoSeccion from './ui/EncabezadoSeccion'
import Insignia from './ui/Insignia'
import Selector from './ui/Selector'
import Tarjeta from './ui/Tarjeta'
import DetalleReserva from './DetalleReserva'
import FormularioReserva from './FormularioReserva'

function GestionReservas() {
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')
  const [filtros, setFiltros] = useState<FiltrosReserva>({})

  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [seleccionada, setSeleccionada] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState('')

  const obtener = useCallback(() => getReservas(filtros), [filtros])
  const {
    datos: reservas,
    estado,
    error,
    recargar,
  } = useCarga<Reserva[]>(obtener, [])

  const obtenerUsuarios = useCallback(() => getUsuarios(), [])
  const { datos: usuarios } = useCarga<Usuario[]>(obtenerUsuarios, [])

  const obtenerEspacios = useCallback(() => getEspacios(), [])
  const { datos: espacios } = useCarga<Espacio[]>(obtenerEspacios, [])

  const obtenerEstados = useCallback(() => getEstados(), [])
  const { datos: estados } = useCarga<EstadoReserva[]>(obtenerEstados, [])

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setMensaje('')
    setSeleccionada(null)
    setFiltros({ estado: estadoFiltro, fecha: fechaFiltro })
  }

  function alCrear(texto: string) {
    setFormularioAbierto(false)
    setMensaje(texto)
    recargar()
  }

  function alCambiarEstado(texto: string) {
    setMensaje(texto)
    recargar()
  }

  return (
    <section aria-labelledby="titulo-reservas" className="flex flex-col gap-4">
      <EncabezadoSeccion
        id="titulo-reservas"
        titulo="Reservas"
        descripcion="Solicitudes de uso de espacios y su estado."
      >
        {!formularioAbierto && (
          <Boton
            onClick={() => {
              setMensaje('')
              setFormularioAbierto(true)
            }}
          >
            Nueva reserva
          </Boton>
        )}
      </EncabezadoSeccion>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}

      {formularioAbierto && (
        <FormularioReserva
          usuarios={usuarios}
          espacios={espacios}
          onCreada={alCrear}
          onCancelar={() => setFormularioAbierto(false)}
        />
      )}

      <Tarjeta>
        <form onSubmit={buscar} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Selector
            id="filtro-estado"
            etiqueta="Estado"
            value={estadoFiltro}
            onChange={(evento) => setEstadoFiltro(evento.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </Selector>

          <Campo
            id="filtro-fecha"
            etiqueta="Fecha"
            type="date"
            value={fechaFiltro}
            onChange={(evento) => setFechaFiltro(evento.target.value)}
          />

          <div className="flex items-end">
            <Boton type="submit" className="w-full sm:w-auto">
              Buscar reservas
            </Boton>
          </div>
        </form>
      </Tarjeta>

      <Carga estado={estado} error={error} onReintentar={recargar}>
        {reservas.length === 0 ? (
          <p className="text-sm text-slate-600">
            No hay reservas que coincidan con los filtros.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {reservas.map((reserva) => (
              <li key={reserva.id} className="flex flex-col gap-3">
                <Tarjeta className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{reserva.espacio.nombre}</h3>
                      <Insignia texto={reserva.estado.nombre} />
                    </div>
                    <p className="text-sm text-slate-600">
                      {formatearFecha(reserva.fecha)} · {recortarHora(reserva.horaInicio)} a{' '}
                      {recortarHora(reserva.horaFin)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {reserva.usuario.nombre} {reserva.usuario.apellido}
                    </p>
                  </div>

                  <Boton
                    variante="secundario"
                    onClick={() =>
                      setSeleccionada(seleccionada === reserva.id ? null : reserva.id)
                    }
                  >
                    {seleccionada === reserva.id ? 'Ocultar detalle' : 'Ver detalle'}
                  </Boton>
                </Tarjeta>

                {seleccionada === reserva.id && (
                  <DetalleReserva
                    id={reserva.id}
                    estados={estados}
                    onCerrar={() => setSeleccionada(null)}
                    onEstadoCambiado={alCambiarEstado}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Carga>
    </section>
  )
}

export default GestionReservas
