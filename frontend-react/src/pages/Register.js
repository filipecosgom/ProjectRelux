import React, { useState } from "react";
import "../pages/Register.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Função para fazer o pedido REST de registro
  const registerUser = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.text();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      console.log("Enviando dados:", inputs); // Loga os dados enviados
      const response = await registerUser(inputs); // Chama a função de registro
      console.log("Resposta recebida:", response); // Loga a resposta recebida
      alert(
        `Registro bem-sucedido!\nEnviado: ${JSON.stringify(
          inputs
        )}\nResposta recebida: ${response}`
      ); // Alerta para o utilizador
      navigate("/login", { replace: true }); // Navega para a página de login
    } catch (error) {
      console.error("Erro no registro:", error); // Loga o erro
      setError("Registration failed. Please check your details and try again."); // Define a mensagem de erro
      alert(
        `Registro falhado!\nEnviado: ${JSON.stringify(inputs)}\nErro: ${
          error.message
        }`
      ); // Alerta para o utilizador
    }
  };

  return (
    <div className="register-container">
      <div className="Register">
        <h1>Register new user</h1>
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
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              defaultValue={inputs.password || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            First name:
            <input
              type="text"
              name="firstName"
              defaultValue={inputs.firstName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Last name:
            <input
              type="text"
              name="lastName"
              defaultValue={inputs.lastName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              defaultValue={inputs.email || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              defaultValue={inputs.phone || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="imagem"
              defaultValue={inputs.imagem || ""}
              onChange={handleChange}
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
