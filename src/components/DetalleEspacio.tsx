import type { Espacio } from '../types/espacio'
import Boton from './ui/Boton'

interface DetalleEspacioProps {
  espacio: Espacio
  onCerrar: () => void
}

function DetalleEspacio({
  espacio,
  onCerrar,
}: DetalleEspacioProps) {
  return (
    <section
      aria-label="Detalle del espacio"
      className="border-t border-slate-200 pt-4"
    >
      <h4 className="font-semibold">Detalle del espacio</h4>

      <dl className="mt-3 grid gap-3 text-sm">
        <div>
          <dt className="font-medium">Nombre</dt>
          <dd>{espacio.nombre}</dd>
        </div>

        <div>
          <dt className="font-medium">Tipo</dt>
          <dd>{espacio.tipo}</dd>
        </div>

        <div>
          <dt className="font-medium">Capacidad</dt>
          <dd>{espacio.capacidad} personas</dd>
        </div>

        <div>
          <dt className="font-medium">Descripción</dt>
          <dd>{espacio.descripcion || 'Sin descripción'}</dd>
        </div>
      </dl>

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