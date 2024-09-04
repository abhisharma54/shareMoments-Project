import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Logo, Title, Button } from "../index";
import { useLocation } from "react-router-dom";

function Header({ className = "", ...props }) {
  const location = useLocation();

  const showRegisterBtn = location.pathname === "/";

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="header flex justify-between items-center bg-bgColor bg-bgHeader-color px-4 py-2.5 max-[425px]:justify-center max-[425px]:gap-12 max-[425px]:px-0">
          <Link to="/">
            <Logo className="header-logo w-[50px] max-[1440px]:w-[3.5vw] max-[1024px]:w-[4.5vw] max-[768px]:w-[6vw] max-[425px]:w-[10vw]" />
          </Link>
          <Link to="/">
            <Title
              {...props}
              className="header-title w-[12vw] max-[1440px]:w-[15vw] max-[1024px]:w-[20vw] max-[768px]:w-[25vw] max-[425px]:w-[35vw]"
            />
          </Link>
          {showRegisterBtn ? (
            <NavLink to="/register">
              <Button
                className={`header-btn text-[1rem] transition duration-150 ease-in-out hover:outline-none active:bg-white max-[425px]:text-[0.9rem] ${className}`}
                type="submit"
              >
                Sign Up
              </Button>
            </NavLink>
          ) : (
            <div></div>
          )}
        </div>
        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Header;
