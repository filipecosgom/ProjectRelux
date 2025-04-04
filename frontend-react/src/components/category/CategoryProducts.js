import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import "../ProductList.css"; // Reutiliza os estilos do ProductList

function CategoryProducts() {
  const { categoryId } = useParams(); // Obtém o ID da categoria da URL
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        console.log("Buscando produtos da categoria:", categoryId); // Log para depuração
        const response = await api.get(`/products/category/${categoryId}`); // Faz o request com o serviço Axios
        console.log("Produtos recebidos:", response.data); // Log para depuração
        setProducts(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar produtos da categoria:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`); // Redireciona para a página de detalhes do produto
  };

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            className="product-card"
            key={product.id}
            onClick={() => handleCardClick(product.id)} // Torna o card clicável
          >
            <img
              src={product.imagem}
              alt={product.title}
              className="product-image"
            />
            <h2>{product.title}</h2>
            <p>Preço: {product.price} €</p>
            <p>Localização: {product.local}</p>
          </div>
        ))
      ) : (
        <p>Nenhum produto encontrado nesta categoria.</p>
      )}
    </div>
  );
}

export default CategoryProducts;
