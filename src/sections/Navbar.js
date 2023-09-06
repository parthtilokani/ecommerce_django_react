import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosOpen } from "../utils/axios.js";

// css
import "../styles/css/navbar.css";

// hooks
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const [logo, setLogo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [gotLogo, setGotLogo] = useState(false);
  useQuery({
    queryKey: ["logo"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/user/app_icon");
      setLogo(data ? data[0] : []);
      setGotLogo(true);
      return data || [];
    },
    enabled: !gotLogo,
  });

  return (
    <nav>
      <div id='app-brand'>
        <div className='logo-wrapper'>
          <Link to='/'>
            {logo?.icon_image ? (
              <img
                src={logo?.icon_image}
                alt='logo'
                style={{ width: logo?.width, height: logo?.height }}
              />
            ) : (
              <h3>Classified Ads</h3>
            )}
          </Link>
        </div>
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
            <Link
              to='/home#our-pricing-and-packages'
              onClick={() => setIsOpen(false)}>
              Pricing and Packages
            </Link>
          </li>
          {/* <li>
            <Link>All Categories</Link>
          </li> */}
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
                state={{ page: 2 }}
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
                  navigate("/", { replace: true });
                }}>
                Log out
              </Link>
            </li>
          )}
          <li>
            {auth?.accessToken ? (
              <Link to='/post-new-ad'>
                <button
                  className='nav-post-ad'
                  style={{
                    backgroundColor:
                      location.pathname === "/post-new-ad"
                        ? "rgb(62, 176, 154)"
                        : "",
                  }}
                  onClick={() => setIsOpen(false)}>
                  + Post Your Ad
                </button>
              </Link>
            ) : (
              <Link to='/login'>
                <button
                  className='nav-post-ad'
                  style={{
                    backgroundColor:
                      location.pathname === "/post-new-ad"
                        ? "rgb(62, 176, 154)"
                        : "",
                  }}
                  onClick={() => setIsOpen(false)}>
                  + Post Your Ad
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
