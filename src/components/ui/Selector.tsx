import type { SelectHTMLAttributes } from 'react'

interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  etiqueta: string
}

function Selector({
  id,
  etiqueta,
  className = '',
  children,
  ...resto
}: SelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {etiqueta}
      </label>
      <select
        id={id}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 ${className}`}
        {...resto}
      >
        {children}
      </select>
    </div>
  )
}

export default Selector
