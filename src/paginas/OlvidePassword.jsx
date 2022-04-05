import { Link } from "react-router-dom"
import { useState } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const OlvidePassword = () => {

  const [alerta, setAlerta] = useState({})
  const [email, setEmail] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if(!email){
      setAlerta({
        msg: 'El Email es obligatorio',
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }

    try {
     
     const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{ email })
     
     setAlerta({
      msg: data.msg,
      error: false
    })

    setEmail('')
     
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setEmail('');
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }
  }

  return (
    <>
    <h1 className=' text-sky-600 font-black text-6xl capitalize'>Recupera tu acceso y no pierdas tus <span className=' text-slate-700'>Proyectos</span> </h1>
    <form 
      className='my-10 bg-white shadow rounded-md p-5'
      onSubmit={handleSubmit}
    >
        
      {alerta.msg && <Alerta alerta={alerta}/>}

      <div className=' my-5'>
        <label 
        className=' uppercase text-gray-600 block text-xl font-bold'
        htmlFor='email'
        
        >Email de Regístro</label>
        <input 
          type="email"
          placeholder='Tu Email de Registro'
          className=' w-full mt-3 p-3 border rounded-md bg-gray-50'
          id='email'
          value={email}
          onChange={e=> setEmail(e.target.value)}
        />
      </div>
     
      <input 
        type="submit" 
        value="Recuperar Password"
        className=' bg-sky-700 w-full py-3 text-white uppercase font-bold rounded
        hover:cursor-pointer hover:bg-sky-800 transition-colors'
      />

    </form>
    <nav className=' lg:flex lg: justify-between'>
        <Link
          to='/'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
        <Link
            to='/registrar'
            className='block text-center my-5 text-slate-500 uppercase text-sm'
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
    </nav>
    </>
  )
}

export default OlvidePassword