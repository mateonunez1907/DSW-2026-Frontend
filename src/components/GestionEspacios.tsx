import { useState } from 'react'
import type { Espacio } from '../types/espacio'
import { getEspacios } from '../services/espacio.service'

type EstadoCarga = 'inicial' | 'cargando' | 'exito' | 'error'

function GestionEspacios() {

  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [estado, setEstado] = useState<EstadoCarga>('inicial')
  
  async function cargarEspacios(){
    setEstado('cargando')

    try{
      const datos = await getEspacios()
      setEspacios(datos)
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  return(
    <section aria-labelledby='titulo-espacios'>
      <h2 id="titulo-espacios">Espacios</h2>
      <p>Consultá los espacios registrados en el sistema.</p>

        <button
          type = "button"
          onClick = {cargarEspacios}
          disabled = {estado ==='cargando'}
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
          <p role="status">Reintentar</p>
        )}

        {estado === 'exito' && espacios.length === 0 && (
          <p role="status">No hay espacios registrados.</p>
        )}

        {estado === 'exito' && espacios.length > 0 && (
          <ul>
            {espacios.map((espacio) => (
              <li key={espacio.id}>
                <h3>{espacio.nombre}</h3>
                <p>
                  <strong>Tipo:</strong> {espacio.tipo}
                </p>
                  <strong>Capacidad:</strong> {espacio.capacidad} personas
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}

export default GestionEspacios