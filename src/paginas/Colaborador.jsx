import useProyectos from "../hooks/useProyectos"

const Colaborador = ({colaborador}) => {
    const { handleModalEliminarColaborador} = useProyectos()
    const {email, nombre} = colaborador

  return (
    <div className=' border-b p-2 flex justify-between items-center'>
      <div>
          <p>{nombre}</p>
          <p className=' text-sm text-gray-700'>{email}</p>
      </div>
      <div>
      <button
         className=" bg-red-600 hover:bg-red-800 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
         onClick={()=>handleModalEliminarColaborador(colaborador)}
        >
            Eliminar
        </button>
      </div>
    </div>
  )
}

export default Colaborador
