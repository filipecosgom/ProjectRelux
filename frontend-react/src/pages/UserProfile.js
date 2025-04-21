import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/apiService";
import EditUserModal from "../components/user/EditUserModal";
import "./UserProfile.css";

function UserProfile() {
  const { username } = useParams(); // Obtém o username da URL
  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("mystore"); // Obtém o token do sessionStorage
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get(`/users/profile/${username}`, {
          headers,
        });
        setUserProfile(response.data);
      } catch (err) {
        setError("Utilizador não encontrado");
      }
    };

    fetchProfile();
  }, [username]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userProfile) {
    return <div>Carregando...</div>;
  }

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  return (
    <div className="user-profile-container">
      <h1>Perfil de {userProfile.username}</h1>
      <img src={userProfile.imagem} alt="Profile" className="profile-image" />
      <p>
        Nome: {userProfile.firstName} {userProfile.lastName}
      </p>
      <p>Email: {userProfile.email}</p>
      <p>Telefone: {userProfile.phone}</p>
      {userProfile.canEdit && (
        <button onClick={handleEditProfile}>Editar Perfil</button>
      )}
      {showEditModal && (
        <EditUserModal
          user={userProfile}
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={async (e) => {
            e.preventDefault();
            try {
              const token = sessionStorage.getItem("mystore"); // Obtém o token do sessionStorage
              const response = await api.put("/users/update", userProfile, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setUserProfile(response.data);
              setShowEditModal(false);
            } catch (error) {
              console.error("Erro ao atualizar o perfil:", error);
            }
          }}
          onChange={(e) => {
            const { name, value } = e.target;
            setUserProfile((prev) => ({ ...prev, [name]: value }));
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;
