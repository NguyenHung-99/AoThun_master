import React from 'react'
import NavBar from './NavBar'
import Notify from './Notify'
import Modal from './modal'

import Home from '../pages/home'
function Layout({children}){
    return (
      
        
        <div >
            <NavBar />
            <Notify/>
            <Modal/>
            {children}
            
        </div>
    )
}
export default Layout