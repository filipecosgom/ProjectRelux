import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/filipe-proj4/rest/products/${id}`
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Erro ao buscar produto:", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  // Se não houver ID, exiba apenas "Home"
  if (!id) {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
      </div>
    );
  }

  // Se o produto ainda não foi carregado, exiba "Carregando..."
  if (!product) {
    return (
      <div className="breadcrumbs">
        <span className="breadcrumb-loading">Carregando...</span>
      </div>
    );
  }

  // Exiba os breadcrumbs completos quando o produto for carregado
  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">
        Home
      </Link>
      <span className="breadcrumb-separator">/</span>
      <Link to={`/category/${product.category.id}`} className="breadcrumb-link">
        {product.category.nome}
      </Link>
      <span className="breadcrumb-separator">/</span>
      <span className="breadcrumb-current">{product.title}</span>
    </div>
  );
};

export default Breadcrumbs;
