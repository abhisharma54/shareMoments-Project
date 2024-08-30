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
import "../CSS/Navbar.css";
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
      icon: <img src={HomeIcon} alt="home-icon" />,
      active: authStatus,
    },
    {
      path: `profile/${userDetails?.username}`,
      name: "Profile",
      icon: <img src={ProfileIcon} alt="home-icon" />,
      active: authStatus,
    },
    {
      path: "addPost",
      name: "New Post",
      icon: <img src={NewPostIcon} alt="home-icon" />,
      active: authStatus,
    },
    {
      path: "explore",
      name: "Explore",
      icon: <img src={ExploreIcon} alt="home-icon" />,
      active: authStatus,
    },
    {
      path: "about",
      name: "About",
      icon: <img src={AboutIcon} alt="home-icon" />,
      active: authStatus,
    },
  ];

  {loading && <h1 className="text-3xl text-center text-[#00ff47] font-semibold">Loading page...</h1>}
  {error && <p className="text-2xl text-center text-[#00ff47] font-semibold">{error.message}</p>}

  return (
    <>
      <Link to="#" title="menu-bar" className="menu-bar" onClick={() => setMenuOpen(prev => !prev)}>
        <img src={Menu} alt="menu-icon" />
      </Link>
      <div className="navbar-main-container">
        <div className={menuOpen ? "menuOpen" : "navbar-container"} ref={navbarRef}>
          <Link to="home" className="upper-container" onClick={handleLinkClick}>
            <Logo className="navbar-logo" />
            <Title className="navbar-title" />
          </Link>

          <div className="lower-container">
            <ul className="navLink-container">
              {navRoutes.map((item) =>
                (
                  <li key={item.name}>
                    <NavLink to={item.path} onClick={handleLinkClick} className="navLink-container-links">
                      <div className="links-img">{item.icon}</div>
                      <h1>{item.name}</h1>
                    </NavLink>
                  </li>
                )
              )}
            </ul>

            <div className="btn-wrapper">
              <button onClick={logoutHandle} className="logoutBtn  text-zinc-800 tracking-wider rounded-full font-bold shadow-xl">
                <img 
                  src={logoutIcon} 
                  title="logout-icon" 
                  alt="logout-icon" />
                <p>Logout</p>
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

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Navbar;
