import React from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import "./AdminPanel.css";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const navigate = useNavigate();

  // Redireciona para a homepage se o usuário não for admin
  if (!isAdmin) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="admin-panel-container">
      <h1>Painel Administrativo</h1>
      <div className="admin-panel">
        <button className="admin-button">Gerir Utilizadores</button>
        <button className="admin-button">Gerir Produtos</button>
        <button className="admin-button">Gerir Categorias</button>
        {/* Adicione mais funcionalidades aqui */}
      </div>
    </div>
  );
}

export default AdminPanel;
