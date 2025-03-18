import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userStore } from "../../stores/UserStore";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const token = userStore((state) => state.token);
  const username = userStore((state) => state.username);
  const isAdmin = userStore((state) => state.isAdmin);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/filipe-proj4/rest/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        alert("Produto não encontrado!");
        navigate("/"); // Redireciona para a página inicial se o produto não for encontrado
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleEdit = () => {
    // Lógica para editar o produto
    alert("Função de edição ainda não implementada.");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/filipe-proj4/rest/products/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      alert("Produto excluído com sucesso!");
      navigate("/"); // Redireciona para a página inicial após a exclusão
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  };

  if (!product) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="product-details">
      <div className="product-image-column">
        <img src={product.imagem} alt={product.title} />
      </div>
      <div className="product-info-column">
        <h1>{product.title}</h1>
        <p>
          <strong>Categoria:</strong> {product.category.nome}
        </p>
        <p>
          <strong>Preço:</strong> {product.price}€
        </p>
        <p>
          <strong>Localização:</strong> {product.local}
        </p>
        <p>
          <strong>Descrição:</strong> {product.description}
        </p>
        <p>
          <strong>Estado:</strong> {product.state}
        </p>
        <p>
          <strong>Autor:</strong> {product.userAutor}
        </p>
        {(isAdmin || username === product.userAutor) && (
          <div className="product-actions">
            <button onClick={handleEdit}>Editar</button>
            <button onClick={handleDelete}>Excluir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
