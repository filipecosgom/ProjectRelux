import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/apiService";
import { toast } from "react-toastify";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const token = searchParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Faz a requisição para redefinir a senha
      await api.post(
        `/users/reset-password?token=${token}&newPassword=${newPassword}`
      );
      toast.success("Senha redefinida com sucesso!");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error("Erro ao redefinir senha.");
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Redefinir Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Insira a nova password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Redefinir</button>
      </form>
    </div>
  );
}

export default ResetPassword;
