import React, { useContext } from 'react'
import { Outlet } from "react-router-dom"
import SuperAdminNavbar from '../../components/SuperAdminNavbar'
import SuperAdminAppBar from '../../components/SuperAdminAppBar'
import { NavbarContext } from '../../contexts/NavbarContext'

export default function SuperAdminDashboadLayout() {
  const [isNavbarCollapsed] = useContext(NavbarContext)

  return (
   <div className='min-h-screen w-full'>
      <SuperAdminNavbar />
      <div className={isNavbarCollapsed ? `w-full min-w-0 overflow-x-hidden md:pl-[5.5rem]` : `w-full min-w-0 overflow-x-hidden md:pl-72`}>
        <SuperAdminAppBar />
        <Outlet />
      </div>
    </div>
  )
}
