import React from 'react'
import HomeLoggedImg from '../../assets/img/HomeLogged.png'
import { titleImg } from '../../assets/Asset'

function HomeLogged() {

  return (
    <>
      <div className='HomeLogged-container w-full flex items-center justify-center py-5 px-[3.2rem] overflow-auto max-[1440px]:px-[6.3rem] max-[1024px]:px-[1rem] max-[1024px]:gap-[10px] max-[768px]:flex-col max-[768px]:gap-8 max-[425px]:gap-12'>
        <div className='HomeLogged-container-left w-[50vw] flex flex-col items-center justify-center max-[768px]:w-full max-[768px]:mt-10 max-[425px]:mt-0'>
            <h1 className=' text-white text-[7rem] text-nowrap font-semibold mb-0 max-[1440px]:text-[5.5rem] max-[1024px]:text-[4rem] max-[768px]:text-[4rem] max-[425px]:text-[3rem]'>WELCOME TO</h1>
            <img className='w-[47rem] max-[1440px]:w-[35rem] max-[1024px]:w-[27rem] max-[768px]:w-[30rem] max-[425px]:w-[80vw]' src={titleImg} alt="shareMomentImg" />
            <p className='text-[1.24rem] text-center text-wrap mt-2 text-white font-semibold max-[1440px]:text-[0.95rem] max-[1024px]:text-[0.75rem] max-[768px]:text-[0.92rem] max-[425px]:text-[0.58rem]'>WHERE YOU CAN SHARE YOUR THOUGHTS AND <span className='text-[#00ff47]'>BEST MOMENTS</span> OF YOUR LIFE.</p>
        </div>

        <div className="HomeLogged-container-right flex justify-center items-center w-[50vw] max-[768px]:w-[70vw] max-[425px]:w-full">
            <img className='w-full h-[80vh] max-[768px]:h-full object-contain mix-blend-hard-light' src={HomeLoggedImg} alt="home-logged-img" />
        </div>
        </div>
    </>
  )
}

export default HomeLogged