import React, { useEffect, useState } from "react";
import { HomeLoggedInImg } from "../../assets/Asset";
import { Title } from "../index";
import "../CSS/HomeLoggedIn.css";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";

export default function HomeLoggedIn() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({})
  const userDetails = useSelector(state => state.users.userData);
  const dispatch = useDispatch()
  console.log("homeLoggedIn", userDetails);
  

  useEffect(() => {
    (async () => {
       try {
         setError("")
         const response = await axios.get(`${import.meta.env.VITE_USERS_API_URL}/getCurrent-user`)
         const userData = response.data.data;
         setUserData(userData)
 
       } catch (error) {
         setError("Failded to login "+ error.message)
         console.log("Failed to fetch::HomeLogged", error);
       } finally {
         setLoading(false)
       }
     })();
   }, [dispatch])

  {loading? <h1 className="text-3xl text-center text-[#00ff47] font-semibold">Loading page...</h1> : null}
  {error? <p className="text-2xl text-center text-[#00ff47] font-semibold">{error.message}</p> : null}

  return (
    <>
      <div className="HomeLoggedIn-main-container ">
        <div className="HomeLoggedIn-container-right">
          <div className="img-container">
            <img src={HomeLoggedInImg} alt="main-homePage-welcome-img" />
          </div>
          <div className="content-container">
            <div className="welcome-container">
              <p>{userData.username}</p>
              <h1>WELCOME TO</h1>
            </div>
            <Title className="title-img" />
          </div>
        </div>
      </div>

      {/* <div className="home-main-container">
        <div className="home-container-left">
          <Navbar />
        </div>
        <div className="home-container-right">
            <PostCard />
        </div>
      </div> */}
    </>
  );
}
