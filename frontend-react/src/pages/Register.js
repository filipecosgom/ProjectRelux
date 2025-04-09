import React, { useState } from "react";
import "../pages/Register.css";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import api from "../services/apiService"; // Importa o serviço Axios configurado
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    try {
      console.log("Enviando dados:", inputs); // Log dos dados enviados
      const response = await api.post("/users/register", inputs); // Faz o request com o serviço Axios configurado
      console.log("Resposta recebida:", response.data); // Log da resposta recebida
      alert(
        `Registro realizado com sucesso!\nEnviado: ${JSON.stringify(
          inputs
        )}\nResposta recebida: ${response.data}`
      ); // Alerta o usuário
      navigate("/login", { replace: true }); // Navega para a página de login
    } catch (error) {
      console.error("Erro no registro:", error.response?.data || error.message); // Log do erro
      setError("Falha no registro. Verifique os dados e tente novamente."); // Define a mensagem de erro
      alert(
        `Falha no registro!\nEnviado: ${JSON.stringify(inputs)}\nErro: ${
          error.response?.data || error.message
        }`
      ); // Alerta o usuário
    }
  };

  return (
    <div className="register-container">
      <div className="Register">
        <h1>
          <FaUserPlus />
          Register new user
        </h1>
        {error && <p className="error">{error}</p>}{" "}
        {/* Exibe a mensagem de erro, se houver */}
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              defaultValue={inputs.username || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              defaultValue={inputs.password || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            First name:
            <input
              type="text"
              name="firstName"
              defaultValue={inputs.firstName || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last name:
            <input
              type="text"
              name="lastName"
              defaultValue={inputs.lastName || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              defaultValue={inputs.email || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              defaultValue={inputs.phone || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="imagem"
              defaultValue={inputs.imagem || ""}
              onChange={handleChange}
              required
            />
          </label>
          <input type="submit" value="Register" />
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
