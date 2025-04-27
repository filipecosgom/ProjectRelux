import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore"; // Ajuste o caminho conforme necessário
import api from "../services/apiService"; // Serviço Axios configurado

const SessionManager = ({ children }) => {
  const [sessionTimeout, setSessionTimeout] = useState(30); // Valor padrão inicial
  const navigate = useNavigate();
  const token = userStore((state) => state.token); // Obtém o token do usuário logado

  useEffect(() => {
    // Busca o valor do timeout do backend somente se o usuário estiver logado
    const fetchSessionTimeout = async () => {
      if (!token) return; // Não faz o fetch se não houver token

      try {
        const response = await api.get("/admin/settings/session-timeout", {
          headers: {
            Authorization: token, // Usa o token do usuário logado
          },
        });
        setSessionTimeout(response.data.timeout); // Atualiza o estado com o valor do backend
      } catch (error) {
        console.error("Erro ao buscar o tempo de expiração:", error);
      }
    };

    fetchSessionTimeout();
  }, [token]); // Executa o fetch apenas quando o token mudar

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Sessão expirada. Você será desconectado.");
        userStore.getState().clearUser(); // Limpa o estado do usuário
        navigate("/login"); // Redireciona para a página de login
      }, sessionTimeout * 60 * 1000); // Converte minutos para milissegundos
    };

    if (token) {
      // Apenas configura o timer se o usuário estiver logado
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      resetTimer(); // Inicializa o timer
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, sessionTimeout, token]); // Reconfigura o timer quando o token ou o timeout mudar

  return <>{children}</>;
};

export default SessionManager;
