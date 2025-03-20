import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { FaUsersCog } from "react-icons/fa"; // Ícone para Gerir Utilizadores
import { TbBasketCog, TbBuildingCog } from "react-icons/tb"; // Ícones para Gerir Produtos e Categorias
import "./AdminPanel.css";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null); // Estado para controlar o painel ativo

  // Redireciona para a homepage se o usuário não for admin
  if (!isAdmin) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="admin-panel-container">
      <h1>Painel Administrativo</h1>
      <div className="admin-buttons">
        <button
          className={`admin-button ${activePanel === "users" ? "active" : ""}`}
          onClick={() =>
            setActivePanel(activePanel === "users" ? null : "users")
          }
        >
          <FaUsersCog className="admin-icon" />
          Gerir Utilizadores
        </button>
        <button
          className={`admin-button ${
            activePanel === "products" ? "active" : ""
          }`}
          onClick={() =>
            setActivePanel(activePanel === "products" ? null : "products")
          }
        >
          <TbBasketCog className="admin-icon" />
          Gerir Produtos
        </button>
        <button
          className={`admin-button ${
            activePanel === "categories" ? "active" : ""
          }`}
          onClick={() =>
            setActivePanel(activePanel === "categories" ? null : "categories")
          }
        >
          <TbBuildingCog className="admin-icon" />
          Gerir Categorias
        </button>
      </div>

      {/* Painéis de funcionalidades */}
      {activePanel === "users" && (
        <div className="admin-panel-content">
          <h2>Gerir Utilizadores</h2>
          <p>Aqui você pode adicionar, editar ou remover utilizadores.</p>
          {/* Adicione o formulário ou funcionalidades específicas aqui */}
        </div>
      )}
      {activePanel === "products" && (
        <div className="admin-panel-content">
          <h2>Gerir Produtos</h2>
          <p>Aqui você pode adicionar, editar ou remover produtos.</p>
          {/* Adicione o formulário ou funcionalidades específicas aqui */}
        </div>
      )}
      {activePanel === "categories" && (
        <div className="admin-panel-content">
          <h2>Gerir Categorias</h2>
          <p>Aqui você pode adicionar, editar ou remover categorias.</p>
          {/* Adicione o formulário ou funcionalidades específicas aqui */}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
