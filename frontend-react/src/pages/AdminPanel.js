import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { FaUsersCog } from "react-icons/fa"; // Ícone para Gerir Utilizadores
import { TbBasketCog, TbBuildingCog } from "react-icons/tb"; // Ícones para Gerir Produtos e Categorias
import { FaRegEyeSlash, FaEye } from "react-icons/fa"; // Ícones para mostrar/ocultar senha
import "./AdminPanel.css";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const token = userStore((state) => state.token); // Obtém o token do usuário logado
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null); // Estado para controlar o painel ativo
  const [users, setUsers] = useState([]); // Estado para armazenar os utilizadores
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [showPasswords, setShowPasswords] = useState({}); // Estado para controlar a exibição das senhas

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

  // Alterna a exibição da senha para um utilizador específico
  const togglePasswordVisibility = (username) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [username]: !prevState[username],
    }));
  };

  // Função para criar um novo utilizador
  const handleCreateUser = () => {
    alert("Função para criar um novo utilizador ainda não implementada.");
  };

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
          <button className="create-user-button" onClick={handleCreateUser}>
            + Criar Novo Utilizador
          </button>
          {loading ? (
            <p>Carregando utilizadores...</p>
          ) : (
            <div className="users-cards-container">
              {users.map((user) => (
                <div className="user-card" key={user.username}>
                  {/* Primeira Coluna */}
                  <div className="user-card-column user-card-column-center">
                    <img
                      src={user.imagem || "https://via.placeholder.com/70"}
                      alt={user.username}
                      className="user-card-image"
                    />
                    <div className="user-card-info-line">
                      <p className="user-card-username">{user.username}</p>
                      <span className="user-card-role">
                        ({user.isAdmin ? "Admin" : "Utilizador"})
                      </span>
                      <span
                        className={`user-card-status ${
                          user.isDeleted ? "deleted" : "active"
                        }`}
                      >
                        {user.isDeleted ? (
                          <>
                            <span>❌</span> Inativo
                          </>
                        ) : (
                          <>
                            <span>✅</span> Ativo
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Segunda Coluna */}
                  <div className="user-card-column">
                    <p>
                      <strong>Nome completo:</strong> {user.firstName}{" "}
                      {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {user.phone}
                    </p>
                    <p>
                      <strong>Password:</strong>{" "}
                      <span className="password-mask">
                        {showPasswords[user.username]
                          ? user.password
                          : "*".repeat(user.password.length)}
                      </span>{" "}
                      <button
                        className="toggle-password-button"
                        onClick={() => togglePasswordVisibility(user.username)}
                      >
                        {showPasswords[user.username] ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
