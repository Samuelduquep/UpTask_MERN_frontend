import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"
import Alerta from "../components/Alerta"
import ModalEliminarProyecto from "../components/ModalEliminarProyecto"

const Proyectos = () => {
  
  const {proyectos, alerta} = useProyectos()

  return (
      <>
        <h1 className=' text-4xl font-black'> Proyectos </h1>
        {proyectos.length ?  <p className=' text-md font-black'> Actualmente hay {proyectos.length} Proyectos </p> : null}

        {alerta.msg && <Alerta alerta={alerta}/> }

        <div className=" bg-white shadow mt-10 rounded-lg p-5">
            {proyectos.length ? 

              proyectos.map(proyecto => (
                <PreviewProyecto
                  key={proyecto._id}
                  proyecto={proyecto}
                />
              ))
            
            : <p className=" text-center text-gray-600 uppercase font-bold">No hay proyectos</p>}
        </div>
        <ModalEliminarProyecto/>
      </>
  )
}

export default Proyectos