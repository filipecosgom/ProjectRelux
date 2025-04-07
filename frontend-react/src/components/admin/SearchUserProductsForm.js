import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import api from "../../services/apiService";
import "./SearchUserProductsForm.css";

const SearchUserProductsForm = () => {
  const [username, setUsername] = useState(""); // Nome do usuário para pesquisa
  const [userProducts, setUserProducts] = useState([]); // Produtos do usuário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar

  // Função para buscar produtos de um usuário
  const fetchUserProducts = async () => {
    if (!username.trim()) {
      setError("Por favor, insira um nome de usuário.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/products/user-products/${username}`);
      setUserProducts(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar produtos do usuário:",
        error.response?.data || error.message
      );
      setError("Erro ao buscar produtos. Verifique o nome do usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Função para redirecionar para a página de detalhes do produto
  const handleCardClick = (id) => {
    navigate(`/product/${id}`); // Redireciona para a página de detalhes do produto
  };

  return (
    <div className="search-user-products-container">
      <h2>Pesquisar Produtos de Usuário</h2>
      <div className="search-user-products">
        <input
          type="text"
          placeholder="Digite o nome do usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={fetchUserProducts}>Pesquisar</button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="products-cards-container">
          {userProducts.length > 0 ? (
            userProducts.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => handleCardClick(product.id)} // Torna o card clicável
              >
                <div className="product-card-column">
                  <img
                    src={product.imagem || "https://via.placeholder.com/70"}
                    alt={product.title}
                    className="product-card-image"
                  />
                  <h3>{product.title}</h3>
                  <p>
                    <strong>Categoria:</strong> {product.category.nome}
                  </p>
                  <p>
                    <strong>Preço:</strong> {product.price} €
                  </p>
                  <p>
                    <strong>Estado:</strong> {product.state}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado para este usuário.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserProductsForm;
