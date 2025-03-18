import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/filipe-proj4/rest/products/"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`); // Redireciona para a página de detalhes do produto
  };

  return (
    <div className="product-list">
      {products.map((product) => (
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
      ))}
    </div>
  );
}

export default ProductList;
