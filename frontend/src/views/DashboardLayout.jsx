import React, { useContext } from 'react'
import { Outlet } from "react-router-dom"
import Navbar from '../components/Navbar'
import AppBar from '../components/AppBar'
import { NavbarContext } from '../contexts/NavbarContext'

export default function DashboardLayout() {

  const [isNavbarCollapsed] = useContext(NavbarContext)

  return (
    <div className='min-h-screen w-full'>
      <Navbar />
      <div className={isNavbarCollapsed ? `w-full min-w-0 overflow-x-hidden md:pl-[5.5rem]` : `w-full min-w-0 overflow-x-hidden md:pl-72`}>
        <AppBar />
        <Outlet />
      </div>
    </div>
  )
}
