import React from 'react'
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex flex-col gap-2 justify-center items-center bg-bgColor bg-bgNavbar-color'>
      <h1 className='text-white max-[768px]:text-[2rem] max-[425px]:text-[1.5rem]'>404 | Page Not Found</h1>
      <Button onClick={() => navigate('/navbar/home')} className='w-[12rem] font-bold text-nowrap shadow-2xl transition duration-100 ease-linear focus:bg-white focus:text-black focus:outline-none hover:bg-bgColor hover:text-white'>Go to Home Page</Button>
    </div>
  );
}

export default ErrorBoundary
