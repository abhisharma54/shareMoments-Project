import React from 'react'

function Input({
    type='',
    className= '',
    ...props
}, ref) {

  return (
    <div className='w-full'>
        <input 
        type={type} 
        className={`text-white bg-bgInput px-[2.8rem] py-[0.6rem] rounded-[30px] mb-2.5 outline-none border-[1px] border-[rgba(255,255,255,0.175)] focus:border-[#00ff47] ${className}`}
        ref={ref}
        {...props}
         />
    </div>
  )
}

export default React.forwardRef(Input)