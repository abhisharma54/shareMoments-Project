import React, {useId} from 'react'

function Input({
    type='text',
    className= '',
    ...props

}, ref) {
    const id = useId();

  return (
    <div className='w-full'>
        <input 
        type={type} 
        className={`${className}`}
        ref={ref}
        id={id}
        {...props}
         />
    </div>
  )
}

export default React.forwardRef(Input)