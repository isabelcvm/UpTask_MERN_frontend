import {useState, useContext,} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';


const Login = () => {

//  const { email, setEmail, password, setPassword } = useLogin()

  const navigate = useNavigate();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ alerta, setAlerta ] = useState({});
  const { setAuth } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();

    if( [email, password].includes('') ){
      setAlerta({
        msg: 'Todos los campos son Obligatorios',
        error: true 
      })
      return
    }

      try {
        const {data} = await clienteAxios.post('/usuarios/login', {email, password})
        setAlerta({});
        localStorage.setItem('token', data.token);
        setAuth(data);
        navigate('/proyectos')
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true 
        })
        console.log(error)
      }   
  }
  
  return (  
    <>
      <h1 className="text-indigo-600 font-black text-5xl center"> Inicia Sesión y Administra tus <span className="text-slate-700">proyectos</span>  </h1>

        {alerta.msg && <Alerta alerta={alerta} />}

      <form className="my-10 bg-white shadow rounded-md p-7" onSubmit={handleSubmit}>
        <div className="mt-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input 
              type="email" 
              placeholder="Email de Registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              id="email"
              value={email}
              onChange={ e => setEmail(e.target.value) }
            />
          </div>
          <div className="mt-4">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
          <input 
              type="password" 
              placeholder="Password de Registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              id="password"
              value={password}
              onChange={ e => setPassword(e.target.value) }
            />
        </div>

        <input type="submit" value="Iniciar Sesión" className=" bg-sky-700 w-full uppercase text-white py-3 mt-5 mb-5 font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors " />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/registrar"
        > ¿No tienes cuenta? Regístrate ahora</Link>

        <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/olvide-password"
        > Olvide mi Password</Link>
      </nav>

    </>
  )
}

export default Login