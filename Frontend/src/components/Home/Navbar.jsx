import React, { useState, useRef, useEffect } from "react";
import { Logo, Title } from "../index";
import {
  HomeIcon,
  ProfileIcon,
  NewPostIcon,
  ExploreIcon,
  AboutIcon,
  Menu,
  logoutIcon,
} from "../../assets/Asset.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logout } from "../../store/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Navbar() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  const authStatus = useSelector(state => state.users.status);
  const userDetails = useSelector(state => state.users.userData);

  console.log("navbar :: ", authStatus);
  

  const navbarRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandle = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await axios.get(`${import.meta.env.VITE_USERS_API_URL}/logout`)
      console.log("LOGOUT::", response.data);
      dispatch(logout())
      navigate('/register')
      setLoading(false)
    } catch (error) {
      console.log('Logout Failed', error); 
    } finally {
      setLoading(false)
    }
}

  const navRoutes = [
    {
      path: "home",
      name: "Home",
      icon: HomeIcon,
      active: authStatus,
    },
    {
      path: `profile/${userDetails?.username}`,
      name: "Profile",
      icon: ProfileIcon,
      active: authStatus,
    },
    {
      path: "addPost",
      name: "New Post",
      icon: NewPostIcon,
      active: authStatus,
    },
    {
      path: "explore",
      name: "Explore",
      icon: ExploreIcon,
      active: authStatus,
    },
    {
      path: "about",
      name: "About",
      icon: AboutIcon,
      active: authStatus,
    },
  ];

  {loading && <h1 className="text-3xl text-center text-[#00ff47] font-semibold">Loading page...</h1>}
  {error && <p className="text-2xl text-center text-[#00ff47] font-semibold">{error.message}</p>}

  return (
    <>
      <Link to="#" title="menu-bar" className="menu-bar absolute top-0 right-0 w-[6vw] m-[20px] hidden cursor-pointer transition duration-200 ease-in-out hover:scale-[1.2] max-[425px]:block" onClick={() => setMenuOpen(prev => !prev)}>
        <img src={Menu} alt="menu-icon" />
      </Link>
      <div className="navbar-main-container w-full h-screen flex font-custom-font bg-bgColor bg-bgNavbar-color overflow-hidden">
        <div className={menuOpen ? "menuOpen flex flex-col items-center w-[12vw] h-full p-[20px] bg-bgColor bg-bgNavbar-color transition duration-200 ease-in-out max-[425px]:w-[50vw] max-[425px]:h-full max-[425px]:absolute max-[425px]:left-0 max-[425px]:z-10" : "navbar-container flex flex-col items-center w-[12vw] h-full p-[20px] transition duration-200 ease-in-out max-[1440px]:w-[14vw] max-[1024px]:w-[19vw] max-[768px]:w-[22vw] max-[768px]:my-[30px] max-[425px]:absolute max-[425px]:left-[-100%] max-[425px]:right-0"} ref={navbarRef}>
          <Link 
          to="home" 
          className="upper-container flex items-center gap-1.5 w-[11vw] transition duration-150 ease-in-out cursor-pointer hover:scale-[1.05] max-[768px]:justify-center max-[425px]:m-auto max-[425px]:w-[40vw]"
          onClick={handleLinkClick}
          >
            <Logo className="navbar-logo w-[50px] max-[768px]:w-[6vw] max-[425px]:w-[9vw]" />
            <Title className="navbar-title w-[220px] max-[768px]:hidden max-[425px]:block" />
          </Link>

          <div className="lower-container h-full flex flex-col justify-between max-[768px]:items-center max-[768px]:mt-[-20px]">
            <ul className="navLink-container my-[50px]">
              {navRoutes.map((item) =>
                (
                  <li key={item.name}>
                    <NavLink 
                    to={item.path} 
                    onClick={handleLinkClick} 
                    className="navLink-container-links flex items-center gap-1.5 mb-[35px] cursor-pointer transition duration-150 ease-in-out hover:no-underline hover:scale-[1.05] max-[1440px]:ml-2.5 max-[1024px]:mb-[1.4rem] ">
                      <img src={item.icon} alt="navLink-icon" className="links-img w-[1.6vw] max-[1024px]:w-[2.1vw] max-[768px]:w-[2.5vw] max-[425px]:w-[5vw]" />
                      <h1 className="font-custom-font font-bold text-[1.3rem] tracking-wider ml-[5px] mb-0 text-white transition duration-200 ease-in-out text-nowrap pr-3 hover:text-[#00ff47] max-[1440px]:text-[1.1rem] max-[1024px]:text-[1rem] max-[425px]:text-[1.2rem]">{item.name}</h1>
                    </NavLink>
                  </li>
                )
              )}
            </ul>

            <div className="btn-wrapper flex flex-col justify-center">
              <button 
              onClick={logoutHandle}
              className="logoutBtn w-full flex justify-center items-center gap-2.5 px-[5px] py-[10px] font-custom-font font-semibold rounded-full bg-[rgba(255,0,0,0.81)] text-white mb-[1.2rem] transition duration-200 ease-in-out hover:shadow-logoutBtn max-[1024px]:p-2.5"
              >
                <img 
                  src={logoutIcon} 
                  title="logout-icon" 
                  alt="logout-icon"
                  className="w-[1.6vw] max-[1440px]:w-[1.4vw] max-[1024px]:w-[1.8vw] max-[768px]:w-[3vw] max-[425px]:w-[5.5vw]"
                   />
                <p className="text-[1rem] mb-0 max-[1024px]:text-[0.9rem] max-[768px]:hidden max-[425px]:block max-[425px]:text-[1rem]">Logout</p>
              </button>
              {/* <button className="profile-container">
                <img
                  className="userAvatar"
                  src={userDetails && userDetails.avatar?.url || UserAvatar}
                  title="userAvatar"
                  alt="user-avatar-img"/>
                <p>{userDetails && userDetails.username}</p>
              </button> */}
            </div>
          </div>
        </div>

        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Navbar;
