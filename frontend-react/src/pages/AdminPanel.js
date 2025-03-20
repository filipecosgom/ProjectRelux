import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { FaUsersCog } from "react-icons/fa"; // Ícone para Gerir Utilizadores
import { TbBasketCog, TbBuildingCog } from "react-icons/tb"; // Ícones para Gerir Produtos e Categorias
import "./AdminPanel.css";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const token = userStore((state) => state.token); // Obtém o token do usuário logado
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null); // Estado para controlar o painel ativo
  const [users, setUsers] = useState([]); // Estado para armazenar os utilizadores
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

  // Redireciona para a homepage se o usuário não for admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  // Função para buscar todos os utilizadores
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar utilizadores");
      }

      const data = await response.json();
      setUsers(data); // Atualiza o estado com os utilizadores
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
      alert("Erro ao carregar utilizadores. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Busca os utilizadores ao abrir o painel de "Gerir Utilizadores"
  useEffect(() => {
    if (activePanel === "users") {
      fetchUsers();
    }
  }, [activePanel, token]);

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

      {/* Painel de Gerir Utilizadores */}
      {activePanel === "users" && (
        <div className="admin-panel-content">
          <h2>Gerir Utilizadores</h2>
          {loading ? (
            <p>Carregando utilizadores...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Admin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.isAdmin ? "Sim" : "Não"}</td>
                    <td>{user.isDeleted ? "Inativo" : "Ativo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Painéis de Gerir Produtos e Categorias */}
      {activePanel === "products" && (
        <div className="admin-panel-content">
          <h2>Gerir Produtos</h2>
          <p>Aqui você pode adicionar, editar ou remover produtos.</p>
        </div>
      )}
      {activePanel === "categories" && (
        <div className="admin-panel-content">
          <h2>Gerir Categorias</h2>
          <p>Aqui você pode adicionar, editar ou remover categorias.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
