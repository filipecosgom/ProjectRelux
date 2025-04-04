import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/apiService"; // Importa o serviço Axios configurado
import "./CategoryManager.css";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/all"); // Faz o request com o serviço Axios
      setCategories(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar categorias:",
        error.response?.data || error.message
      );
      alert("Erro ao carregar categorias. Tente novamente.");
    }
  };

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return alert("O nome da categoria é obrigatório.");
    try {
      await api.post("/categories/new", { name: newCategory }); // Faz o request com o serviço Axios
      alert("Categoria criada com sucesso!");
      setNewCategory("");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao criar categoria:",
        error.response?.data || error.message
      );
      alert("Erro ao criar categoria. Tente novamente.");
    }
  };

  // Edit a category
  const handleEditCategory = async () => {
    if (!editCategoryName.trim())
      return alert("O nome da categoria é obrigatório.");
    try {
      await api.put(`/categories/${editCategory.id}`, {
        name: editCategoryName,
      }); // Faz o request com o serviço Axios
      alert("Categoria editada com sucesso!");
      setEditCategory(null);
      setEditCategoryName("");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao editar categoria:",
        error.response?.data || error.message
      );
      alert("Erro ao editar categoria. Tente novamente.");
    }
  };

  // Soft delete a category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta categoria?"))
      return;
    try {
      await api.delete(`/categories/${id}`); // Faz o request com o serviço Axios
      alert("Categoria apagada com sucesso!");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao apagar categoria:",
        error.response?.data || error.message
      );
      alert("Erro ao apagar categoria. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-manager">
      <h2>Gerir Categorias</h2>

      {/* Criar nova categoria */}
      <div>
        <input
          type="text"
          placeholder="Nova Categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Criar</button>
      </div>

      {/* Listar categorias */}
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            {editCategory?.id === category.id ? (
              <div>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
                <button onClick={handleEditCategory}>Salvar</button>
                <button onClick={() => setEditCategory(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <span>{category.nome}</span>
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setEditCategoryName(category.nome);
                  }}
                >
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  <FaTrash /> Apagar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;
