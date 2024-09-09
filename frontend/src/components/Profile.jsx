import React from 'react'
import Header from './Header'
import Content from './Content'
import { Outlet, Link } from 'react-router-dom';
function Profile() {
  return (
    <div className="h-screen">
        <Header />
        <Outlet />
    </div>
  )
}

export default Profile
