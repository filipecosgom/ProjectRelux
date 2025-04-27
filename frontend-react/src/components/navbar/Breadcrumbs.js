import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const { id, categoryId, username } = useParams(); // Obtém os parâmetros da URL
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Se estivermos na rota de detalhes do produto, buscar os dados do produto
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`); // Faz o request com o serviço Axios
          setProduct(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar produto:",
            error.response?.data || error.message
          );
        }
      };

      fetchProduct();
    }

    // Se estivermos na rota de uma categoria, buscar os dados da categoria
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await api.get(`/categories/${categoryId}`); // Faz o request com o serviço Axios
          setCategory(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar categoria:",
            error.response?.data || error.message
          );
        }
      };

      fetchCategory();
    }
  }, [id, categoryId]);

  // Renderizar breadcrumbs para a página de utilizadores
  if (window.location.pathname === "/users") {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Utilizadores</span>
      </div>
    );
  }

  // Renderizar breadcrumbs para a página de perfil do usuário
  if (username) {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/users" className="breadcrumb-link">
          Utilizadores
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{username}</span>
      </div>
    );
  }

  // Renderizar breadcrumbs para a página inicial
  if (!id && !categoryId) {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
      </div>
    );
  }

  // Renderizar breadcrumbs para a página de categoria
  if (categoryId && category) {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{category.name}</span>
      </div>
    );
  }

  // Renderizar breadcrumbs para a página de detalhes do produto
  if (id && product) {
    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link
          to={`/category/${product.category.id}`} // Redireciona para a rota da categoria
          className="breadcrumb-link"
        >
          {product.category.name}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </div>
    );
  }

  // Renderizar "Carregando..." enquanto os dados estão sendo buscados
  return (
    <div className="breadcrumbs">
      <span className="breadcrumb-loading">Carregando...</span>
    </div>
  );
};

export default Breadcrumbs;
