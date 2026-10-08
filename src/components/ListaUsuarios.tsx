import type { Usuario } from '../types/usuario'

interface ListaUsuariosProps {
  usuarios: Usuario[]
  onSeleccionar: (usuario: Usuario) => void
}

function ListaUsuarios ({ usuarios, onSeleccionar}: ListaUsuariosProps) {
  return(
    <ul>
      {usuarios.map((usuario) =>(
        <li key={usuario.id}> 
          <h3> 
            {usuario.nombre} {usuario.apellido}
          </h3>
            <p>{usuario.email}</p>
          
          <button type="button" onClick={() => onSeleccionar(usuario)}>
            Ver detalle de {usuario.nombre}
          </button>

        </li>
      ))}
    </ul>
  )
}

export default ListaUsuarios