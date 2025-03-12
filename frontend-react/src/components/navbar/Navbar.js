import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/">
          <img src={StoreLogo} alt="Store Logo" />
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link className="nav-link" to="/home">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
