import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Estado para os utilizadores filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/all"); // Endpoint para buscar todos os utilizadores
        setUsers(response.data);
        setFilteredUsers(response.data); // Inicializa os utilizadores filtrados
      } catch (err) {
        setError("Erro ao carregar a lista de utilizadores.");
      }
    };

    fetchUsers();
  }, []);

  // Atualiza os utilizadores filtrados com base no termo de pesquisa
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) // Adiciona a verificação por email
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleCardClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="user-list-container">
      <h1>Lista de Utilizadores</h1>

      {/* Caixa de texto para o filtro */}
      <div className="user-list-filter">
        <input
          type="text"
          placeholder="Filtrar por username ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="user-list-filter-input"
        />
        {searchTerm && (
          <button
            className="user-list-clear-button"
            onClick={() => setSearchTerm("")} // Limpa o conteúdo do filtro
          >
            X
          </button>
        )}
      </div>

      <div className="user-list-cards-container">
        {filteredUsers.map((user) => (
          <div
            className="user-card"
            key={user.username}
            onClick={() => handleCardClick(user.username)}
          >
            {/* Primeira coluna: Imagem do utilizador */}
            <div className="user-imagem">
              <img
                src={user.imagem || "https://via.placeholder.com/50"}
                alt={user.username}
                className="user-card-image"
              />
            </div>

            {/* Segunda coluna: Informações do utilizador */}
            <div className="user-card-info">
              <span className="user-card-username">
                <strong>Username:</strong> {user.username}
              </span>
              <span>
                <strong>Nome completo:</strong> {user.firstName} {user.lastName}
              </span>
              <span>
                <strong>Email:</strong> {user.email}
              </span>
              <span>
                <strong>Tipo de user:</strong>{" "}
                {user.isAdmin ? "Admin" : "Utilizador"}
              </span>
              <span
                className={`user-card-status ${
                  user.isDeleted ? "deleted" : "active"
                }`}
              >
                <strong>Ativo:</strong> {user.isDeleted ? "Não" : "Sim"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
