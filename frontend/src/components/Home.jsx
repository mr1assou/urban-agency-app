import React from 'react'
import background from '../assets/images/background.jpg'
import logo from '../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect} from 'react';
import Axios from 'axios'
const Home = () => {
  Axios.defaults.withCredentials=true;
  const [credentials,setCredentials]=useState({email:'',password:''});
  const [userState,setUserState]=useState(false);
  const navigate=useNavigate();
  useEffect(()=>{
    Axios.get(`${import.meta.env.VITE_URL}/login`).then((response)=>{
      console.log(response.data);
    })
  },[]);
  const handleForm=(e)=>{
    e.preventDefault();
    Axios.post(`${import.meta.env.VITE_URL}/login`,{email:credentials.email,password:credentials.password}).then((response)=>{
      if('user_id' in response.data)
        navigate('/profile/content');
      else
        setUserState(true);
    })
  }
  return (
    <div className="w-screen h-screen relative">
      <img src={background} className="block w-full h-full object-cover" />
      <div className="absolute w-full h-full top-0">
        <nav className="bg-white h-[10%]">
          <img src={logo} className="block w-[8%] h-[90%]" />
        </nav>
        <div className="h-[90%] flex justify-center items-center">
          <section className="bg-gray-50 dark:bg-gray-900 w-[30%]">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full bg-white rounded-lg">
                <div className=" space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="font-bold leading-tight tracking-tight text-gray-900 text-xl text-blue">
                    connectez-vous à votre compte
                  </h1>
                  {
                    userState && <p className="text-red font-bold text-lg">e-mail ou le mot de passe sont incorrects</p>
                  }
                  <form className="space-y-4 md:space-y-6" action="" onSubmit={handleForm}>
                    <div>
                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email:</label>
                      <input type="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required onChange={(e)=>{setCredentials({email:e.target.value,password:credentials.password})}} value={credentials.email}/>
                    </div>
                    <div>
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">mot de passe:</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e)=>{setCredentials({email:credentials.email,password:e.target.value})}} value={credentials.password}/>
                    </div>
                    <button className="bg-blue w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:scale-105 transition-transform duration-300">se connecter</button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
