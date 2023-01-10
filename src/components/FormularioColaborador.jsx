import {useState} from 'react'
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';


const FormularioColaborador = () => {

    const [email, setEmail] = useState('')
    const { mostrarAlerta, alerta, submitColaborador } = useProyectos();

    const handleSubmit = e =>{
        e.preventDefault();

        if (email === '') {
            mostrarAlerta({
                msg: 'El email es Obligatorio',
                error: true
            })
            return
        }
        submitColaborador(email)
    }

    return (
        <form action="" className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit} >
            {alerta.msg && <Alerta alerta={alerta} /> }
            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm '
                    htmlFor='email'

                >Email Coladorador </label>
                <input
                    type="email"
                    id="email"
                    placeholder='Email del colaborador'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                </div>
                <input type="submit" value='Buscar Colaborador' className='p-3 bg-sky-600 w-full uppercase font-bold cursor-pointer text-white transtion-colors rounded hover:bg-sky-800' />
        </form>
    )
}

export default FormularioColaborador
