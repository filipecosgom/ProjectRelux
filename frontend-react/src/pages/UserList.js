import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/apiService";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="user-list-container">
      <h1>Lista de Utilizadores</h1>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            <Link to={`/profile/${user.username}`}>
              {user.firstName} {user.lastName} ({user.username})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
