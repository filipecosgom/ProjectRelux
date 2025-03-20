import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { userStore } from "../stores/UserStore";
import { FaUser, FaCheckCircle, FaRegEyeSlash } from "react-icons/fa";
import { GiAllSeeingEye } from "react-icons/gi"; // Ícone para mostrar a senha
import { MdCancel } from "react-icons/md";
import { ClipLoader } from "react-spinners"; // Spinner de carregamento
import "./Profile.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a exibição da senha
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Estado para alternar a exibição do painel administrativo
  const token = userStore((state) => state.token);
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const navigate = useNavigate(); // Hook para redirecionar o usuário

  // Redireciona para a homepage se o token for removido
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true }); // Redireciona para a homepage
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
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

        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  if (!userDetails) {
    return (
      <div className="loading-container">
        <ClipLoader color="#ffffff" size={30} /> {/* Spinner de carregamento */}
        <p>Carregando...</p> {/* Mensagem de carregamento */}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="Profile">
        <img src={userDetails.imagem} alt="Profile" className="profile-image" />
        <h1>
          {userDetails.firstName} {userDetails.lastName}
        </h1>
        <p>
          {userDetails.isAdmin ? "Admin" : "Utilizador"} <FaUser />
        </p>
        <div className="profile-details">
          <div className="profile-column">
            <p>Username: {userDetails.username}</p>
            <p>
              Password:{" "}
              {showPassword
                ? userDetails.password // Mostra a senha se showPassword for true
                : "*".repeat(userDetails.password.length)}{" "}
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)} // Alterna o estado de showPassword
              >
                {showPassword ? <FaRegEyeSlash /> : <GiAllSeeingEye />}
              </span>
            </p>
          </div>
          <div className="profile-column">
            <p>Email: {userDetails.email}</p>
            <p>Telefone: {userDetails.phone}</p>
          </div>
        </div>
        <p>
          Estado da conta:{" "}
          {userDetails.isDeleted ? (
            <>
              Inativa <MdCancel className="inactive-icon" />
            </>
          ) : (
            <>
              Activa <FaCheckCircle className="active-icon" />
            </>
          )}
        </p>

        {/* Botão e Painel Administrativo */}
        {isAdmin && (
          <div className="admin-panel-container">
            <button
              className="admin-panel-toggle"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              Painel Administrativo
            </button>
            {showAdminPanel && (
              <div className="admin-panel">
                <button className="admin-button">Gerir Utilizadores</button>
                <button className="admin-button">Gerir Produtos</button>
                <button className="admin-button">Gerir Categorias</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
