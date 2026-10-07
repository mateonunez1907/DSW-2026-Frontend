import './App.css'
import type { Usuario } from './types/usuario'
import { useState } from 'react'
import { getUsuario } from './services/usuario.service.ts'


type EstadoCarga = 'inicial' | 'cargando' | 'error' | 'exito'

function App() {
  const [usuarios, setUsuarios] = useState <Usuario[]> ([])
  const [estado, setEstado] = useState<EstadoCarga>('inicial')

  async function cargarUsuarios(){
    setEstado('cargando')

    try {
      const datos = await getUsuario()
      setUsuarios(datos)
      setEstado('exito')
    } catch {
      setEstado('error')
    }
  }

  return (
    <main className="app">
      <h1>Sistema de reservas de espacios</h1>

      <section aria-labelledby='titulo-usuario'>
        <h2 id= 'titulo-usuarios' >Usuarios</h2>
        <p>Consultá los usuarios registrados en el sistema</p>

        <button 
          type="button"
          onClick = {cargarUsuarios}
          disabled = {estado ==='cargando'}
          >
          {estado === 'inicial' && 'Cargar usuarios'}
          {estado === 'cargando' && 'Cargando...'}
          {estado === 'exito' && 'Reintentar'}
          {estado === 'error' && 'Reintentar'}
        </button>

        {estado === 'cargando' && (
          <p role = "status">
            Cargando usuarios...
          </p>
        )}

        {estado === 'error' && (
          <p role="alert">
            No pudimos cargar los usuarios. No podemos acceder a los datos. Intente nuevamente.
          </p>
        )}

        {estado === 'exito' && usuarios.length === 0 && (
          <p role="alert">
            No hay usuarios registrados.
          </p>
        )}

        {estado === 'exito' && usuarios.length > 0 && (
          <ul>
            {usuarios.map((usuario)=>(
                <li key = {usuario.id}> 

                  <h3>
                    {usuario.nombre} {usuario.apellido}
                  </h3>
                  <p> 
                    {usuario.email} 
                    <br />
                    {usuario.id}</p> //Eliminar id, solo para pruebas...
                </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
