import { useState, useEffect, createContext } from 'react'
import { useNavigate } from "react-router-dom"
import io from "socket.io-client";
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {

  const {auth} = useAuth()
  const [proyectos, setProyectos] = useState([])
  const [proyecto, setProyecto] = useState({})
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [modalFormularioTarea , setModalFormularioTarea ] = useState(false)
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea , setModalEliminarTarea ] = useState(false)
  const [modalEliminarColaborador , setModalEliminarColaborador ] = useState(false)
  const [colaborador, setcolaborador] = useState({});
  const [buscador, setBuscador] = useState(false);
  

  useEffect(() => {
    const obtenerProyectos = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const { data } = await clienteAxios('/proyectos', config)
        setProyectos(data)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    return () => { obtenerProyectos() }
  }, [auth])

  useEffect(() => {
    socket = io('https://uptask-mern-back.onrender.com/')
  }, [])

  const mostrarAlerta = alerta => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({})
    }, 3000);
  }

  const submitProyecto = async proyecto => {

    if (proyecto.id) {
      await editarProyecto(proyecto)
    } else {
      await nuevoProyecto(proyecto)
    }

  }

  const nuevoProyecto = async proyecto => {
    const token = localStorage.getItem('token')
    if (!token) return
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const { data } = await clienteAxios.post('proyectos', proyecto, config)
      setProyectos([...proyectos, data])
      setAlerta({
        msg: "Proyecto Creado Correctamente",
        error: false
      })

      //Redireccionando el usuario hacia proyectos
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 4000);
    } catch (error) {
      console.log(error);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const editarProyecto = async proyecto => {
    const token = localStorage.getItem('token')
    if (!token) return
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
      //Sincronizando el state con los datos del BE
      const proyectosActualizados = proyectos.map(proyectoMemoria => proyectoMemoria._id === data._id ? data : proyectoMemoria)
      setProyectos(proyectosActualizados);

      //Mostrar Alerta
      setAlerta({
        msg: "Proyecto Actualizado Correctamente",
        error: false
      })

      //------------------ Redireccionando el usuario hacia proyecto
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 4000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const obtenerProyecto = async id => {
    setCargando(true)
    const token = localStorage.getItem('token')
    if (!token) return

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data)
      setAlerta({})
    } catch (error) {
      navigate('/proyectos')
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout( ()=>{
        setAlerta({})
      }, 2000 )
    } finally {
      setCargando(false)
    }
  }

  const eliminarProyecto = async id => {
    console.log('ELiminando', id);

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
      //Sincronizar el State
      const proyectosActualizados = proyectos.filter( proyectoState => proyectoState._id !== id )
      setProyectos(proyectosActualizados)

      setAlerta({
        msg: data.msg,
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 4000);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalTarea = () =>{
    setModalFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  const submitTarea = async tarea =>{

    if (tarea?.id) {
      editarTarea(tarea)
    }else{
      nuevaTarea(tarea)
    }
  }

  const nuevaTarea = async tarea => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/tareas', tarea , config )
     
      setAlerta({})
      setModalFormularioTarea(false)

      //SOCKET IO
      socket.emit("nueva tarea", data)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const editarTarea = async tarea => {
    console.log('Desde editar...');
    //Hacer la funcion de editar
    try {
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
      setModalFormularioTarea(false)
      setAlerta({})
      //SOCKAT IO
      socket.emit("actualizar tarea", data)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalEditarTarea = async tarea => {
    setTarea(tarea)
    setModalFormularioTarea(true)

  }

  const handleModalEliminarTarea = tarea =>{
    setModalEliminarTarea(!modalEliminarTarea)
    setTarea(tarea)
  }

  const eliminarTarea = async () => {
    
    try {
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

    setModalEliminarTarea(false);
    //Socket io
    socket.emit("eliminar tarea",tarea)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const submitColaborador = async email =>{
    try {
      setCargando(true)
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
      setcolaborador(data);
      setAlerta({})

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    } finally{
      setCargando(false)
    }
  } 

  const agregarColaborador = async email =>{
    // console.log(email);
    try {
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const data = clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config )
      data.then ((resp)=>{
        switch (resp.data) {
          case '0':
            setAlerta({
              msg: 'El creador del proyecto no puedo ser Colaborador' ,
              error: true
            })
            break;
            case '1':
            setAlerta({
              msg: 'Este usuario ya es Colaborador en el proyecto' ,
              error: true
            })
            break;
            case '2':
            setAlerta({
              msg: 'Accion no valida' ,
              error: true
            })
            break;
            case '3':
            setAlerta({
              msg: 'Colaborador agregado Correctamente' ,
              error: false
            })
            break;
          default:
            break;
        }
      })
       //Redireccionando el usuario hacia proyectos
       setTimeout(() => {
        setAlerta({})
      }, 2000);
      setcolaborador({})
    } catch (error) {
       setAlerta({
          msg: error.response.data.msg,
          error: true
      })
      
    }
  }

  const handleModalEliminarColaborador = async colaborador => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setcolaborador(colaborador);

  }

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      const {data } = await clienteAxios.post( `/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id} , config )
            
      //Tomar un copia 
      const proyectoActualizado = { ...proyecto}
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorMemory => colaboradorMemory._id !== colaborador._id )
      setProyecto(proyectoActualizado )
      setAlerta({
        msg:data.msg,
        error: false
      })
      setcolaborador({})
      setModalEliminarColaborador(false)
      setTimeout(() => {
        setAlerta({})
      }, 4000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const completarTarea = async id => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      const {data } = await clienteAxios.post(`/tareas/estado/${id}`, {} , config );
      //SOCKET IO 
      socket.emit('cambiar estado', data)
      setTarea({})

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  //Socket io
  const submitTareasProyecto = (tarea)=>{
      //Agregar la Tarea al State
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
      setProyecto(proyectoActualizado)
  }

  const eliminarTareasProyecto = (tarea)=>{ 
    //Actualizando el State
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id  )
    setProyecto(proyectoActualizado)
  }

  const editarTareasProyecto = (tarea)=>{ 
    //Actualizando el State
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState )
    setProyecto(proyectoActualizado)
  }

  const cambiarEstadoTareas = (tarea)=>{ 
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>  tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = () =>{
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        handleModalTarea,
        modalFormularioTarea,
        submitTarea,
        tarea,
        handleModalEditarTarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        colaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareasProyecto,
        editarTareasProyecto,
        cambiarEstadoTareas,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}
export { ProyectosProvider }

export default ProyectosContext
