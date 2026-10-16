import type { ReactNode } from 'react'

interface EncabezadoSeccionProps {
  id: string
  titulo: string
  descripcion: string
  children?: ReactNode
}

function EncabezadoSeccion({
  id,
  titulo,
  descripcion,
  children,
}: EncabezadoSeccionProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 id={id} className="text-lg font-semibold">
          {titulo}
        </h2>
        <p className="text-sm text-slate-600">{descripcion}</p>
      </div>
      {children}
    </div>
  )
}

export default EncabezadoSeccion
