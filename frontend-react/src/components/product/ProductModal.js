import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./ProductModal.css";
import { userStore } from "../../stores/UserStore";

Modal.setAppElement("#root"); // Define o elemento principal para acessibilidade

const ProductModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: { id: "", nome: "" },
    price: "",
    imagem: "",
    local: "",
    description: "",
    state: "DISPONIVEL",
  });

  const token = userStore((state) => state.token); // Obtém o token diretamente da store

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        category: { ...prev.category, id: value },
      }));
    } else if (name === "categoryName") {
      setFormData((prev) => ({
        ...prev,
        category: { ...prev.category, nome: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Token não encontrado. Por favor, faça login novamente.");
      return;
    }

    try {
      console.log("Token enviado:", token);
      console.log("Dados enviados:", formData);

      const response = await axios.post(
        "http://localhost:8080/filipe-proj4/rest/products/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      alert(response.data); // Exibe a mensagem de sucesso
      onClose(); // Fecha o modal
      window.location.reload(); // Atualiza a página para exibir o novo produto
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Tente novamente.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="product-modal"
      overlayClassName="product-modal-overlay"
    >
      <h2>Criar Novo Produto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Categoria ID:
          <input
            type="number"
            name="categoryId"
            value={formData.category.id}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Categoria Nome:
          <input
            type="text"
            name="categoryName"
            value={formData.category.nome}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          URL da Imagem:
          <input
            type="text"
            name="imagem"
            value={formData.imagem}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Localização:
          <input
            type="text"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Estado:
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADO">Reservado</option>
            <option value="COMPRADO">Comprado</option>
            <option value="APAGADO">Apagado</option>
          </select>
        </label>
        <button type="submit">Criar Produto</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </Modal>
  );
};

export default ProductModal;
