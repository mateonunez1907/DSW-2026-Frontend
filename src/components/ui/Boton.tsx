import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro'

const estilosPorVariante: Record<Variante, string> = {
  primario: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secundario: 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
}

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
}

function Boton({
  variante = 'primario',
  type = 'button',
  className = '',
  ...resto
}: BotonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 ${estilosPorVariante[variante]} ${className}`}
      {...resto}
    />
  )
}

export default Boton
