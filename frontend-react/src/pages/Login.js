import React, { useState } from "react";
import "../pages/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../stores/UserStore";

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
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const token = await response.text();
      return token;
    } catch (error) {
      throw error;
    }
  };

  const getUserDetails = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userDetails = await response.json();
      return userDetails;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      </div>
    </div>
  );
}

export default Login;
