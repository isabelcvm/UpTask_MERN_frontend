import {useEffect} from 'react'
import io from "socket.io-client";
import useProyectos from '../hooks/useProyectos'
import PreviewProyecto from './PreviewProyecto';
import Alerta from "../components/Alerta";

let socket;
const Proyectos = () => {
  const { proyectos, alerta } = useProyectos();


  return (
    <>
      <h1 className='text-4xl font-black'> Proyectos </h1>
      {alerta.msg && <Alerta alerta={alerta} />}
      <div className='bg-white shadow mt-10 rounded-md '>
        {proyectos.length ? 
          proyectos.map( proyecto=>( 
              <PreviewProyecto 
                proyecto={proyecto} 
                key={proyecto._id}
              /> 
          ) )
        : <p className='text-gray-700 uppercase font-bold center p-5'>no hay probyecto</p> }
      </div>
    </>
  )
}

export default Proyectos
