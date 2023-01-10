import { Navigate, Outlet } from 'react-router-dom'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth'

const RutasProtegidas = () => {

    const { auth, cargando } = useAuth();
    if(cargando) return 'Cargando...'
    return (
        <>
            { auth._id ? (
                <div className='bg-gray-100 '>
                    <Header />
                    <div className=' lg:flex  md:flex-1 md:min-h-screen'>
                        <Sidebar />
                        <main className='p-10 flex-1'>
                            <Outlet />
                        </main>
                    </div>

                </div>
            ) : <Navigate to="/" /> }
        </>
    )
}

export default RutasProtegidas
