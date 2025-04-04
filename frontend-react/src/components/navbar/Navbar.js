import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";
import { userStore } from "../../stores/UserStore";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineLogin, HiOutlineLogout, HiOutlineCog } from "react-icons/hi";
import ProductModal from "../product/ProductModal";
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import { toast } from "react-toastify"; // Importa o método toast para notificações

const Navbar = () => {
  const username = userStore((state) => state.username); // Obtém o estado do username da store
  const imagem = userStore((state) => state.imagem); // Obtém o estado da imagem da store
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
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
      await api.post("/users/logout"); // Faz o request com o serviço Axios configurado
      clearUser(); // Limpa o estado do usuário na store
      toast.success("Logout realizado com sucesso!"); // Exibe a toast notification de sucesso
    } catch (error) {
      console.error("Erro no logout:", error.response?.data || error.message);
      toast.error("Erro ao realizar logout. Tente novamente."); // Exibe a toast notification de erro
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
              {imagem && (
                <img src={imagem} alt="User" className="nav-user-image" />
              )}
              <span className="nav-welcome"> Bem-vindo, {username}!</span>
            </li>
          )}

          {/* Ícone de Login */}
          {!username && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <HiOutlineLogin className="nav-icon" />
              </Link>
            </li>
          )}

          {/* Link para o Perfil */}
          {username && (
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
          )}

          {/* Ícone para o Painel Administrativo (apenas para admins) */}
          {isAdmin && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                <HiOutlineCog className="nav-icon" />
              </Link>
            </li>
          )}

          {/* Ícone de Logout */}
          {username && (
            <li className="nav-item">
              <button className="nav-link logout-button" onClick={handleLogout}>
                <HiOutlineLogout className="nav-icon" />
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
