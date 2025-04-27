import React, { useState } from "react";
import "../pages/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import api from "../services/apiService";

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const updateUser = userStore((state) => state.updateUser);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const loginUser = async (username, password) => {
    try {
      const response = await api.post("/users/login", { username, password });
      return response.data; // Retorna o token
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      throw error;
    }
  };

  const getUserDetails = async (token) => {
    try {
      const response = await api.get("/users/me", {
        headers: {
          Authorization: token,
        },
      });
      return response.data; // Retorna os detalhes do usuário
    } catch (error) {
      console.error(
        "Erro ao buscar detalhes do usuário:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputs.username || !inputs.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    try {
      console.log("Enviando dados para login:", inputs);
      const token = await loginUser(inputs.username, inputs.password);
      const userDetails = await getUserDetails(token);

      // Atualiza a store com os dados do usuário, incluindo isAdmin
      updateUser(
        userDetails.username,
        token,
        userDetails.imagem,
        userDetails.isAdmin
      );
      console.log("Token recebido:", token);
      console.log("Detalhes do usuário recebidos:", userDetails);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Login falhou. Verifique suas credenciais.");
    }
  };

  return (
    <div className="login-container">
      <div className="Login">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Enter your username:
            <input
              type="text"
              name="username"
              value={inputs.username || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your password:
            <input
              type="password"
              name="password"
              value={inputs.password || ""}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Login" />
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <Link to="/forgot-password">Esqueceu a sua password?</Link>
      </div>
    </div>
  );
}

export default Login;
