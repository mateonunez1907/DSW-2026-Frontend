import { useCallback } from 'react'
import type { Espacio } from '../types/espacio'
import type { Disponibilidad } from '../types/disponibilidad'
import { getEspacio } from '../services/espacio.service'
import { getDisponibilidades } from '../services/disponibilidad.service'
import { useCarga } from '../hooks/useCarga'
import { diasSemana, recortarHora } from '../utils/horarios'
import Boton from './ui/Boton'
import Carga from './ui/Carga'

interface DetalleEspacioProps {
  espacio: Espacio
  onCerrar: () => void
}

interface DatosDetalle {
  espacio: Espacio
  disponibilidades: Disponibilidad[]
}

function DetalleEspacio({ espacio, onCerrar }: DetalleEspacioProps) {
  const obtener = useCallback(async () => {
    const detalle = await getEspacio(espacio.id)
    const disponibilidades = await getDisponibilidades()

    return {
      espacio: detalle,
      disponibilidades: disponibilidades.filter(
        (franja) => franja.espacio.id === espacio.id
      ),
    }
  }, [espacio.id])

  const {
    datos,
    estado,
    error,
    recargar,
  } = useCarga<DatosDetalle | null>(obtener, null)

  return (
    <section
      aria-label="Detalle del espacio"
      className="border-t border-slate-200 pt-4"
    >
      <h4 className="font-semibold">Detalle del espacio</h4>

      <Carga estado={estado} error={error} onReintentar={recargar}>
        {datos && (
          <>
            <dl className="mt-3 grid gap-3 text-sm">
              <div>
                <dt className="font-medium">Nombre</dt>
                <dd>{datos.espacio.nombre}</dd>
              </div>

              <div>
                <dt className="font-medium">Tipo</dt>
                <dd>{datos.espacio.tipo}</dd>
              </div>

              <div>
                <dt className="font-medium">Capacidad</dt>
                <dd>{datos.espacio.capacidad} personas</dd>
              </div>

              <div>
                <dt className="font-medium">Descripción</dt>
                <dd>{datos.espacio.descripcion || 'Sin descripción'}</dd>
              </div>
            </dl>

            <div className="mt-4 text-sm">
              <h5 className="font-medium">Horarios semanales</h5>

              {datos.disponibilidades.length === 0 ? (
                <p className="mt-2 text-slate-600">
                  Este espacio no tiene horarios configurados.
                </p>
              ) : (
                <ul className="mt-2 grid gap-1 text-slate-600">
                  {datos.disponibilidades.map((franja) => (
                    <li key={franja.id}>
                      {diasSemana[franja.diaSemana]}: de{' '}
                      {recortarHora(franja.horaInicio)} a{' '}
                      {recortarHora(franja.horaFin)}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-slate-500">
                Para saber si está libre en una fecha y horario concretos,
                utilizá la búsqueda de disponibilidad.
              </p>
            </div>
          </>
        )}
      </Carga>

      <Boton
        variante="secundario"
        className="mt-3"
        onClick={onCerrar}
      >
        Cerrar detalle
      </Boton>
    </section>
  )
}

export default DetalleEspacio