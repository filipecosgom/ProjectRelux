import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userStore as useUserStore } from "../../stores/UserStore";
import "./ProductDetails.css";
import EditProductModal from "./EditProductModal";

const ProductDetails = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const navigate = useNavigate(); // Hook de navegação
  const [product, setProduct] = useState(null); // Estado para armazenar o produto
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para controlar a mensagem de confirmação
  const token = useUserStore((state) => state.token); // Obtém o token do usuário
  const username = useUserStore((state) => state.username); // Obtém o username do usuário
  const isAdmin = useUserStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const [showEditModal, setShowEditModal] = useState(false); // Controla a visibilidade do modal
  const [editProduct, setEditProduct] = useState(null); // Armazena o produto a ser editado

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
    setEditProduct(product); // Define o produto atual como o produto a ser editado
    setShowEditModal(true); // Abre o modal
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

  const handleBuy = async () => {
    try {
      console.log("Token enviado:", token);
      console.log("Enviando estado:", { state: "COMPRADO" });
      await axios.put(
        `http://localhost:8080/filipe-proj4/rest/products/update-state/${id}`,
        { state: "COMPRADO" }, // Atualiza o estado para "COMPRADO"
        {
          headers: { Authorization: token },
          "Content-Type": "application/json",
        }
      );
      alert("Compra efetuada com sucesso!");
      navigate("/"); // Redireciona para a página inicial após a compra
    } catch (error) {
      console.error("Erro ao comprar produto:", error);
      alert("Erro ao comprar produto.");
    }
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();             // Evita o comportamento padrão do formulário
    try {
      await axios.put(
        `http://localhost:8080/filipe-proj4/rest/products/${editProduct.id}`,
        editProduct,
        {
          headers: { Authorization: token },
        }
      );
      alert("Produto atualizado com sucesso!");
      setShowEditModal(false);          // Fecha o modal
      setProduct(editProduct);          // Atualiza o produto exibido na página
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto. Tente novamente.");
    }
  };

  if (!product) {
    return <p>A carregar...</p>;
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
        {username === product.userAutor ? (
          <div className="product-actions">
            <button onClick={handleEdit}>Editar</button>
            <button onClick={handleDelete}>Excluir</button>
          </div>
        ) : (
          product.state !== "COMPRADO" && (
            <button
              onClick={() => {
                if (username) {
                  setShowConfirmation(true);
                } else {
                  alert("Necessita estar logado para comprar. Faça login aqui");
                  navigate("/Login");
                }
              }}
            >
              Comprar
            </button>
          )
        )}

        {showConfirmation && (
          <div className="confirmation-dialog">
            <p>Tem a certeza que deseja comprar {product.title}?</p>
            <button onClick={handleBuy}>Sim</button>
            <button onClick={() => setShowConfirmation(false)}>Não</button>
          </div>
        )}
      </div>
      {/* Modal de Edição */}
      {showEditModal && (
        <EditProductModal
          product={editProduct}
          categories={[product.category]} // Passa a categoria atual como única opção
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

export default ProductDetails;
