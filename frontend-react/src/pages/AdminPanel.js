import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { FaUsersCog, FaEdit, FaTrash } from "react-icons/fa";
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
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal de edição
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para controlar o modal de criação
  const [editUser, setEditUser] = useState(null); // Estado para o utilizador a ser editado
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imagem: "",
    isAdmin: false,
  }); // Estado para o novo utilizador
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
      await axios.post(
        "http://localhost:8080/filipe-proj4/rest/users/register",
        newUser,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(`O utilizador ${newUser.username} foi criado com sucesso!`);
      setShowCreateModal(false); // Fecha o modal
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error("Erro ao criar utilizador:", error);
      setError(
        error.response?.data || "Erro ao criar utilizador. Tente novamente."
      );
    }
  };

  // Função para lidar com mudanças nos campos do formulário de criação
  const handleNewUserChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Função para apagar um utilizador
  const handleDeleteUser = async (username) => {
    if (
      !window.confirm(`Tem certeza que deseja apagar o utilizador ${username}?`)
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/filipe-proj4/rest/users/delete/${username}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(`O utilizador ${username} foi apagado com sucesso!`);
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error("Erro ao apagar utilizador:", error);
      alert("Erro ao apagar utilizador. Tente novamente.");
    }
  };

  // Função para abrir o modal de edição
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  // Função para salvar as alterações do utilizador
  const handleSaveUser = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await axios.put(
        "http://localhost:8080/filipe-proj4/rest/users/update",
        editUser,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(`O utilizador ${editUser.username} foi atualizado com sucesso!`);
      setShowModal(false); // Fecha o modal
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
      setError(
        error.response?.data || "Erro ao atualizar utilizador. Tente novamente."
      );
    }
  };

  // Função para lidar com mudanças nos campos do formulário de edição
  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditUser((prevState) => ({
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
            onClick={() => setShowCreateModal(true)}
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
                    <div className="user-card-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.username)}
                      >
                        <FaTrash /> Apagar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Criação de Utilizador */}
      {showCreateModal && (
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
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imagem"
                  value={newUser.imagem}
                  onChange={handleNewUserChange}
                />
              </label>
              <label>
                Admin:
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={newUser.isAdmin}
                  onChange={handleNewUserChange}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Utilizador */}
      {showModal && editUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Utilizador</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSaveUser}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={editUser.username}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={editUser.password}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={editUser.firstName}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={editUser.lastName}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={editUser.phone}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imagem"
                  value={editUser.imagem}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Admin:
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={editUser.isAdmin}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Ativo:
                <input
                  type="checkbox"
                  name="isDeleted"
                  checked={!editUser.isDeleted}
                  onChange={(e) =>
                    handleEditChange({
                      target: {
                        name: "isDeleted",
                        value: !e.target.checked,
                      },
                    })
                  }
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Salvar</button>
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
