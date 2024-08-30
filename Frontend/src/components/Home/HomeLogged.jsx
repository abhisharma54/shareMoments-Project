import React from 'react'
import { Header } from '../index'
import HomeLoggedImg from '../../assets/img/HomeLogged.png'
import '../CSS/HomeLogged.css'
import { titleImg } from '../../assets/Asset'

function HomeLogged() {

  return (
    <>
    <section className='HomeLogged-section'>
      <div className='HomeLogged-container'>
        <div className='HomeLogged-container-left'>
            <h1 className=' text-white'>WELCOME TO</h1>
            <img src={titleImg} alt="shareMomentImg" />
            <p className='text-[1.24rem] line-clamp-1 mt-2 text-white font-semibold'>WHERE YOU CAN SHARE YOUR THOUGHTS AND <span className='text-[#00ff47]'>BEST MOMENTS</span> OF YOUR LIFE.</p>
        </div>

        <div className="HomeLogged-container-right">
            <img src={HomeLoggedImg} alt="home-logged-img" />
        </div>
        </div>
    </section>
    </>
  )
}

export default HomeLogged