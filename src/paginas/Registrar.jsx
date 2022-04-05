import { Link } from "react-router-dom"
import { useState } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()
    

    if([nombre, email, password, repetirPassword].includes('')) {

      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }

    if(password !== repetirPassword) {

      setAlerta({
        msg: 'Los password deben ser iguales',
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }

    if(password.length<6) {

      setAlerta({
        msg: 'El password es muy corto, debes agregar al menos 6 digitos',
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }

    try {
      
     const {data} = await clienteAxios.post(`/usuarios`,{ nombre, email, password })
     
     setAlerta({
       msg: data.msg,
       error: false
     })

     setNombre('')
     setEmail('')
     setPassword('')
     setRepetirPassword('')

    } catch (error) {
    setAlerta({
      msg: error.response.data.msg,
      error: true
    })
    setTimeout(() => {
      setAlerta({})
      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
    }, 3000);

    return
   }
  }

  return (
    <>
    <h1 className=' text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra tus <span className=' text-slate-700'>proyectos</span> </h1>
    <form 
      className='my-10 bg-white shadow rounded-md p-5'
      onSubmit={handleSubmit}  
    >
       { alerta.msg ? <Alerta alerta={alerta}/> : null}

      <div className=' my-5'>
        <label 
        className=' uppercase text-gray-600 block text-xl font-bold'
        htmlFor='nombre'
        
        >Nombre</label>
        <input 
          type="text"
          placeholder='Tu Nombre'
          className=' w-full mt-
          3 p-3 border rounded-md bg-gray-50'
          id='nombre'
          value={nombre}
          onChange={e=> setNombre(e.target.value)}
        />
      </div>
      <div className=' my-5'>
        <label 
        className=' uppercase text-gray-600 block text-xl font-bold'
        htmlFor='email'
        
        >Email</label>
        <input 
          type="email"
          placeholder='Email de Registro'
          className=' w-full mt-3 p-3 border rounded-md bg-gray-50'
          id='email'
          value={email}
          onChange={e=> setEmail(e.target.value)}
        />
      </div>
      <div className=' my-5'>
        <label 
        className=' uppercase text-gray-600 block text-xl font-bold'
        htmlFor='password'
        
        >Password</label>
        <input 
          type="password"
          placeholder='Tu Password'
          className=' w-full mt-3 p-3 border rounded-md bg-gray-50'
          id='password'
          value={password}
          onChange={e=> setPassword(e.target.value)}
        />
      </div>

      <div className=' my-5'>
        <label 
        className=' uppercase text-gray-600 block text-xl font-bold'
        htmlFor='repetir-password'
        
        >Repetir Password</label>
        <input 
          type="password"
          placeholder='Repite Tu Password'
          className=' w-full mt-3 p-3 border rounded-md bg-gray-50'
          id='repetir-password'
          value={repetirPassword}
          onChange={e=> setRepetirPassword(e.target.value)}
        />
      </div>
      <input 
        type="submit" 
        value="Crear Cuenta"
        className=' bg-sky-700 w-full py-3 text-white uppercase font-bold rounded
        hover:cursor-pointer hover:bg-sky-800 transition-colors'
        onClick={handleSubmit}
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
          to='/olvide-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Olvide mi password
        </Link>
    </nav>
  </>
  )
}

export default Registrar