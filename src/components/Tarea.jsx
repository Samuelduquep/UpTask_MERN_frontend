import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

    const { nombre, descripcion, prioridad, fechaEntrega, _id, estado } = tarea
    const {handleModalEditarTarea, handleModalEliminarTarea, estadoTarea} = useProyectos()
    const admin = useAdmin()


  return (
    <div className=" border-b p-5 flex justify-between items-center">

      <div>
        <p className=" mb-1 text-xl">{nombre}</p>
        <p className=" mb-1 text-sm">{descripcion}</p>
        <p className=" mb-1 text-sm text-gray-500">{formatearFecha(fechaEntrega)}</p>

        {prioridad === 'Alta' ? (
            <p className="mb-1 text-sm uppercase text-red-500">{prioridad}</p>
        ) : null}
        {prioridad === 'Media' ? (
            <p className="mb-1 text-sm uppercase text-sky-500">{prioridad}</p>
        ) : null}
        {prioridad === 'Baja' ? (
            <p className="mb-1 text-sm uppercase text-gray-500">{prioridad}</p>
        ) : null}
        {estado && <div className=" bg-green-200 p-2 rounded-md"><p className=" text-sm text-gray-600 font-bold"> <span className=" text-sky-800">Completada por:</span> {tarea.completado.nombre}</p> <p className=" text-sm text-gray-600 font-bold"> <span className=" text-sky-800">Email: </span>{tarea.completado.email}</p></div>}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
        <button
         className=" bg-indigo-600 hover:bg-indigo-800 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
         onClick={() => handleModalEditarTarea(tarea)}
        >
            Editar
        </button>
        )}
    
        <button
        className={`${estado ? 'bg-sky-600 hover:bg-sky-800 transition-colors' : 'bg-gray-600 hover:bg-gray-800 transition-colors'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
        onClick={() => estadoTarea(_id)}
        >
            {estado ? 'Completa' : 'Incompleta'}
        </button>
        
        {admin && (
        <button
         className=" bg-red-600 hover:bg-red-800 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
         onClick={() => handleModalEliminarTarea(tarea)}
        >
            Eliminar
        </button>
        )}
      </div>

    </div>
  )
}

export default Tarea
