import type { ReactNode } from 'react'

interface TarjetaProps {
  children: ReactNode
  className?: string
}

function Tarjeta({ children, className = '' }: TarjetaProps) {
  return (
    <div
      className={`rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export default Tarjeta
