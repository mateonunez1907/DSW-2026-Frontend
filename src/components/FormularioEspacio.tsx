import { useState, type FormEvent } from 'react'
import type { Espacio, NuevoEspacio } from '../types/espacio'
import { actualizarEspacio, crearEspacio } from '../services/espacio.service'
import { mensajeDeError } from '../services/api'
import Alerta from './ui/Alerta'
import Boton from './ui/Boton'
import Campo from './ui/Campo'
import Tarjeta from './ui/Tarjeta'

interface FormularioEspacioProps {
  espacio: Espacio | null
  onGuardado: (mensaje: string) => void
  onCancelar: () => void
}

function FormularioEspacio({
  espacio,
  onGuardado,
  onCancelar,
}: FormularioEspacioProps) {
  const [nombre, setNombre] = useState(espacio?.nombre ?? '')
  const [tipo, setTipo] = useState(espacio?.tipo ?? '')
  const [capacidad, setCapacidad] = useState(
    espacio ? String(espacio.capacidad) : ''
  )
  const [descripcion, setDescripcion] = useState(espacio?.descripcion ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    const capacidadNumerica = Number(capacidad)

    if (!Number.isInteger(capacidadNumerica) || capacidadNumerica <= 0) {
      setError('La capacidad debe ser un número entero mayor que cero.')
      return
    }

    const datos: NuevoEspacio = {
      nombre: nombre.trim(),
      tipo: tipo.trim(),
      capacidad: capacidadNumerica,
      descripcion: descripcion.trim(),
    }

    setError('')
    setGuardando(true)

    try {
      if (espacio) {
        await actualizarEspacio(espacio.id, datos)
        onGuardado('Espacio actualizado correctamente.')
      } else {
        await crearEspacio(datos)
        onGuardado('Espacio creado correctamente.')
      }
    } catch (fallo) {
      setError(
        mensajeDeError(fallo, 'No pudimos guardar el espacio. Intentá nuevamente.')
      )
      setGuardando(false)
    }
  }

  return (
    <Tarjeta>
      <h3 className="mb-4 text-lg font-semibold">
        {espacio ? 'Editar espacio' : 'Nuevo espacio'}
      </h3>

      <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
        <Campo
          id="espacio-nombre"
          etiqueta="Nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
          disabled={guardando}
        />

        <Campo
          id="espacio-tipo"
          etiqueta="Tipo"
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value)}
          placeholder="Por ejemplo: aula"
          required
          disabled={guardando}
        />

        <Campo
          id="espacio-capacidad"
          etiqueta="Capacidad (personas)"
          type="number"
          min={1}
          step={1}
          value={capacidad}
          onChange={(evento) => setCapacidad(evento.target.value)}
          required
          disabled={guardando}
        />

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label
            htmlFor="espacio-descripcion"
            className="text-sm font-medium text-slate-700"
          >
            Descripción (opcional)
          </label>
          <textarea
            id="espacio-descripcion"
            rows={3}
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            disabled={guardando}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
          />
        </div>

        {error && (
          <div className="sm:col-span-2">
            <Alerta tipo="error">{error}</Alerta>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : espacio ? 'Guardar cambios' : 'Crear espacio'}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  )
}

export default FormularioEspacio
