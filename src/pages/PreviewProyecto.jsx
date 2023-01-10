import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


const PreviewProyecto = ({ proyecto }) => {
  const { auth } = useAuth();
  const { nombre, cliente, _id, creador } = proyecto

  return (
    <div className='border-b p-5 flex justify-between flex-col md:flex-row'>
      <div className='flex items-start gap-2 flex-col md:flex-row'>
        <p className='flex-1'>
          {nombre}
          <span className='text-sm text-gray-500 uppercase '> {''} {cliente}  </span>
        </p>
        {auth._id !== creador && (

          <p className='p-2 text-xs uppercase rounded-lg bg-green-600 text-white font-bold'>Colaborador</p>
        )}
      </div>

      <Link
        to={`${_id}`}
        className='text-gray-600 hover:text-gray-800 uppercase text-sm font-bold mt-3 md:mt-0'
      > Ver Proyecto
      </Link>
    </div>
  )
}

export default PreviewProyecto
