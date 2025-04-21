import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import Recharts components
import api from "../services/apiService";
import EditUserModal from "../components/user/EditUserModal";
import "./UserProfile.css";

function UserProfile() {
  const { username } = useParams(); // Obtém o username da URL
  const [userProfile, setUserProfile] = useState(null);
  const [userProducts, setUserProducts] = useState([]); // Estado para armazenar os produtos do utilizador
  const [productStates, setProductStates] = useState([]); // Estado para os estados dos produtos
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

        // Calcula os estados dos produtos
const states = response.data.reduce((acc, product) => {
  acc[product.state] = (acc[product.state] || 0) + 1; // Usa o campo correto "state"
  return acc;
}, {});
        const stateData = Object.keys(states).map((key) => ({
          name: key,
          value: states[key],
        }));
        setProductStates(stateData);
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Cores para o gráfico de pizza

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
            <Link
              to={`/product/${product.id}`} // Redireciona para a página de detalhes do produto
              key={product.id}
              className="user-profile-product-card-link" // Classe para estilizar o link
            >
              <div className="user-profile-product-card">
                <img
                  src={product.imagem || "https://via.placeholder.com/100"}
                  alt={product.title}
                />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-price">Preço: {product.price}€</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Este utilizador não possui produtos.</p>
        )}
      </div>

      {/* Informações sobre os estados dos produtos */}
      <h2>Estados dos Produtos</h2>
      <div className="product-states-info">
        {productStates.map((state) => (
          <p key={state.name}>
            <strong>{state.name}:</strong> {state.value}
          </p>
        ))}
      </div>

      {/* Gráfico de Pizza */}
      <div className="product-states-chart">
        <PieChart width={400} height={400}>
          <Pie
            data={productStates}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {productStates.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

export default UserProfile;
