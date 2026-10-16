export interface Rol {
  id: number
  nombre: string
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol?: Rol
}

export interface NuevoUsuario {
  nombre: string
  apellido: string
  email: string
}
