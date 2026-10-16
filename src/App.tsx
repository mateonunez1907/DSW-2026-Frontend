import { useState } from 'react'
import GestionDisponibilidades from './components/GestionDisponibilidades'
import GestionEspacios from './components/GestionEspacios'
import GestionReservas from './components/GestionReservas'
import GestionUsuarios from './components/GestionUsuarios'

const secciones = [
  { id: 'reservas', titulo: 'Reservas' },
  { id: 'espacios', titulo: 'Espacios' },
  { id: 'disponibilidades', titulo: 'Disponibilidades' },
  { id: 'usuarios', titulo: 'Usuarios' },
] as const

type SeccionId = (typeof secciones)[number]['id']

function App() {
  const [seccionActiva, setSeccionActiva] = useState<SeccionId>('reservas')

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="py-4 text-xl font-bold text-indigo-700 sm:text-2xl md:text-3xl">
            Reserva de espacios
          </h1>

          <nav aria-label="Secciones">
            <ul className="-mb-px flex gap-1 overflow-x-auto">
              {secciones.map((seccion) => {
                const activa = seccion.id === seccionActiva

                return (
                  <li key={seccion.id}>
                    <button
                      type="button"
                      aria-current={activa ? 'page' : undefined}
                      onClick={() => setSeccionActiva(seccion.id)}
                      className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition sm:px-4 ${
                        activa
                          ? 'border-indigo-600 text-indigo-700'
                          : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {seccion.titulo}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {seccionActiva === 'reservas' && <GestionReservas />}
        {seccionActiva === 'espacios' && <GestionEspacios />}
        {seccionActiva === 'disponibilidades' && <GestionDisponibilidades />}
        {seccionActiva === 'usuarios' && <GestionUsuarios />}
      </main>
    </div>
  )
}

export default App
