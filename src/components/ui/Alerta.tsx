import type { ReactNode } from 'react'

type Tipo = 'error' | 'exito' | 'info'

const estilosPorTipo: Record<Tipo, string> = {
  error: 'bg-red-50 text-red-800 ring-red-200',
  exito: 'bg-green-50 text-green-800 ring-green-200',
  info: 'bg-blue-50 text-blue-800 ring-blue-200',
}

interface AlertaProps {
  tipo?: Tipo
  children: ReactNode
}

function Alerta({ tipo = 'info', children }: AlertaProps) {
  return (
    <p
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`rounded-md px-3 py-2 text-sm ring-1 ${estilosPorTipo[tipo]}`}
    >
      {children}
    </p>
  )
}

export default Alerta
