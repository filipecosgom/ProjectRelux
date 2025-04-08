import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { userStore } from "../stores/UserStore";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ClipLoader } from "react-spinners"; // Spinner de carregamento
import "./Profile.css";
import EditUserModal from "../components/user/EditUserModal"; // Modal de edição de utilizador
import { updateUser } from "../services/userService";
import api from "../services/apiService"; // Importa o serviço Axios
import { toast } from "react-toastify";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a exibição da senha
  const token = userStore((state) => state.token);
  const navigate = useNavigate(); // Hook para redirecionar o usuário
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar/ocultar o modal de edição
  const [editUser, setEditUser] = useState(null); // Estado para armazenar o utilizador a ser editado

  // Redireciona para a homepage se o token for removido
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true }); // Redireciona para a homepage
    }
  }, [token, navigate]);

  // Atualiza o método fetchUserDetails para usar Axios
  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/users/me"); // Faz o request com o serviço Axios
      setUserDetails(response.data); // Atualiza o estado com os detalhes do usuário
    } catch (error) {
      console.error(
        "Erro ao buscar detalhes do usuário:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const handleEditProfile = () => {
    console.log("A abrir o modal de edição...");
    setEditUser(userDetails); // Define os detalhes do utilizador como o utilizador a ser editado
    setShowEditModal(true); // Abre o modal

  };

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
        <button className="edit-profile-button" onClick={handleEditProfile}>
          Editar Perfil
        </button>
      </div>
      {showEditModal && (
        <EditUserModal
          user={editUser}
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)} // Fecha o modal
          onSave={async (e) => {
            e.preventDefault(); // Evita o comportamento padrão do formulário
            try {
              // Chama o serviço para atualizar o utilizador
              const updatedUser = await updateUser(editUser, token);

              // Atualiza o estado do utilizador, preservando as propriedades existentes
              setUserDetails((prevDetails) => ({
                ...prevDetails,
                ...updatedUser,
              }));

              // Exibe uma mensagem de sucesso
              toast.success("Perfil atualizado com sucesso!");

              // Fecha o modal
              setShowEditModal(false);

              // Faz um novo pedido para buscar os dados atualizados do utilizador
              fetchUserDetails();
            } catch (error) {
              // Exibe uma mensagem de erro, caso algo dê errado
              console.error("Erro ao atualizar o perfil:", error);
              toast.error("Erro ao atualizar o perfil. Tente novamente.");
            }
          }}
          onChange={(e) => {
            const { name, value } = e.target;
            setEditUser((prev) => ({ ...prev, [name]: value }));
          }}
          error={null}
        />
      )}
    </div>
  );
}

export default Profile;
