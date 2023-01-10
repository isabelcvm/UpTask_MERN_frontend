import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const NuevoPassword = () => {

  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido] = useState(false)
  const [passwordModificado, setPasswordModificado] = useState(false)
  const [password, setPassword] = useState('');
  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    return () => { comprobarToken() };
  }, [])

  const handleSubmit = async e => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: 'La contrasena debe tener minimo 6 caracteres',
        error: true
      })
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}` , { password })
      setAlerta({
        msg: data.msg,
        error: false
      });
      setPasswordModificado(true)

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }


  return (
    <>
      <h1 className="text-indigo-600 font-black text-5xl center"> Reestablece tu password y no pierdas acceso a tus <span className="text-slate-700">Proyectos</span>  </h1>

      {alerta.msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form className="my-10 bg-white shadow rounded-md p-7" onSubmit={handleSubmit} >
          <div className="mt-4">
            <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
            <input
              type="password"
              placeholder="Escribe tu nuevo password "
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <input type="submit" value="Guardar nueva password" className=" bg-sky-700 w-full uppercase text-white py-3 mt-5 mb-5 font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors " />

          {passwordModificado && (
            <Link
              className="block text-center my-5 text-slate-500 uppercase text-sm"
              to="/"
            > Iniciar Sesión</Link>
          )}
        </form>


      )}



    </>
  )
}

export default NuevoPassword