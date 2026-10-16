import type { ReactNode } from 'react'
import type { EstadoCarga } from '../../hooks/useCarga'
import Alerta from './Alerta'
import Boton from './Boton'

interface CargaProps {
  estado: EstadoCarga
  error: string
  onReintentar: () => void
  children: ReactNode
}

function Carga({ estado, error, onReintentar, children }: CargaProps) {
  if (estado === 'cargando') {
    return (
      <p role="status" className="text-sm text-slate-500">
        Cargando…
      </p>
    )
  }

  if (estado === 'error') {
    return (
      <div className="flex flex-col items-start gap-2">
        <Alerta tipo="error">{error}</Alerta>
        <Boton variante="secundario" onClick={onReintentar}>
          Reintentar
        </Boton>
      </div>
    )
  }

  return <>{children}</>
}

export default Carga
