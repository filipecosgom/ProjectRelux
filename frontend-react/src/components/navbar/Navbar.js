import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";
import { userStore } from "../../stores/UserStore";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi"; // Ícones de Login e Logout
import ProductModal from "../product/ProductModal";

const Navbar = () => {
  const username = userStore((state) => state.username); // Obtém o estado do username da store
  const imagem = userStore((state) => state.imagem); // Obtém o estado da imagem da store
  const clearUser = userStore((state) => state.clearUser);

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

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
          {username && (
            <li className="nav-item">
              {/* Botão "+" para abrir o modal */}
              <IoAddCircleOutline
                className="add-product-icon"
                onClick={() => setIsModalOpen(true)}
              />
              {imagem && (
                <img src={imagem} alt="User" className="nav-user-image" />
              )}
              <span className="nav-welcome"> Bem-vindo, {username}!</span>
            </li>
          )}
          {!username && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <HiOutlineLogin className="nav-icon" /> {/* Ícone de Login */}
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
                <HiOutlineLogout className="nav-icon" /> {/* Ícone de Logout */}
              </button>
            </li>
          )}
        </ul>
      </div>
      {/* Modal de criação de produto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
