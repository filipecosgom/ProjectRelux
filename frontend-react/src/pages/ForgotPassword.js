import React, { useState } from "react";
import api from "../services/apiService";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Faz a requisição para o backend
      await api.post(`/users/recover-password?email=${email}`);
      toast.success(
        "Link de recuperação gerado. Verifique a consola do backend."
      );
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast.error("Erro ao solicitar recuperação de senha.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Esqueceu a sua password?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Insira o seu email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
