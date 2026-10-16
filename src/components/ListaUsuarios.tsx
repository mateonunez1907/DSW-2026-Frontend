import type { Usuario } from '../types/usuario'
import Boton from './ui/Boton'
import Insignia from './ui/Insignia'
import Tarjeta from './ui/Tarjeta'

interface ListaUsuariosProps {
  usuarios: Usuario[]
  deshabilitado: boolean
  onEditar: (usuario: Usuario) => void
  onEliminar: (usuario: Usuario) => void
}

function ListaUsuarios({
  usuarios,
  deshabilitado,
  onEditar,
  onEliminar,
}: ListaUsuariosProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {usuarios.map((usuario) => (
        <li key={usuario.id}>
          <Tarjeta className="flex h-full flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">
                {usuario.nombre} {usuario.apellido}
              </h3>
              <p className="break-all text-sm text-slate-600">{usuario.email}</p>
              {usuario.rol && <Insignia texto={usuario.rol.nombre} />}
            </div>

            <div className="mt-auto flex gap-2">
              <Boton
                variante="secundario"
                disabled={deshabilitado}
                onClick={() => onEditar(usuario)}
              >
                Editar
              </Boton>
              <Boton
                variante="peligro"
                disabled={deshabilitado}
                onClick={() => onEliminar(usuario)}
              >
                Eliminar
              </Boton>
            </div>
          </Tarjeta>
        </li>
      ))}
    </ul>
  )
}

export default ListaUsuarios
