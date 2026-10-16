import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '../services/api'

export type EstadoCarga = 'cargando' | 'exito' | 'error'

export function useCarga<T>(obtener: () => Promise<T>, inicial: T) {
  const [datos, setDatos] = useState<T>(inicial)
  const [estado, setEstado] = useState<EstadoCarga>('cargando')
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true

    obtener()
      .then((resultado) => {
        if (vigente) {
          setDatos(resultado)
          setError('')
          setEstado('exito')
        }
      })
      .catch((fallo: unknown) => {
        if (vigente) {
          setError(
            mensajeDeError(fallo, 'No pudimos cargar los datos. Intentá nuevamente.')
          )
          setEstado('error')
        }
      })

    return () => {
      vigente = false
    }
  }, [obtener, intento])

  const recargar = useCallback(() => {
    setEstado('cargando')
    setIntento((anterior) => anterior + 1)
  }, [])

  return { datos, estado, error, recargar }
}
