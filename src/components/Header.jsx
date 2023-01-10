import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import useAuth from '../hooks/useAuth'
import Busqueda from './Busqueda';

const Header = () => {
    const { handleBuscador, cerrarSesionProyectos } = useProyectos();
    const { cerrarSesionAuth } = useAuth();

    const cerrarSesion = () =>{
        cerrarSesionAuth()
        cerrarSesionProyectos()
        localStorage.removeItem('token')
    }
    return (
        <header className='px-4 py-5 bg-white border-b'>
            <div className='md:flex md:justify-between'>
                <h1 className='text-4xl text-indigo-600 font-black text-center mb-5 md:mb-0'> UpTask </h1>

                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <button
                        className='font-bold uppercase'
                        type='button'
                        onClick={handleBuscador}
                    >Buscar Poryectos
                    </button>

                    <Link className='font-bold uppercase' to='/proyectos'>
                        Proyectos
                    </Link>

                    <button
                        className='text-white text-sm bg-sky-600 p-2 rounded-md uppercase font-bold'
                        type='button'
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesion
                    </button>
                    <Busqueda />
                </div>
            </div>
        </header>
    )
}

export default Header
