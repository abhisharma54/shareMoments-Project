import React from 'react'
import title from '../assets/img/title.png'

function Title({
  className = 'w-[250px]',
  ...props
}) {

  return (
    <div {...props} className={`${className}`}>
        <img 
        src={title} 
        alt="title-brand" 
        />
    </div>
  )
}

export default Title