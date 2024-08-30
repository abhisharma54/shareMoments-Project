import React from 'react'

function Button({
    className="",
    children,
    bgColor = 'bg-[#00ff47]',
    textColor = 'text-[#202020]',
    type,
    ...props
}) {
  
  return (
    <button 
    type={type}
    className={`px-3 py-2 ${bgColor} ${textColor} rounded-full font-semibold ${className}`}
    {...props}
    >{children}</button>
  )
}

export default Button