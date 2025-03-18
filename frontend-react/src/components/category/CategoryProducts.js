import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { userStore } from "../../stores/UserStore";
import "../ProductList.css"; // Reutiliza os estilos do ProductList

function CategoryProducts() {
  const { categoryId } = useParams(); // Obtém o ID da categoria da URL
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = userStore((state) => state.token);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/filipe-proj4/rest/products/category/${categoryId}`,
        {
            headers: {
              Authorization: token, // Envia o token no cabeçalho
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos da categoria:", error);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, token]);

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
