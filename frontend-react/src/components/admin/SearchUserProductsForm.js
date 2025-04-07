import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import api from "../../services/apiService";
import EditProductModal from "../product/EditProductModal"; // Importa o modal de edição
import "./SearchUserProductsForm.css";

const SearchUserProductsForm = () => {
  const [username, setUsername] = useState(""); // Nome do usuário para pesquisa
  const [userProducts, setUserProducts] = useState([]); // Produtos do usuário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Controla a visibilidade do modal de edição
  const [editProduct, setEditProduct] = useState(null); // Produto a ser editado
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

  // Função para abrir o modal de edição
  const handleEditProduct = (product) => {
    setEditProduct(product); // Define o produto a ser editado
    setShowEditModal(true); // Abre o modal
  };

  // Função para salvar as alterações do produto
  const handleSaveProduct = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    try {
      await api.put(`/products/${editProduct.id}`, editProduct); // Faz o request com o serviço Axios
      alert("Produto atualizado com sucesso!");
      setShowEditModal(false); // Fecha o modal
      fetchUserProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error(
        "Erro ao atualizar produto:",
        error.response?.data || error.message
      );
      alert("Erro ao atualizar produto. Tente novamente.");
    }
  };

  // Função para apagar um produto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar este produto?")) return;

    try {
      await api.delete(`/products/${id}`); // Faz o request com o serviço Axios
      alert("Produto apagado com sucesso!");
      fetchUserProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error(
        "Erro ao apagar produto:",
        error.response?.data || error.message
      );
      alert("Erro ao apagar produto. Tente novamente.");
    }
  };

  return (
    <div className="search-user-products-container">
      {/* Formulário de Pesquisa */}
      <div className="search-user-products-form">
        <h2>Pesquisar Produtos de Usuário</h2>
        <div className="search-user-products">
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome do usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchUserProducts}>
            Pesquisar
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Lista de Produtos */}
      <div className="products-cards-wrapper">
        {loading ? (
          <p>Carregando produtos...</p>
        ) : userProducts.length > 0 ? (
          <div className="products-cards-container">
            {userProducts.map((product) => (
              <div className="user-product-card" key={product.id}>
                <img
                  src={product.imagem || "https://via.placeholder.com/70"}
                  alt={product.title}
                  className="user-product-card-img"
                />
                <div className="user-product-card-body">
                  <h5 className="user-product-card-title">{product.title}</h5>
                  <p className="user-product-card-text">
                    <strong>Categoria:</strong> {product.category.nome}
                  </p>
                  <p className="user-product-card-text">
                    <strong>Preço:</strong> {product.price} €
                  </p>
                  <p className="user-product-card-text">
                    <strong>Estado:</strong> {product.state}
                  </p>
                  <div className="user-product-card-actions">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum produto encontrado para este usuário.</p>
        )}
      </div>

      {/* Modal de Edição */}
      {showEditModal && (
        <EditProductModal
          product={editProduct}
          categories={[editProduct.category]} // Passa a categoria atual como única opção
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)} // Fecha o modal
          onSave={handleSaveProduct} // Salva as alterações
          onChange={setEditProduct} // Atualiza o estado do produto durante a edição
          error={null} // Pode adicionar lógica para exibir erros, se necessário
        />
      )}
    </div>
  );
};

export default SearchUserProductsForm;
