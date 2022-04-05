import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from 'react-router-dom'
import useAuth from "../hooks/useAuth";
import io from 'socket.io-client'

const ProyectosContext = createContext();

let socket;

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalFormularioColaborador, setModalFormularioColaborador] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalEliminarProyecto, setModalEliminarProyecto] = useState(false)
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [ocultar, setOcultar] = useState(false)

    const navigate = useNavigate()
    const {auth} = useAuth()

    useEffect(() => {
        const obtenerProyecto = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Types" : "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/proyectos', config)
                setProyectos(data)
                setOcultar(false)
            } catch (error) {
                console.log(error)
            }
        }

        obtenerProyecto()
    }, [auth])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL) //Abrir conexion
    },[])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 2000);
    }

    const submitProyecto = async proyecto => {
      if(proyecto.id){
        await editarProyecto(proyecto)
      }else{
        await nuevoProyecto(proyecto)
      }   
    }

    const editarProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data.proyectoAlmacenado._id ? data.proyectoAlmacenado : proyectoState)

            setProyectos(proyectosActualizados)
        
            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto.id}`)
            }, 3000);


        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto =>{
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
        
            setProyectos([...proyectos, data.proyectoAlmacenado])

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);


        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios(`/proyectos/${id}`,config)
            setProyecto(data)
            setOcultar(false)
          
        } catch (error) {
            setOcultar(true)
            navigate('/proyectos')
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })  
            setTimeout(() => {
               setOcultar(false)
            }, 2000);
            
        }
        setCargando(false)
    }

    const eliminarProyecto = async id => {
       try {
        const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)

            setProyectos(proyectosActualizados)
            setModalEliminarProyecto(false)
        
            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);

       } catch (error) {
           
       }
    }

    const handleModalTarea = () =>{
        setModalFormularioTarea(!modalFormularioTarea) 
        setTarea({})
    }

    const submitTarea = async tarea =>{
        if(tarea?.id){
            await editarTarea(tarea)
          }else{
            await nuevaTarea(tarea)
          }  
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
           
            socket.emit('actualizar tarea', data)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                setModalFormularioTarea(false)
            }, 2000);



        } catch (error) {
            console.log(error)
        }
    }

    const nuevaTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

        const {data} = await clienteAxios.post('/tareas', tarea, config)

        socket.emit('nueva tarea', data)

        setAlerta({})
        setModalFormularioTarea(false)

        // SOCKET IO
        


        } catch (error) {
         console.log(error)   
        }
    }



    const eliminarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Types" : "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
    
                const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
    
                setAlerta({
                    msg: data.msg,
                    error: false
                })

                socket.emit('eliminar tarea', tarea)

                
                setModalEliminarTarea(false)
                setTarea({})
                setTimeout(() => {
                    setAlerta({})
                }, 3000);
                
               
    
           } catch (error) {
               console.log(error)
           }
    }

    const estadoTarea = async id => {

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            socket.emit('cambiar estado', data)
            setTarea({})
            setAlerta({})
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        {colaborador && setColaborador({})}
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)

            setColaborador(data)
            setAlerta({})
        } catch (error) {
           mostrarAlerta({
               msg: error.response.data.msg,
               error: true
           })
        }
        setCargando(false)
    }

    const agregarColaborador = async colaborador =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, colaborador, config)

            const proyectoActualizado = {...proyecto }
            proyectoActualizado.colaboradores = [...proyecto.colaboradores, colaborador]
            setProyecto(proyectoActualizado)

            setModalFormularioColaborador(false)
            mostrarAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const eliminarColaborador = async colaborador =>{

        try {
            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Types" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
    
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaboradores/${proyecto._id}`, {id: colaborador._id}, config)
           
            const proyectoActualizado = {...proyecto}

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState=> colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setModalEliminarColaborador(false)
            mostrarAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
        } catch (error) {
            console.log(error)
        }
       
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

   
    const handleModalEliminarTarea = tarea =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }
   
    const handleModalEliminarProyecto = proyecto =>{
        setProyecto(proyecto)
        setModalEliminarProyecto(!modalEliminarProyecto)
    }

    const handleModalColaborador = () =>{
        setModalFormularioColaborador(!modalFormularioColaborador) 
        setColaborador({})
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const handleBuscador = () =>{
        setOcultar(!ocultar)
    }



    //SOCKET IO

    const submitTareasProyecto = (tarea) => {
         //Agregar Tarea al State por medio de SOCKET

         const proyectoActualizado = {...proyecto }
         proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
         setProyecto(proyectoActualizado)
    }

    const submitEliminarTarea = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const submitActualizarTarea = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea.tareaAlmacenada._id ? tarea.tareaAlmacenada : tareaState)
        setProyecto(proyectoActualizado)
    }

    const submitActualizarEstado = tarea => {
        const proyectoActualizado = {...proyecto}      
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const logOut = () => {
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
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                handleModalEliminarProyecto,
                modalEliminarProyecto,
                eliminarTarea,
                estadoTarea,
                modalFormularioColaborador,
                handleModalColaborador,
                submitColaborador,
                colaborador,
                agregarColaborador,
                ocultar,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                handleBuscador,
                submitTareasProyecto,
                submitEliminarTarea,
                submitActualizarTarea,
                submitActualizarEstado,
                logOut
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;