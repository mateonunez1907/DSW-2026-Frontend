import { useState } from 'react'
import type { Espacio } from '../types/espacio'
import { getEspacios } from '../services/espacio.service'
import FormularioEspacio from './FormularioEspacio'

type EstadoCarga = 'inicial' | 'cargando' | 'exito' | 'error'

function GestionEspacios() {
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [estado, setEstado] = useState<EstadoCarga>('inicial')

  const [espacioSeleccionado, setEspacioSeleccionado] =
    useState<Espacio | null>(null)

  async function cargarEspacios() {
    setEstado('cargando')
    setEspacioSeleccionado(null)

    try {
      const datos = await getEspacios()
      setEspacios(datos)
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  function seleccionarEspacio(espacio: Espacio) {
    setEspacioSeleccionado(espacio)
  }

  return (
    <section aria-labelledby="titulo-espacios">
      <h2 id="titulo-espacios">Espacios</h2>
      <p>Consultá los espacios registrados en el sistema.</p>

      <FormularioEspacio onCreado={cargarEspacios} />

      <button
        type="button"
        onClick={cargarEspacios}
        disabled={estado === 'cargando'}
      >
        {estado === 'inicial' && 'Cargar espacios'}
        {estado === 'cargando' && 'Cargando...'}
        {estado === 'exito' && 'Actualizar espacios'}
        {estado === 'error' && 'Reintentar'}
      </button>

      {estado === 'cargando' && (
        <p role="status">Cargando espacios...</p>
      )}

      {estado === 'error' && (
        <p role="alert">
          No pudimos cargar los espacios. Intentá nuevamente.
        </p>
      )}

      {estado === 'exito' && espacios.length === 0 && (
        <p>No hay espacios registrados.</p>
      )}

      {estado === 'exito' && espacios.length > 0 && (
        <ul>
          {espacios.map((espacio) => (
            <li key={espacio.id}>
              <h3>{espacio.nombre}</h3>

              <p>
                <strong>Tipo:</strong> {espacio.tipo}
              </p>

              <p>
                <strong>Capacidad:</strong> {espacio.capacidad} personas
              </p>

              <button
                type="button"
                onClick={() => seleccionarEspacio(espacio)}
              >
                Ver detalle de {espacio.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}

      {espacioSeleccionado !== null && (
        <section aria-labelledby="titulo-detalle-espacio">
          <h3 id="titulo-detalle-espacio">Detalle del espacio</h3>

          <p>
            <strong>Nombre:</strong> {espacioSeleccionado.nombre}
          </p>

          <p>
            <strong>Descripción:</strong> {espacioSeleccionado.descripcion}
          </p>

          <p>
            <strong>Tipo:</strong> {espacioSeleccionado.tipo}
          </p>

          <p>
            <strong>Capacidad:</strong>{' '}
            {espacioSeleccionado.capacidad} personas
          </p>

          <button
            type="button"
            onClick={() => setEspacioSeleccionado(null)}
          >
            Cerrar detalle
          </button>
        </section>
      )}
    </section>
  )
}

export default GestionEspacios