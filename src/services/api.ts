type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface Opciones {
  metodo?: Metodo
  cuerpo?: unknown
}

export function mensajeDeError(error: unknown, mensajePorDefecto: string): string {
  return error instanceof Error ? error.message : mensajePorDefecto
}

export async function solicitar<T = void>(
  url: string,
  { metodo = 'GET', cuerpo }: Opciones = {}
): Promise<T> {
  const tieneCuerpo = cuerpo !== undefined

  let respuesta: Response

  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: tieneCuerpo ? { 'Content-Type': 'application/json' } : undefined,
      body: tieneCuerpo ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error(
      'No pudimos conectar con el servidor. Verificá que esté en funcionamiento.'
    )
  }

  const contenido: { data?: T; message?: string } | null = await respuesta
    .json()
    .catch(() => null)

  if (!respuesta.ok) {
    throw new Error(
      contenido?.message ??
        (respuesta.status >= 500
          ? 'El servidor no está disponible en este momento.'
          : 'No se pudo completar la operación. Intentá nuevamente.')
    )
  }

  return contenido?.data as T
}
