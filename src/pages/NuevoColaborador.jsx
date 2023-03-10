import {useEffect} from 'react'
import FormularioColaborador from '../components/FormularioColaborador'
import { useParams, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';
import Alerta from '../components/Alerta';
import Loading from '../components/Loading';

const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, colaborador, cargando, agregarColaborador, alerta } = useProyectos();
    const params = useParams();

    useEffect( () => {
        obtenerProyecto(params.id)
    }, []);

  if (!proyecto?._id) return <Alerta alerta={alerta} /> 
  return (
    <>
        <h1 className='text-4xl font-black '> Añadir Colaborador(a) al Proyecto: {proyecto.nombre}</h1>
        <div className='mt-10 flex justify-center'>
            <FormularioColaborador />
        </div>

      { cargando ? <p className='text-center'> <Loading /> </p> : colaborador?._id && (
        <div className='flex justify-center mt-5'>
          <div className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'>
            <h2 className='text-center mb-5 text-2xl font-bold '>Resultado:</h2>
            <div className='flex justify-between items-center'>
              <p> {colaborador.nombre} </p>

              <button
                type='button'
                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-md'
                onClick={ ()=> agregarColaborador({email: colaborador.email}) }
              >Agregar al Proyecto
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default NuevoColaborador
