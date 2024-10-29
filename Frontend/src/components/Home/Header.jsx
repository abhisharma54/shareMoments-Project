import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Logo, Title, Button } from "../index";
import { useLocation } from "react-router-dom";

function Header({ ...props }) {
  const location = useLocation();
  const showRegisterBtn = location.pathname === "/";

  return (
    <>
      <div className="w-full flex gap-5 justify-between items-center bg-bgColor bg-bgHeader-color px-4 py-2.5 max-[425px]:px-4">
        <Link to="/">
          <Logo className="header-logo w-[3rem] max-[425px]:w-[2.8rem]" />
        </Link>
        <Link to="/">
          <Title
            {...props}
            className="header-title w-[12rem] max-[425px]:w-[9rem]"
          />
        </Link>
        {showRegisterBtn ? (
          <NavLink to="/register">
            <Button
              className={`header-btn text-[1rem] text-nowrap transition duration-150 ease-in-out hover:shadow-signup-login hover:outline-none active:bg-white max-[425px]:text-[0.8rem]`}
              type="submit"
            >
              Sign Up / Login
            </Button>
          </NavLink>
        ) : (
          <div></div>
        )}
      </div>
      <main className="w-full">
        <Outlet />
      </main>
    </>
  );
}

export default Header;
