import React, { useState } from "react";
import api from "../../services/apiService";
import { toast } from "react-toastify";
import "./ChangePasswordModal.css";

function ChangePasswordModal({ isVisible, onClose, authToken }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log("Token de autenticação recebido no modal:", authToken);

  const handleChangePassword = async (event) => {
    event.preventDefault();

    // Verifica se as senhas coincidem
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem. Tente novamente.");
      return;
    }

    try {
      // Solicita ao backend a geração do token de redefinição
      const response = await api.post("/users/recover-password", null, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Envia o token de autenticação no cabeçalho
        },
      });

      // Verifica a resposta do backend
      console.log("Resposta do backend para /recover-password:", response.data);

      const recoveryToken = response.data.recoveryToken || response.data.token; // Certifique-se de usar o nome correto

      if (!recoveryToken) {
        throw new Error("Token de redefinição não foi gerado pelo backend.");
      }

      // Faz a requisição para redefinir a senha usando o token de redefinição
      await api.post(
        `/users/reset-password?token=${recoveryToken}&newPassword=${newPassword}`
      );

      toast.success("Senha alterada com sucesso!");
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(
        "Erro ao alterar a senha:",
        error.response?.data || error.message
      );
      toast.error("Erro ao alterar a senha. Tente novamente.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="change-password-modal">
      <div className="modal-content">
        <h2>Alterar Senha</h2>
        <form onSubmit={handleChangePassword}>
          <label>
            Nova Senha:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirme a Nova Senha:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit">Alterar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
