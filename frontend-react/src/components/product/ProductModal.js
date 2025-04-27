import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useLocation } from "react-router-dom"; // Importado para verificar mudanças na rota para fechar o modal
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import { userStore } from "../../stores/UserStore";
import "./ProductModal.css";
import { toast } from "react-toastify";

Modal.setAppElement("#root"); // Define o elemento principal para acessibilidade

const ProductModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: { id: "", name: "" },
    price: "",
    imagem: "",
    local: "",
    description: "",
    state: "DISPONIVEL",
  });
  const [categories, setCategories] = useState([]); // Lista de categorias para o dropdown
  const [priceError, setPriceError] = useState(""); // Erro de validação do preço

  const token = userStore((state) => state.token); // Obtém o token diretamente da store
  const isAdmin = userStore((state) => state.isAdmin); // Verifica se o usuário é admin
  const location = useLocation(); // Hook para monitorar mudanças na rota

  // Fecha o modal ao mudar de rota
  useEffect(() => {
    if (isOpen) {
      onClose(); // Fecha o modal apenas se ele estiver aberto
    }
  }, [location.pathname]); // Monitora apenas mudanças no pathname

  // Fecha o modal ao efetuar logout
  useEffect(() => {
    if (!token && isOpen) {
      onClose();
    }
  }, [token, isOpen, onClose]);

  // Busca as categorias ao carregar o modal
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/all"); // Faz o request com o serviço Axios
        // Ordena as categorias por nome antes de definir no estado
        const sortedCategories = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedCategories);
      } catch (error) {
        console.error(
          "Erro ao buscar categorias:",
          error.response?.data || error.message
        );
        toast.error("Erro ao carregar categorias. Tente novamente.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(value)
      );
      setFormData((prev) => ({
        ...prev,
        category: { id: selectedCategory.id, name: selectedCategory.name },
      }));
    } else if (name === "price") {
      // Validação do preço
      const priceRegex = /^\d+(\.\d{1,2})?$/; // Aceita números com até 2 casas decimais
      if (!priceRegex.test(value) && value !== "") {
        setPriceError(
          "O preço deve ser um número válido com até 2 casas decimais."
        );
      } else {
        setPriceError("");
      }
      setFormData((prev) => ({ ...prev, price: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token não encontrado. Por favor, faça login novamente.");
      return;
    }

    if (priceError) {
      toast.error("Corrija os erros antes de enviar o formulário.");
      return;
    }

    try {
      console.log("Token enviado:", token);
      console.log("Dados enviados:", formData);

      const response = await api.post("/products/add", formData); // Faz o request com o serviço Axios
      toast.success(response.data); // Exibe a mensagem de sucesso
      onClose(); // Fecha o modal
      window.location.reload(); // Atualiza a página para exibir o novo produto
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error.response?.data || error.message
      );
      toast.error("Erro ao criar produto. Tente novamente.");
    }
  };

  // Estados disponíveis com base no tipo de usuário
  const availableStates = isAdmin
    ? [
        { value: "RASCUNHO", label: "Rascunho" },
        { value: "DISPONIVEL", label: "Disponível" },
        { value: "RESERVADO", label: "Reservado" },
        { value: "COMPRADO", label: "Comprado" },
        { value: "APAGADO", label: "Apagado" },
      ]
    : [
        { value: "RASCUNHO", label: "Rascunho" },
        { value: "DISPONIVEL", label: "Disponível" },
      ];

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
          Categoria:
          <select
            name="categoryId"
            value={formData.category.id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preço:
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          {priceError && <span className="error-message">{priceError}</span>}
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
            {availableStates.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
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
