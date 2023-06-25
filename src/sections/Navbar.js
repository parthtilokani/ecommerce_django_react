import React, { useState } from "react";
import { Link } from "react-router-dom";

// css
import "../styles/css/navbar.css";

// hooks
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div id='app-brand'>
        <h3>
          <Link to='/'>Classified Ads</Link>
        </h3>
        <div
          id='hamburger'
          className={isOpen ? "hamburger-close" : ""}
          onClick={() => setIsOpen((prev) => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id='app-menu' className={isOpen ? "menu-open" : ""}>
        <ul>
          <li>
            <Link
              to='/home'
              style={{ pointerEvents: auth?.accessToken ? "" : "none" }}>
              Home
            </Link>
          </li>
          <li>
            <Link style={{ pointerEvents: auth?.accessToken ? "" : "none" }}>
              All Categories
            </Link>
          </li>
          <li>
            <Link
              to='/contact'
              style={{ pointerEvents: auth?.accessToken ? "" : "none" }}>
              Contact
            </Link>
          </li>
          <li>
            {auth?.accessToken ? (
              <Link to='/profile'>Profile</Link>
            ) : (
              <Link to='/signup'>Sign Up</Link>
            )}
          </li>
          {auth?.accessToken && (
            <li>
              <Link
                onClick={() => {
                  setAuth({});
                  localStorage.removeItem("auth");
                }}>
                LogOut
              </Link>
            </li>
          )}
          <li>
            <Link
              to='/post-new-ad'
              style={{ pointerEvents: auth?.accessToken ? "" : "none" }}>
              <button className='nav-post-ad'>+ Post Your Ad</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
