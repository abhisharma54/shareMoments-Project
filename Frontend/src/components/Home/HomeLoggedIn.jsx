import React, { useEffect, useState } from "react";
import { HomeLoggedInImg } from "../../assets/Asset";
import { Error, Title } from "../index";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";

export default function HomeLoggedIn() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({})

  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
       try {
         setError("")
         const response = await axios.get(`${import.meta.env.VITE_USERS_API_URL}/getCurrent-user`)
         const userData = response.data.data;
         setUserData(userData)
 
       } catch (error) {
         setError("Failded to login "+ error.message)
       } finally {
         setLoading(false)
       }
     })();
   }, [dispatch])

  return (
    <>
      <div className="w-full h-full scrollbar-none overflow-auto">
        {error ? <Error errorMessage={error} /> : (
          <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="img-container w-[35vw] max-[1024px]:w-[45vw] max-[768px]:w-[30rem] max-[550px]:w-[80vw]">
            <img src={HomeLoggedInImg} alt="main-homePage-welcome-img" />
          </div>
          <div className="content-container flex flex-col justify-center items-center mt-[50px] max-[1440px]:mt-[40px]">
            <div className="welcome-container">
              <p className="w-max bg-[#00ed43b1] text-white text-[1.4rem] font-bold tracking-[0.5px] mb-[-16px] px-2.5 rounded-md shadow-[1px_1px_20px_2px_#00ff4849] max-[1440px]:text-[1.3rem] max-[1440px]:mb-[-8px] max-[1024px]:text-[1.2rem] max-[768px]:text-[0.9rem] max-[768px]:mb-0">{userData.username}</p>
              <h1 className="text-[6rem] font-semibold text-white mb-0 max-[1440px]:text-[4.2rem] max-[768px]:text-[3.4rem] max-[425px]:text-[2.7rem]">WELCOME TO</h1>
            </div>
            <Title className="title-img w-[42rem] max-[1440px]:w-[29rem] max-[1024px]:w-[28rem] max-[768px]:w-[23rem] max-[425px]:w-[18rem]" />
          </div>
        </div>
        )}
      </div>
    </>
  );
}
