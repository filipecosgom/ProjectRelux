import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  console.log("Breadcrumbs renderizado. ID capturado pelo useParams:", id);
    const [product, setProduct] = useState(null);

    console.log("ID capturado pelo useParams: ", id);
    useEffect(() => {
    // Busca os detalhes do produto para obter o nome e a categoria
    const fetchProduct = async () => {
      if (id) {
        console.log("ID do produto:", id); // Log para depuração
        try {
          const response = await axios.get(
            `http://localhost:8080/filipe-proj4/rest/products/${id}`
          );
          console.log("Dados do produto:", response.data); // Log para depuração
          setProduct(response.data);
        } catch (error) {
          console.error("Erro ao buscar produto:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">
        Home
      </Link>
      {product ? (
        <>
          <span className="breadcrumb-separator">/</span>
          <Link
            to={`/category/${product.category.id}`}
            className="breadcrumb-link"
          >
            {product.category.nome}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.title}</span>
        </>
      ) : (
        <span className="breadcrumb-loading">Carregando...</span>
      )}
    </div>
  );
};

export default Breadcrumbs;
