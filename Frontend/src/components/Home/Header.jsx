import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Logo, Title, Button } from "../index";
import "../CSS/Header.css";
import { useLocation } from "react-router-dom";

function Header({ className = "", ...props }) {
  const location = useLocation();

  const showRegisterBtn = location.pathname === "/";

  return (
    <>
      <div className="header">
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
        <Link to="/">
          <Title {...props} className="header-title" />
        </Link>
        {showRegisterBtn? (
          <NavLink to="/register">
            <Button className={`header-btn ${className}`} type="submit">
              Sign Up
            </Button>
          </NavLink>
        ) : <div></div>}
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Header;
