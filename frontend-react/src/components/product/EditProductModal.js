import React, { useState } from "react";
import { toast } from "react-toastify";
import "./EditProductModal.css";

const EditProductModal = ({
  product,
  categories,
  isVisible,
  onClose,
  onSave,
  onChange,
  error,
}) => {
  const [priceError, setPriceError] = useState(""); // Erro de validação do preço

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      // Validação do preço
      const priceRegex = /^\d+(\.\d{1,2})?$/; // Aceita números com até 2 casas decimais
      if (!priceRegex.test(value) && value !== "") {
        setPriceError(
          "O preço deve ser um número válido com até 2 casas decimais."
        );
      } else {
        setPriceError("");
      }
      onChange({ ...product, [name]: value });
    } else {
      onChange({ ...product, [name]: value });
    }
  };

  const handleSaveProduct = (event) => {
    event.preventDefault();

    if (!product.title.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }

    if (priceError) {
      toast.error("Corrija os erros antes de salvar.");
      return;
    }

    onSave(event); // Chama a função de salvar passada como prop
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Produto</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSaveProduct}>
          <label>
            Título:
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Categoria:
            <select
              name="category"
              value={product.category.id}
              onChange={(e) =>
                onChange({
                  ...product,
                  category: { id: e.target.value },
                })
              }
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preço:
            <input
              type="text"
              name="price"
              value={product.price}
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
              value={product.imagem}
              onChange={handleChange}
            />
          </label>
          <label>
            Localização:
            <input
              type="text"
              name="local"
              value={product.local}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descrição:
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Estado:
            <select
              name="state"
              value={product.state}
              onChange={handleChange}
              required
            >
              <option value="RASCUNHO">Rascunho</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="COMPRADO">Comprado</option>
              <option value="APAGADO">Apagado</option>
            </select>
          </label>
          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
