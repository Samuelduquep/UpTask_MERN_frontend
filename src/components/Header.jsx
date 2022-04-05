import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Busqueda from "./Busqueda";

const Header = () => {
  const {handleBuscador, logOut} = useProyectos()
  const {logOutAuth} = useAuth()

  const handleLogout = () => {
    logOut()
    logOutAuth()
    localStorage.removeItem('token')
  }


  return (
    <header className=" px-4 py-5 bg-white border-b md:sticky top-0 ...">
      <div className=" md:flex md:justify-between">

        <Link to='/proyectos'>
          <h2 className=" text-4xl text-sky-600 font-black text-center">
            UpTask
          </h2>
        </Link>

        <div className='mt-10 md:mt-0 lg:mt-0 flex-col sm:flex-row sm:justify-between flex items-center gap-4'>
            <button
                    type='button'
                    className='font-bold text-gray-500 hover:text-sky-900 uppercase'
                    onClick={handleBuscador}
                >
                    Buscar Proyecto 
            </button>

            <Link 
            to='/proyectos'
            className='font-bold text-gray-500 hover:text-sky-900 uppercase'
            
            >Proyectos</Link>

            <button
                type='button'
                className=' text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold hover:bg-sky-800 transition-colors'
                onClick={handleLogout}
            >
                Cerrar Sesión
            </button>
            <Busqueda/>
        </div>

      </div>
    </header>
  );
};

export default Header;
