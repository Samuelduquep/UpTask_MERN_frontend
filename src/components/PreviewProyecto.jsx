import { Link, useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const PreviewProyecto = ({proyecto}) => {
    const {auth} = useAuth()
    const admin = useAdmin() 
    const { handleModalEliminarProyecto } = useProyectos();
    const { nombre, _id, cliente, creador} = proyecto
 
  return (
    <div className='border-b p-5 flex items-center gap-2 justify-between'>
      <div className="flex gap-2 items-center">
         <p className=" flex-1">
            {nombre}
            <span className=" text-sm text-gray-500 uppercase">{' '}{cliente}</span>
        </p>
        {auth._id !== creador && (
           <p className=" p-1 bg-green-500 rounded-md text-white text-xs uppercase font-bold">Colaborador</p>
        )}
      </div>
       
       <div className=" flex gap-2 items-center">
       {auth._id === creador && (
        <div 
        onClick={() => handleModalEliminarProyecto(proyecto)}
        className=" cursor-pointer flex items-center gap-2 text-gray-400 hover:text-red-700 transition-colors">
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
        </div>
        )}
          <Link to={`${_id}`}
         className=' text-gray-600 hover:text-gray-800 uppercase text-sm font-bold'
        >
            Ver Proyecto
        </Link>
       
       </div>
       
    </div>
  )
}

export default PreviewProyecto