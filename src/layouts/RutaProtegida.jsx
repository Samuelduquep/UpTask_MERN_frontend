import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Cargando from "../components/Cargando";

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  if (cargando) return <Cargando/>;
  return (
    <>
      {auth._id ? (
        <div className=" bg-gray-100 ">
          <Header />

          <div className=" md:flex h-full">
            <Sidebar />
            <main className=" bg-slate-200 flex-1 p-10 min-h-screen">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default RutaProtegida;
