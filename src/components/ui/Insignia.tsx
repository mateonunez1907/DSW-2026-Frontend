const estilosPorTexto: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  cancelada: 'bg-slate-200 text-slate-700',
}

interface InsigniaProps {
  texto: string
}

function Insignia({ texto }: InsigniaProps) {
  const estilo = estilosPorTexto[texto] ?? 'bg-indigo-100 text-indigo-800'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estilo}`}
    >
      {texto}
    </span>
  )
}

export default Insignia
