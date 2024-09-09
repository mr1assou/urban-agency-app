import React from 'react'
import logo from '../assets/images/logo.png'
import {useEffect,useState} from 'react'
import Axios from 'axios'
function Header() {
    Axios.defaults.withCredentials=true;
    const [user,setUser]=useState({firstName:'',lastName:'',role:''});
    useEffect(()=>{
    Axios.get(`${import.meta.env.VITE_URL}/user`).then((response)=>{
        const {firstName,lastName,role}=response.data;    
        setUser({firstName,lastName,role});
    })
    },[])  
  return (
    <div>
        <nav className="bg-white h-[10%] flex justify-between items-center  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          <img src={logo} className="block w-[8%] h-[90%] "/>
            <div className="mr-2">
                <small className="text-grey">{user.role}</small>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
        </nav>
    </div>
  )
}

export default Header
