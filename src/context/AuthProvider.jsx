import {useState, createContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ( {children}) =>{

    const [ auth, setAuth ] = useState({})
    const [ cargando, setCargando ] = useState(true)
    const navigate = useNavigate();

    useEffect( () =>{
        const autentificarUsuario = async ()=>{
            const token = localStorage.getItem('token')
            if (!token) {
                setCargando(false)
                return
            }
            //Configuracion para mander el Bearer que necesita el BE para autenticar al usuario
            const config ={
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                navigate('/proyectos')
                setAuth(data);
            } catch (error) {
                setAuth({})
            }finally{
                setCargando(false)
            }

        }
        return () => { autentificarUsuario() };
    }, [])


    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;