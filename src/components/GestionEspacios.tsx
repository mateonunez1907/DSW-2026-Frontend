import { useCallback, useState, type FormEvent } from 'react'
import type {
  Espacio,
  FiltroDisponibilidad,
  ModoDisponibilidad,
} from '../types/espacio'
import { eliminarEspacio, getEspacios } from '../services/espacio.service'
import { useCarga } from '../hooks/useCarga'
import { formatearFecha } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Carga from './ui/Carga'
import EncabezadoSeccion from './ui/EncabezadoSeccion'
import Selector from './ui/Selector'
import Tarjeta from './ui/Tarjeta'
import FormularioEspacio from './FormularioEspacio'

const filtroInicial: FiltroDisponibilidad = {
  modo: 'todos',
  fecha: '',
  horaInicio: '',
  horaFin: '',
}

function describirFiltro(filtro: FiltroDisponibilidad): string {
  if (filtro.modo === 'todos') {
    return 'Todos los espacios'
  }

  const tipo = filtro.modo === 'disponibles' ? 'disponibles' : 'no disponibles'

  return `Espacios ${tipo} el ${formatearFecha(filtro.fecha)} de ${filtro.horaInicio} a ${filtro.horaFin}`
}

function GestionEspacios() {
  const [modo, setModo] = useState<ModoDisponibilidad>('todos')
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [errorFiltro, setErrorFiltro] = useState('')
  const [filtroAplicado, setFiltroAplicado] =
    useState<FiltroDisponibilidad>(filtroInicial)

  const obtener = useCallback(() => getEspacios(filtroAplicado), [filtroAplicado])
  const {
    datos: espacios,
    estado,
    error,
    recargar,
  } = useCarga<Espacio[]>(obtener, [])

  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [enEdicion, setEnEdicion] = useState<Espacio | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState('')
  const [eliminando, setEliminando] = useState(false)

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErrorFiltro('')
    setMensaje('')

    if (modo !== 'todos') {
      if (!fecha || !horaInicio || !horaFin) {
        setErrorFiltro('Completá la fecha y el horario para filtrar por disponibilidad.')
        return
      }

      if (horaFin <= horaInicio) {
        setErrorFiltro('La hora de fin debe ser posterior a la hora de inicio.')
        return
      }
    }

    setFiltroAplicado({ modo, fecha, horaInicio, horaFin })
  }

  function abrirFormulario(espacio: Espacio | null) {
    setEnEdicion(espacio)
    setFormularioAbierto(true)
    setMensaje('')
    setErrorAccion('')
  }

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setEnEdicion(null)
  }

  function alGuardar(texto: string) {
    cerrarFormulario()
    setMensaje(texto)
    recargar()
  }

  async function eliminar(espacio: Espacio) {
    if (eliminando) {
      return
    }

    if (!window.confirm(`¿Querés eliminar el espacio "${espacio.nombre}"?`)) {
      return
    }

    setEliminando(true)
    setMensaje('')
    setErrorAccion('')

    try {
      await eliminarEspacio(espacio.id)
      setMensaje('Espacio eliminado correctamente.')
      recargar()
    } catch {
      setErrorAccion(
        'No pudimos eliminar el espacio. Si tiene reservas o disponibilidades asociadas, eliminalas primero.'
      )
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-espacios" className="flex flex-col gap-4">
      <EncabezadoSeccion
        id="titulo-espacios"
        titulo="Espacios"
        descripcion="Aulas, laboratorios y otros lugares reservables."
      >
        {!formularioAbierto && (
          <Boton onClick={() => abrirFormulario(null)}>Nuevo espacio</Boton>
        )}
      </EncabezadoSeccion>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}
      {errorAccion && <Alerta tipo="error">{errorAccion}</Alerta>}

      {formularioAbierto && (
        <FormularioEspacio
          key={enEdicion?.id ?? 'nuevo'}
          espacio={enEdicion}
          onGuardado={alGuardar}
          onCancelar={cerrarFormulario}
        />
      )}

      <Tarjeta>
        <form onSubmit={buscar} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Selector
            id="espacios-modo"
            etiqueta="Mostrar"
            value={modo}
            onChange={(evento) => setModo(evento.target.value as ModoDisponibilidad)}
          >
            <option value="todos">Todos los espacios</option>
            <option value="disponibles">Solo disponibles</option>
            <option value="no_disponibles">Solo no disponibles</option>
          </Selector>

          {modo !== 'todos' && (
            <>
              <Campo
                id="espacios-fecha"
                etiqueta="Fecha"
                type="date"
                value={fecha}
                onChange={(evento) => setFecha(evento.target.value)}
                required
              />
              <Campo
                id="espacios-hora-inicio"
                etiqueta="Hora de inicio"
                type="time"
                value={horaInicio}
                onChange={(evento) => setHoraInicio(evento.target.value)}
                required
              />
              <Campo
                id="espacios-hora-fin"
                etiqueta="Hora de fin"
                type="time"
                value={horaFin}
                onChange={(evento) => setHoraFin(evento.target.value)}
                required
              />
            </>
          )}

          <div className="flex items-end">
            <Boton type="submit" className="w-full sm:w-auto">
              Buscar
            </Boton>
          </div>
        </form>

        {errorFiltro && (
          <div className="mt-4">
            <Alerta tipo="error">{errorFiltro}</Alerta>
          </div>
        )}
      </Tarjeta>

      <h3 className="text-sm font-medium text-slate-600">
        {describirFiltro(filtroAplicado)}
      </h3>

      <Carga estado={estado} error={error} onReintentar={recargar}>
        {espacios.length === 0 ? (
          <p className="text-sm text-slate-600">
            No hay espacios que coincidan con la búsqueda.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {espacios.map((espacio) => (
              <li key={espacio.id}>
                <Tarjeta className="flex h-full flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold">{espacio.nombre}</h4>
                    <p className="text-sm text-slate-600">
                      {espacio.tipo} · {espacio.capacidad} personas
                    </p>
                    {espacio.descripcion && (
                      <p className="text-sm text-slate-500">{espacio.descripcion}</p>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Boton
                      variante="secundario"
                      disabled={eliminando}
                      onClick={() => abrirFormulario(espacio)}
                    >
                      Editar
                    </Boton>
                    <Boton
                      variante="peligro"
                      disabled={eliminando}
                      onClick={() => eliminar(espacio)}
                    >
                      Eliminar
                    </Boton>
                  </div>
                </Tarjeta>
              </li>
            ))}
          </ul>
        )}
      </Carga>
    </section>
  )
}

export default GestionEspacios
