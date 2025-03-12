import React from "react";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a className="navbar-logo" href="/">
          <img src={StoreLogo} alt="Store Logo" />
        </a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a className="nav-link" href="/home">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/login">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
