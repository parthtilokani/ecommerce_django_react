import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// css
import "../styles/css/navbar.css";

// hooks
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const location = useLocation();
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
              style={{
                color:
                  location.pathname === "/home" || location.pathname === "/"
                    ? "#43c6ac"
                    : "",
              }}
              onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link>All Categories</Link>
          </li>
          <li>
            <Link
              to='/contact'
              style={{
                color: location.pathname === "/contact" ? "#43c6ac" : "",
              }}
              onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            {auth?.accessToken ? (
              <Link
                to='/profile'
                style={{
                  color: location.pathname === "/profile" ? "#43c6ac" : "",
                }}
                onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            ) : (
              <Link
                to='/login'
                style={{
                  color: location.pathname === "/login" ? "#43c6ac" : "",
                }}
                onClick={() => setIsOpen(false)}>
                Log In
              </Link>
            )}
          </li>
          {auth?.accessToken && (
            <li>
              <Link
                onClick={() => {
                  setAuth({});
                  localStorage.removeItem("auth");
                  setIsOpen(false);
                }}>
                Log out
              </Link>
            </li>
          )}
          <li>
            <Link to='/post-new-ad'>
              <button
                className='nav-post-ad'
                style={{
                  color: location.pathname === "/post-new-ad" ? "#43c6ac" : "",
                }}
                onClick={() => setIsOpen(false)}>
                + Post Your Ad
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
