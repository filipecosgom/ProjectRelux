import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/all"); // Endpoint para buscar todos os utilizadores
        setUsers(response.data);
      } catch (err) {
        setError("Erro ao carregar a lista de utilizadores.");
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleCardClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="user-list-container">
      <h1>Lista de Utilizadores</h1>
      <div className="user-list-cards-container">
        {users.map((user) => (
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
