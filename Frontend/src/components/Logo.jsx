import React from 'react'
import { Logo as LogoFile } from '../assets/Asset'

function Logo({...props}) {

  return (
    <div {...props}>
        <img
         src={LogoFile} 
         alt="logo" 
         />
    </div>
  )
}

export default Logo