import React, { useState } from 'react'
import Axios from "axios"
function Settings() {
  const [passwords, setPasswords] = useState({ password1: "", password2: "" });
  const [stateChange,setStateChange]=useState('');
  const handlePassowrds = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }
  const submitForm = (e) => {
    e.preventDefault();
    if (passwords.password1 === passwords.password2) {
      Axios.post(`${import.meta.env.VITE_URL}/changePassword`,{password:passwords.password1})
        .then((response) => {
          const message = response.data.message;
          if(message==="good"){
            setPasswords({ password1: "", password2: "" });
            setStateChange("good");
          }
        })
    }
  }
  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <h1 className='font-black text-blue text-2xl  text-center'>
      Paramètres de changer le mot de passe</h1>
        {
                     stateChange ==="good" ?
                     <p className="text-center p-2 bg-green text-white text-xl font-bold  w-full mt-10">vous avez changer le mot de passe avec succès</p>
                     : stateChange ==="not good" ? <p className="text-center p-2 bg-red text-white text-xl font-bold  w-full mt-10">les deux mot de passe sont incompatible</p> : null
          }
      <form className="space-y-4 md:space-y-6 w-[30%] mt-10" action="" onSubmit={submitForm}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nouveau mot de passe:</label>
          <input type="password" name="password1" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handlePassowrds} value={passwords.password1}/>
        </div>
        <div>
          <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">répéter le nouveau mot de passe:</label>
          <input type="password" name="password2" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={handlePassowrds} value={passwords.password2}/>
        </div>
        <button className="bg-blue w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:scale-105 transition-transform duration-300">confirmer</button>
      </form>
    </div>
  )
}

export default Settings
