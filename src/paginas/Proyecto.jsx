import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import Cargando from "../components/Cargando";
import io from 'socket.io-client'

import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import ModalFormularioColaborador from "../components/ModalFormularioColaborador";

import Tarea from "../components/Tarea";
import Alerta from "../components/Alerta";
import Colaborador from "./Colaborador";


let socket;

const Proyecto = () => {
  const params = useParams();
  const { 
    obtenerProyecto, 
    proyecto, 
    cargando, 
    handleModalTarea, 
    handleModalColaborador, 
    ocultar, 
    submitTareasProyecto, 
    submitEliminarTarea,
    submitActualizarTarea,
    submitActualizarEstado
  } = useProyectos();

  const admin = useAdmin()

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

   useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', params.id)
   },[])

   useEffect(()=>{
     socket.on('tarea agregada', tareaNueva =>{
       if(tareaNueva.proyecto === proyecto._id){
          submitTareasProyecto(tareaNueva)
       } 
    })

     socket.on('tarea eliminada', tareaEliminada =>{
      if(tareaEliminada.proyecto === proyecto._id){
       submitEliminarTarea(tareaEliminada)
      }
    })

     socket.on('tarea actualizada', tareaActualizada =>{
      if(tareaActualizada.tareaAlmacenada.proyecto._id === proyecto._id){
        submitActualizarTarea(tareaActualizada)
      }
    })

    socket.on('nuevo estado', nuevoEstadoTarea => {
      if(nuevoEstadoTarea.proyecto._id === proyecto._id){
        submitActualizarEstado(nuevoEstadoTarea)
      }
    })

   })
  

  const { nombre, colaboradores } = proyecto;
  if (cargando) return <Cargando />;
  return (
    <>
      {!ocultar && (
        <>
            <div className=" flex justify-between">
            <h1 className=" font-black text-4xl">{nombre}</h1>
            {admin && (
            <div>
              <Link
                to={`/proyectos/editar/${params.id}`}
                className=" flex items-center gap-2 text-gray-400 hover:text-sky-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </Link>
            </div>
            )}
          </div>
          {admin && (
          <button
            onClick={handleModalTarea}
            type="button"
            className="text-sm mt-5 px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-600 hover:bg-sky-700 transition-colors text-white text-center flex gap-2 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Nueva Tarea
          </button>
          )}
    
          <p className=" font-bold text-xl mt-10"> Tareas del Proyecto</p>
          {proyecto.tareas?.length ?  <p className=" font-bold text-sm mt-2"> Actualmente hay {proyecto.tareas?.length} {' '} tareas</p> : null}
          
        {proyecto.tareas?.length ? 
      
          <div className=" bg-white shadow-lg mt-10 rounded-lg">
              {
                proyecto.tareas?.map( tarea => (
                <Tarea
                  key={tarea._id}
                  tarea={tarea}
                />
              ))}
          </div>
            : 
          <p className="bg-white shadow mt-10 rounded-lg font-bold uppercase text-center my-5 p-10">No hay tareas en este proyecto</p>
      }
       {admin && (
              
              <>
              <div className=" flex items-center justify-between mt-20">
                <p className=" font-bold text-xl">Colaboradores</p>
                <button
                className=" bg-indigo-600 hover:bg-indigo-800 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                onClick={() => handleModalColaborador()}
                >
                    Agregar
                </button>
              </div>  

            
                
              {proyecto.colaboradores?.length ?  
          
              <div className=" bg-white shadow mt-10 rounded-lg font-bold uppercase p-10">
                      {
                        colaboradores?.map( colaborador => (
                        <Colaborador
                        key={colaborador._id}
                        colaborador={colaborador}
                        />

                      ))}
                  </div>   :

                  <p className="bg-white shadow mt-10 rounded-lg font-bold uppercase text-center my-5 p-10">No hay colaboradores en este proyecto</p>
                  
                }
                </>
        )}

        </>
      ) }
      <ModalEliminarColaborador/>
      <ModalFormularioColaborador/>
      <ModalFormularioTarea/>
      <ModalEliminarTarea/>
    </>
  );
};

export default Proyecto;
