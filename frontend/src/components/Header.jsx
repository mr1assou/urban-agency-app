import React from 'react'
import logo from '../assets/images/logo.png'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
function Header() {
  Axios.defaults.withCredentials = true;
  const navigate=useNavigate();
  const [user, setUser] = useState({ firstName: '', lastName: '', role: '' });
  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_URL}/user`).then((response) => {
      const { firstName, lastName, role } = response.data;
      setUser({ firstName, lastName, role });
    })
  }, [])
  const handleLogout=(e)=>{
    e.preventDefault();
    Axios.post(`${import.meta.env.VITE_URL}/logout`).then((response) => {
      const message=response.data.message;
      if(message==="good")
        navigate('/');
    })
  }
  return (
    <div>
      <nav className="bg-white h-[10%] flex justify-between items-center  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <img src={logo} className="block w-[8%] h-[90%] " />
        <div className="mr-2  flex items-center">
          <div className='flex mr-5 text-blue'>
          <Link to='/profile/Content'> <FaHome className='text-2xl mr-2 cursor-pointer  ' /></Link> 
          <CiLogout className='text-2xl cursor-pointer ' onClick={handleLogout}/>
          </div>
          <div>
            <small className="text-grey">{user.role}</small>
            <p className="font-medium">{user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()} {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase()}</p>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
