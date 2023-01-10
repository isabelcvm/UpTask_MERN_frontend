import {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from "../config/clienteAxios";
import Alerta from '../components/Alerta';


const ConfirmarCuenta = () => {
  const params = useParams();
  const {id} = params;
  const [ alerta, setAlerta] = useState({})
  const [ cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useEffect(() => {
    const confirmarCuenta = async () =>{
      try {
       
        const {data} = await clienteAxios.get(`/usuarios/confirmar/${id}`)
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    
    return () => {confirmarCuenta()};
  }, [])
  


  return (
    <>
      <h1 className="text-indigo-600 font-black text-5xl center"> Confirma tu cuenta y Comienza a crear tus <span className="text-slate-700">proyectos</span>  </h1>
      <div className='mt-20 md:mt-10 shadow-md px-5 py-10 rounded-xl bg-white'>
        {alerta.msg && <Alerta alerta={alerta} />}

        { cuentaConfirmada && (
          <Link 
            className="block text-center my-5 text-slate-500 uppercase text-sm" 
            to="/"
        > Iniciar Sesión</Link>
        ) }
      </div>
    </>
  )
}

export default ConfirmarCuenta