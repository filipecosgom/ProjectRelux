import React from "react";
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
  console.log("isVisible:", isVisible); // Verifica o valor de isVisible
  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Produto</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSave}>
          <label>
            Título:
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={(e) => onChange({ ...product, title: e.target.value })}
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
              type="number"
              name="price"
              value={product.price}
              onChange={(e) =>
                onChange({ ...product, price: parseFloat(e.target.value) })
              }
              required
            />
          </label>
          <label>
            URL da Imagem:
            <input
              type="text"
              name="imagem"
              value={product.imagem}
              onChange={(e) => onChange({ ...product, imagem: e.target.value })}
            />
          </label>
          <label>
            Localização:
            <input
              type="text"
              name="local"
              value={product.local}
              onChange={(e) => onChange({ ...product, local: e.target.value })}
              required
            />
          </label>
          <label>
            Descrição:
            <textarea
              name="description"
              value={product.description}
              onChange={(e) =>
                onChange({ ...product, description: e.target.value })
              }
              required
            />
          </label>
          <label>
            Estado:
            <select
              name="state"
              value={product.state}
              onChange={(e) => onChange({ ...product, state: e.target.value })}
              required
            >
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
