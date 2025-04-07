import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/apiService";
import { toast } from "react-toastify"; // Importa o toastify
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
      toast.error("Erro ao carregar categorias. Tente novamente."); // Toast de erro
    }
  };

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory.trim())
      return toast.warn("O nome da categoria é obrigatório."); // Toast de aviso
    try {
      await api.post("/categories/new", { name: newCategory }); // Faz o request com o serviço Axios
      toast.success("Categoria criada com sucesso!"); // Toast de sucesso
      setNewCategory("");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao criar categoria:",
        error.response?.data || error.message
      );
      toast.error("Erro ao criar categoria. Tente novamente."); // Toast de erro
    }
  };

  // Edit a category
  const handleEditCategory = async () => {
    if (!editCategoryName.trim())
      return toast.warn("O nome da categoria é obrigatório."); // Toast de aviso
    try {
      await api.put(`/categories/${editCategory.id}`, {
        nome: editCategoryName, // Corrige o campo para "nome"
      }); // Faz o request com o serviço Axios
      toast.success("Categoria editada com sucesso!"); // Toast de sucesso
      setEditCategory(null);
      setEditCategoryName("");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao editar categoria:",
        error.response?.data || error.message
      );
      toast.error("Erro ao editar categoria. Tente novamente."); // Toast de erro
    }
  };

  // Soft delete a category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta categoria?"))
      return;
    try {
      await api.delete(`/categories/${id}`); // Faz o request com o serviço Axios
      toast.success("Categoria apagada com sucesso!"); // Toast de sucesso
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error(
        "Erro ao apagar categoria:",
        error.response?.data || error.message
      );
      toast.error("Erro ao apagar categoria. Tente novamente."); // Toast de erro
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
            <div className="category-text">
              {editCategory?.id === category.id ? (
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              ) : (
                <span>{category.nome}</span>
              )}
            </div>
            <div className="category-actions">
              {editCategory?.id === category.id ? (
                <>
                  <button onClick={handleEditCategory}>Salvar</button>
                  <button onClick={() => setEditCategory(null)}>Cancelar</button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;
