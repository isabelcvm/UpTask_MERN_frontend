import { useState } from 'react'
import { Link } from "react-router-dom"
import Alerta from '../components/Alerta';
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return
    }

    if (password !== repetirPassword) {
      setAlerta({
        msg: 'La contrasena no coincide',
        error: true
      })
      return
    }

    if (password.length < 6) {
      setAlerta({
        msg: 'La contrasena es muy corta, agrega mínimo 6 carácteres',
        error: true
      })
      return
    } 

    setAlerta({});

    //Crear el usuario en Backend
    try {
      const {data} = await clienteAxios.post( `/usuarios`, {nombre, email, password})
      setAlerta({
        msg: data.msg,
        error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
    } catch (error) {
      console.log(error.response)
      setAlerta({
        msg: error.response.data.msg,
        error:true
      })
    }

    console.log('creando...');

  }
  const {msg} = alerta

  return (
    <>
      <h1 className="text-indigo-600 font-black text-5xl center"> Crea tu cuenta y Administrar tus <span className="text-slate-700">proyectos</span>  </h1>

      {msg  && <Alerta alerta={alerta} /> }

      <form className="my-10 bg-white shadow rounded-md p-7" onSubmit={handleSubmit}>
      <div className="mt-5">
          <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
          <input
            type="name"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            id="nombre"
            value={ nombre }
            onChange={ e => setNombre(e.target.value) }
          />
        </div>

        <div className="mt-5">
          <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
          <input
            type="email"
            placeholder="Tu email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            id="email"
            value={ email }
            onChange={ e => setEmail(e.target.value) }
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
          <input
            type="password"
            placeholder="Tu password "
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            id="password"
            value={ password }
            onChange={ e => setPassword(e.target.value) }
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">Repetir tu password</label>
          <input
            type="password"
            placeholder="Repetir tu password "
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            id="password2"
            value={ repetirPassword }
            onChange={ e => setRepetirPassword(e.target.value) }
          />
        </div>

        <input type="submit" value="Crear Cuenta" className=" bg-sky-700 w-full uppercase text-white py-3 mt-5 mb-5 font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors " />
      </form>

      <nav className="lg:flex lg:justify-between">
      <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/"
        > ¿Ya tienes cuenta? Inicia Sesión</Link>

        <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/olvide-password"
        > Olvide mi Password</Link>
      </nav>

    </>
  )
}

export default Registrar