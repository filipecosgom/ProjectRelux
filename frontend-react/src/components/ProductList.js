import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RxDropdownMenu } from "react-icons/rx"; // Importa o ícone
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Estado para armazenar as categorias
  const [showCategories, setShowCategories] = useState(false); // Estado para controlar a exibição da lista de categorias
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

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/filipe-proj4/rest/categories/all"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`); // Redireciona para a página de detalhes do produto
  };

  return (
    <div className="product-list-container">
      {/* Ícone de categorias */}
      <div
        className="categories-container" // Contêiner que envolve o ícone e o dropdown
        onMouseEnter={() => setShowCategories(true)} // Exibe a lista ao passar o mouse
        onMouseLeave={() => setShowCategories(false)} // Oculta a lista ao sair do hover
      >
        <div className="categories-icon">
          <RxDropdownMenu size={24} /> {/* Ícone de menu dropdown */}
        </div>
        {showCategories && (
          <div className="categories-dropdown">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-item"
                onClick={() => navigate(`/category/${category.id}`)} // Redireciona para a página da categoria
              >
                {category.nome}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de produtos */}
      <div className="product-list">
        {products
          .filter((product) => product.state !== "COMPRADO") // Filtra produtos comprados
          .map((product) => (
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
    </div>
  );
}

export default ProductList;
