import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { FaUsersCog } from "react-icons/fa";
import { TbBasketCog, TbBuildingCog } from "react-icons/tb";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import "./AdminPanel.css";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin);
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imagem: "",
    isAdmin: false,
  }); // Estado para os dados do novo utilizador
  const [error, setError] = useState(null);

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
      const response = await axios.get(
        "http://localhost:8080/filipe-proj4/rest/users/all",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUsers(response.data);
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
  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError(null);

    // Validação simples
    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.email ||
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.phone
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/filipe-proj4/rest/users/register",
        newUser,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(`O utilizador ${newUser.username} foi criado com sucesso!`);
      setShowModal(false); // Fecha o modal
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error("Erro ao criar utilizador:", error);
      setError(
        error.response?.data || "Erro ao criar utilizador. Tente novamente."
      );
    }
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          <button
            className="create-user-button"
            onClick={() => setShowModal(true)}
          >
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

      {/* Modal de Criação de Utilizador */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Criar Novo Utilizador</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleCreateUser}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imagem"
                  value={newUser.imagem}
                  onChange={handleChange}
                />
              </label>
              <label>
                Admin:
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={newUser.isAdmin}
                  onChange={handleChange}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
