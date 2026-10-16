import type { NuevoUsuario, Usuario } from '../types/usuario'
import { solicitar } from './api'

export function getUsuarios(): Promise<Usuario[]> {
  return solicitar<Usuario[]>('/api/usuarios')
}

export function crearUsuario(datos: NuevoUsuario): Promise<Usuario> {
  return solicitar<Usuario>('/api/usuarios', { metodo: 'POST', cuerpo: datos })
}

export function actualizarUsuario(
  id: number,
  datos: NuevoUsuario
): Promise<Usuario> {
  return solicitar<Usuario>(`/api/usuarios/${id}`, {
    metodo: 'PUT',
    cuerpo: datos,
  })
}

export function eliminarUsuario(id: number): Promise<void> {
  return solicitar(`/api/usuarios/${id}`, { metodo: 'DELETE' })
}
