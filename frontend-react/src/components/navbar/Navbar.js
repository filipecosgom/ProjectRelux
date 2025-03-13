import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";
import { userStore } from "../../stores/UserStore";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const username = userStore((state) => state.username); // Obtém o estado do username da store
  const clearUser = userStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      const token = userStore.getState().token;
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      clearUser(); // Limpa o estado do usuário na store
      alert("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro ao realizar logout. Tente novamente.");
    }
  };

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
          {!username && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
          {username && (
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
          )}
          {username && (
            <li className="nav-item">
              <button className="nav-link logout-button" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
