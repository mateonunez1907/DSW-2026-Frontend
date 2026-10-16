import { useCallback, useState } from 'react'
import type { Disponibilidad } from '../types/disponibilidad'
import type { Espacio } from '../types/espacio'
import {
  eliminarDisponibilidad,
  getDisponibilidades,
} from '../services/disponibilidad.service'
import { getEspacios } from '../services/espacio.service'
import { mensajeDeError } from '../services/api'
import { useCarga } from '../hooks/useCarga'
import { diasSemana, recortarHora } from '../utils/horarios'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Carga from './ui/Carga'
import EncabezadoSeccion from './ui/EncabezadoSeccion'
import Tarjeta from './ui/Tarjeta'
import FormularioDisponibilidad from './FormularioDisponibilidad'

function GestionDisponibilidades() {
  const obtener = useCallback(() => getDisponibilidades(), [])
  const {
    datos: disponibilidades,
    estado,
    error,
    recargar,
  } = useCarga<Disponibilidad[]>(obtener, [])

  const obtenerEspacios = useCallback(() => getEspacios(), [])
  const { datos: espacios } = useCarga<Espacio[]>(obtenerEspacios, [])

  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [enEdicion, setEnEdicion] = useState<Disponibilidad | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState('')
  const [eliminando, setEliminando] = useState(false)

  const ordenadas = [...disponibilidades].sort(
    (a, b) =>
      a.espacio.nombre.localeCompare(b.espacio.nombre) ||
      a.diaSemana - b.diaSemana ||
      a.horaInicio.localeCompare(b.horaInicio)
  )

  function abrirFormulario(disponibilidad: Disponibilidad | null) {
    setEnEdicion(disponibilidad)
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

  async function eliminar(disponibilidad: Disponibilidad) {
    if (eliminando) {
      return
    }

    const confirmado = window.confirm(
      `¿Querés eliminar la franja del ${diasSemana[disponibilidad.diaSemana]} de "${disponibilidad.espacio.nombre}"?`
    )

    if (!confirmado) {
      return
    }

    setEliminando(true)
    setMensaje('')
    setErrorAccion('')

    try {
      await eliminarDisponibilidad(disponibilidad.id)
      setMensaje('Disponibilidad eliminada correctamente.')
      recargar()
    } catch (fallo) {
      setErrorAccion(
        mensajeDeError(fallo, 'No pudimos eliminar la disponibilidad. Intentá nuevamente.')
      )
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section
      aria-labelledby="titulo-disponibilidades"
      className="flex flex-col gap-4"
    >
      <EncabezadoSeccion
        id="titulo-disponibilidades"
        titulo="Disponibilidades"
        descripcion="Días y horarios en los que cada espacio se puede reservar."
      >
        {!formularioAbierto && (
          <Boton onClick={() => abrirFormulario(null)}>Nueva disponibilidad</Boton>
        )}
      </EncabezadoSeccion>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}
      {errorAccion && <Alerta tipo="error">{errorAccion}</Alerta>}

      {formularioAbierto && (
        <FormularioDisponibilidad
          key={enEdicion?.id ?? 'nueva'}
          espacios={espacios}
          disponibilidad={enEdicion}
          onGuardado={alGuardar}
          onCancelar={cerrarFormulario}
        />
      )}

      <Carga estado={estado} error={error} onReintentar={recargar}>
        {ordenadas.length === 0 ? (
          <p className="text-sm text-slate-600">
            Todavía no hay disponibilidades cargadas. Sin ellas, los espacios no se
            pueden reservar.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ordenadas.map((disponibilidad) => (
              <li key={disponibilidad.id}>
                <Tarjeta className="flex h-full flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{disponibilidad.espacio.nombre}</h3>
                    <p className="text-sm text-slate-600">
                      {diasSemana[disponibilidad.diaSemana]} ·{' '}
                      {recortarHora(disponibilidad.horaInicio)} a{' '}
                      {recortarHora(disponibilidad.horaFin)}
                    </p>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Boton
                      variante="secundario"
                      disabled={eliminando}
                      onClick={() => abrirFormulario(disponibilidad)}
                    >
                      Editar
                    </Boton>
                    <Boton
                      variante="peligro"
                      disabled={eliminando}
                      onClick={() => eliminar(disponibilidad)}
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

export default GestionDisponibilidades
