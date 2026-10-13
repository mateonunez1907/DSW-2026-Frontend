import { useState } from 'react'
import type { NuevoEspacio } from '../types/espacio'
import { crearEspacio } from '../services/espacio.service'

interface FormularioEspacioProps {
  onCreado: () => void
}

function FormularioEspacio({ onCreado }: FormularioEspacioProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [capacidad, setCapacidad] = useState('')
  const [tipo, setTipo] = useState('')

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function guardarEspacio() {
    if (guardando) {
      return
    }

    setError('')
    setMensaje('')

    const datos: NuevoEspacio = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      capacidad: Number(capacidad),
      tipo: tipo.trim(),
    }

    if (
      !datos.nombre ||
      !datos.descripcion ||
      !datos.tipo ||
      capacidad.trim() === ''
    ) {
      setError('Completá todos los campos.')
      return
    }

    if (!Number.isInteger(datos.capacidad) || datos.capacidad <= 0) {
      setError('La capacidad debe ser un número entero mayor que cero.')
      return
    }

    setGuardando(true)

    try {
      await crearEspacio(datos)

      setNombre('')
      setDescripcion('')
      setCapacidad('')
      setTipo('')

      setMensaje('Espacio creado correctamente.')
      onCreado()
    } catch {
      setError('No pudimos crear el espacio. Intentá nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby="titulo-formulario-espacio">
      <h3 id="titulo-formulario-espacio">Crear espacio</h3>

      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          guardarEspacio()
        }}
      >
        <fieldset disabled={guardando}>
          <legend>Datos del espacio</legend>

          <div>
            <label htmlFor="espacio-nombre">Nombre</label>
            <input
              id="espacio-nombre"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="espacio-descripcion">Descripción</label>
            <textarea
              id="espacio-descripcion"
              value={descripcion}
              onChange={(evento) => setDescripcion(evento.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="espacio-capacidad">
              Capacidad de personas
            </label>
            <input
              id="espacio-capacidad"
              type="number"
              min={1}
              step={1}
              value={capacidad}
              onChange={(evento) => setCapacidad(evento.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="espacio-tipo">Tipo</label>
            <input
              id="espacio-tipo"
              type="text"
              value={tipo}
              onChange={(evento) => setTipo(evento.target.value)}
              placeholder="Por ejemplo: aula"
              required
            />
          </div>

          <button type="submit">
            {guardando ? 'Guardando...' : 'Crear espacio'}
          </button>
        </fieldset>
      </form>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}
    </section>
  )
}

export default FormularioEspacio