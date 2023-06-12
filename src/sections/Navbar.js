import React from "react";

// css
import "../styles/css/navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className='d-flex justify-content-between align-items-center nav-sub'>
        <div id='app-logo'>
          <h3>Classified Ads</h3>
        </div>
        <div id='app-menu'>
          <ul className='d-flex justify-content-evenly align-items-center'>
            <li>Home</li>
            <li>All Categories</li>
            <li>Contact</li>
            <li>Profile</li>
            <li className='nav-post-ad'>+ Post Your Ad</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
