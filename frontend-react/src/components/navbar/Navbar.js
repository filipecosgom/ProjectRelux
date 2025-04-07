import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";
import { userStore } from "../../stores/UserStore";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaUser, FaCogs, FaSignOutAlt } from "react-icons/fa"; // Importa os ícones FontAwesome
import ProductModal from "../product/ProductModal";
import api from "../../services/apiService";
import { toast } from "react-toastify";

const Navbar = () => {
  const username = userStore((state) => state.username);
  const imagem = userStore((state) => state.imagem);
  const isAdmin = userStore((state) => state.isAdmin);
  const clearUser = userStore((state) => state.clearUser);

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  // Exibe uma toast de boas-vindas após o login
  useEffect(() => {
    if (username) {
      toast.success(`Login efetuado com sucesso! Bem-vindo, ${username}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [username]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      clearUser();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error.response?.data || error.message);
      toast.error("Erro ao realizar logout. Tente novamente.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logotipo do site */}
        <Link className="navbar-logo" to="/">
          <img src={StoreLogo} alt="Store Logo" />
        </Link>
        <ul className="nav-menu">
          {/* Botão "+" para abrir o modal de criação de produto */}
          {username && (
            <li className="nav-item">
              <IoAddCircleOutline
                className="add-product-icon"
                onClick={() => setIsModalOpen(true)}
              />
            </li>
          )}

          {/* Hub de links na imagem de perfil */}
          {username && (
            <li className="nav-item profile-hub">
              <img src={imagem} alt="User" className="nav-user-image" />
              <div className="profile-dropdown">
                <p className="welcome-message">Bem-vindo, {username}!</p>
                <Link to="/profile" className="profile-link">
                  <FaUser className="profile-icon" /> O meu perfil
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="profile-link">
                    <FaCogs className="profile-icon" /> Administrar
                  </Link>
                )}
                <button
                  className="profile-link logout-button"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="profile-icon" /> Logout
                </button>
              </div>
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
