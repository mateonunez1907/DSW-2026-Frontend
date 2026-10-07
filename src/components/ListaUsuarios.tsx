import type { Usuario } from '../types/usuario'

interface ListaUsuariosProps {
  usuarios: Usuario[]
}

function ListaUsuarios ({ usuarios }: ListaUsuariosProps) {
  return(
    <ul>
      {usuarios.map((usuario) =>(
        <li key={usuario.id}> 
          <h3> 
            {usuario.nombre} {usuario.apellido}
          </h3>
            <p>{usuario.email}</p>
        </li>
      ))}
    </ul>
  )
}

export default ListaUsuarios