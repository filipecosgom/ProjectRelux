import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore"; // Ajuste o caminho conforme necessário

const SessionManager = ({ children }) => {
  const sessionTimeout = 1; // Tempo de expiração em minutos
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Sessão expirada. Você será desconectado.");
        userStore.getState().clearUser();
        navigate("/login");
      }, sessionTimeout * 60 * 1000); // Converta minutos para milissegundos
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, sessionTimeout]);

  return <>{children}</>;
};

export default SessionManager;
