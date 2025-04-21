import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/apiService";
import EditUserModal from "../components/user/EditUserModal";
import "./UserProfile.css";

function UserProfile() {
  const { username } = useParams(); // Obtém o username da URL
  const [userProfile, setUserProfile] = useState(null);
  const [userProducts, setUserProducts] = useState([]); // Estado para armazenar os produtos do utilizador
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

    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("mystore"); // Obtém o token do sessionStorage
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get(`/products/user-products/${username}`, {
          headers,
        });
        setUserProducts(response.data); // Armazena os produtos no estado
      } catch (err) {
        console.error("Erro ao carregar os produtos do utilizador:", err);
      }
    };

    fetchProfile();
    fetchProducts();
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

      {/* Lista de Produtos do Utilizador */}
      <h2>Produtos de {userProfile.username}</h2>
      <div className="user-products-container">
        {userProducts.length > 0 ? (
          userProducts.map((product) => (
            <div key={product.id} className="user-profile-product-card">
              <img
                src={product.imagem || "https://via.placeholder.com/100"}
                alt={product.title}
              />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-price">Preço: {product.price}€</p>
              </div>
            </div>
          ))
        ) : (
          <p>Este utilizador não possui produtos.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
