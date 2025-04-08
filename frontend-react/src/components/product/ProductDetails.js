import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import { userStore as useUserStore } from "../../stores/UserStore";
import "./ProductDetails.css";
import EditProductModal from "./EditProductModal";
import { toast } from "react-toastify";

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
        const response = await api.get(`/products/${id}`); // Faz o request com o serviço Axios
        setProduct(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar produto:",
          error.response?.data || error.message
        );
        toast.error("Produto não encontrado!");
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
      await api.delete(`/products/${id}`); // Faz o request com o serviço Axios
      toast.success("Produto excluído com sucesso!");
      navigate("/"); // Redireciona para a página inicial após a exclusão
    } catch (error) {
      console.error(
        "Erro ao excluir produto:",
        error.response?.data || error.message
      );
      toast.error("Erro ao excluir produto.");
    }
  };

  const handleBuy = async () => {
    try {
      console.log("Token enviado:", token);
      console.log("Enviando estado:", { state: "COMPRADO" });
      await api.put(`/products/update-state/${id}`, { state: "COMPRADO" }); // Faz o request com o serviço Axios
      toast.success("Compra efetuada com sucesso!");
      navigate("/"); // Redireciona para a página inicial após a compra
    } catch (error) {
      console.error(
        "Erro ao comprar produto:",
        error.response?.data || error.message
      );
      toast.error("Erro ao comprar produto.");
    }
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    try {
      await api.put(`/products/${editProduct.id}`, editProduct); // Faz o request com o serviço Axios
      toast.success("Produto atualizado com sucesso!");
      setShowEditModal(false); // Fecha o modal
      setProduct(editProduct); // Atualiza o produto exibido na página
    } catch (error) {
      console.error(
        "Erro ao atualizar produto:",
        error.response?.data || error.message
      );
      toast.error("Erro ao atualizar produto. Tente novamente.");
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
                  toast.error("Necessita estar logado para comprar. Faça login aqui");
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
