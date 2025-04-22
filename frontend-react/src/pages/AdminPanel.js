import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { useProductStore } from "../stores/ProductStore";
import CategoryManager from "../components/category/CategoryManager";
import { FaUsersCog, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { TbBasketCog, TbBuildingCog } from "react-icons/tb";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import api from "../services/apiService"; // Importa o serviço Axios configurado
import "./AdminPanel.css";
import EditProductModal from "../components/product/EditProductModal";
import EditUserModal from "../components/user/EditUserModal";
import SearchUserProductsForm from "../components/admin/SearchUserProductsForm";
import FilterDropdown from "../components/admin/FilterDropdown"; // Importa o componente de filtro
import { toast } from "react-toastify"; // Importa o toastify

// Fixme - Corrigir o CSS do UserList na Gestão de Utilizadores
// Fixme - Update do user não está a funcionar!

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin);
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const [activePanel, setActivePanel] = useState(null);
  const [users, setUsers] = useState([]);
  const { products, setProducts, addProduct, updateProduct, removeProduct } =
    useProductStore(); // Usa a store de produtos
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [showModal, setShowModal] = useState(false); // Modal de edição de utilizador
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal de criação de utilizador
  const [editUser, setEditUser] = useState(null); // Utilizador a ser editado
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imagem: "",
    isAdmin: false,
  }); // Novo utilizador
  const [editProduct, setEditProduct] = useState(null); // Produto a ser editado
  const [showProductModal, setShowProductModal] = useState(false); // Modal de edição de produto
  const [showCreateProductModal, setShowCreateProductModal] = useState(false); // Modal de criação de produto
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
    imagem: "",
    local: "",
    description: "",
    state: "DISPONIVEL",
  }); // Novo produto
  const [error, setError] = useState(null);

  // Estados para a funcionalidade de pesquisa de produtos de um usuário
  const [username, setUsername] = useState(""); // Nome do usuário para pesquisa
  const [userProducts, setUserProducts] = useState([]); // Produtos do usuário

  const [selectedState, setSelectedState] = useState(""); // Estado selecionado no filtro

  // Redireciona para a homepage se o usuário não for admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    // Define o painel ativo com base no URL ao carregar a página
    const panelFromUrl = new URLSearchParams(location.search).get("panel");
    if (panelFromUrl) {
      setActivePanel(panelFromUrl);
    }
  }, [location.search]);

  const handlePanelChange = (panel) => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    navigate(newPanel ? `?panel=${newPanel}` : ""); // Atualiza o URL
  };

  // Função para buscar todos os utilizadores
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/all"); // Faz o request com o serviço Axios
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar utilizadores:",
        error.response?.data || error.message
      );
      toast.error("Erro ao carregar utilizadores. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todos os produtos
  const fetchProducts = async (state) => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: { state }, // Passa o estado como parâmetro de consulta
      });
      setProducts(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar produtos:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Chama fetchProducts sempre que selectedState mudar
  useEffect(() => {
    fetchProducts(selectedState); // Busca produtos com base no estado selecionado
  }, [selectedState]);

  // Função para buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/all"); // Faz o request com o serviço Axios
      setCategories(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar categorias:",
        error.response?.data || error.message
      );
    }
  };

  // Função para buscar produtos de um usuário
  const fetchUserProducts = async () => {
    if (!username.trim()) {
      setError("Por favor, insira um nome de usuário.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/products/user-products/${username}`);
      setUserProducts(response.data);
    } catch (error) {
      console.error(
        "Erro ao buscar produtos do usuário:",
        error.response?.data || error.message
      );
      setError("Erro ao buscar produtos. Verifique o nome do usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Busca os utilizadores ao abrir o painel de "Gerir Utilizadores"
  useEffect(() => {
    if (activePanel === "users") {
      fetchUsers();
    }
  }, [activePanel]);

  // Busca os produtos e categorias ao abrir o painel de "Gerir Produtos"
  useEffect(() => {
    if (activePanel === "products") {
      fetchProducts();
      fetchCategories();
    }
  }, [activePanel]);

  // Alterna a exibição da senha para um utilizador específico
  const togglePasswordVisibility = (username) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [username]: !prevState[username],
    }));
  };

  // Função para criar um novo utilizador
  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError(null);

    // Validação simples
    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.email ||
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.phone
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post("/users/register", newUser); // Faz o request com o serviço Axios

      toast.success(`O utilizador ${newUser.username} foi criado com sucesso!`);
      setShowCreateModal(false); // Fecha o modal
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error(
        "Erro ao criar utilizador:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data || "Erro ao criar utilizador. Tente novamente."
      );
      toast.error("Erro ao criar utilizador. Tente novamente.");
    }
  };

  // Função para lidar com mudanças nos campos do formulário de criação
  const handleNewUserChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Função para apagar um utilizador
  const handleDeleteUser = async (username) => {
    if (
      !window.confirm(`Tem certeza que deseja apagar o utilizador ${username}?`)
    ) {
      return;
    }

    try {
      await api.delete(`/users/delete/${username}`); // Faz o request com o serviço Axios
      toast.success(`O utilizador ${username} foi apagado com sucesso!`);
      fetchUsers(); // Atualiza a lista de utilizadores
    } catch (error) {
      console.error(
        "Erro ao apagar utilizador:",
        error.response?.data || error.message
      );
      toast.error("Erro ao apagar utilizador. Tente novamente.");
    }
  };

  // Função para abrir o modal de edição
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  // Função para salvar as alterações do utilizador
  const handleSaveUser = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      // Certifique-se de que todos os campos esperados estão presentes e no formato correto
      const userPayload = {
        username: editUser.username,
        password: editUser.password || "", // Envia uma string vazia se o campo estiver ausente
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phone: editUser.phone,
        imagem: editUser.imagem,
        produtos: editUser.produtos || [], // Envia uma lista vazia se o campo estiver ausente
        id: editUser.id,
        isAdmin: !!editUser.isAdmin, // Converte para booleano
        isDeleted: editUser.isDeleted,
        isVerified: editUser.isVerified, // Inclui o valor atual de isVerified
        verificationToken: editUser.verificationToken || null, // Envia null se o campo estiver ausente
        passwordRecoveryToken: editUser.passwordRecoveryToken || null, // Envia null se o campo estiver ausente
        canEdit: editUser.canEdit || false, // Envia false se o campo estiver ausente
      };

      const updatedUser = await api.put(
        `/users/${editUser.username}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (updatedUser) {
        fetchUsers(); // Atualiza a lista de utilizadores
        toast.success(
          `O utilizador ${editUser.username} foi atualizado com sucesso!`
        );
      }

      setShowModal(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
      setError(
        error.message || "Erro ao atualizar utilizador. Tente novamente."
      );
    }
  };

  // Função para lidar com mudanças nos campos do formulário de edição
  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Função para criar um novo produto
  const handleCreateProduct = async (event) => {
    event.preventDefault();
    console.log("Dados enviados:", newProduct);
    setError(null);

    try {
      const response = await api.post("/products/add", newProduct); // Faz o request com o serviço Axios
      addProduct(response.data); // Adiciona o novo produto à store
      toast.success(`O produto "${newProduct.title}" foi criado com sucesso!`);
      setShowCreateProductModal(false); // Fecha o modal
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data || "Erro ao criar produto. Tente novamente."
      );
      toast.error("Erro ao criar produto. Tente novamente.");
    }
  };

  // Função para apagar um produto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(`Tem certeza que deseja apagar o produto?`)) {
      return;
    }

    try {
      await api.delete(`/products/${id}`); // Faz o request com o serviço Axios
      removeProduct(id); // Remove o produto da store
      toast.success("Produto apagado com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao apagar produto:",
        error.response?.data || error.message
      );
      toast.error("Erro ao apagar produto. Tente novamente.");
    }
  };

  // Função para abrir o modal de edição de produto
  const handleEditProduct = (product) => {
    setEditProduct(product); // Define o produto a ser editado
    setShowProductModal(true); // Abre o modal
  };

  // Função para salvar as alterações do produto
  const handleSaveProduct = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await api.put(
        `/products/${editProduct.id}`,
        editProduct
      ); // Faz o request com o serviço Axios
      updateProduct(response.data); // Atualiza o produto na store
      toast.success(
        `O produto "${editProduct.title}" foi atualizado com sucesso!`
      );
      setShowProductModal(false); // Fecha o modal
    } catch (error) {
      console.error(
        "Erro ao atualizar produto:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data || "Erro ao atualizar produto. Tente novamente."
      );
      toast.error("Erro ao atualizar produto. Tente novamente.");
    }
  };

  // Função para carregar os produtos do backend e armazená-los na store
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products"); // Faz o request ao backend
        setProducts(response.data); // Armazena os produtos na store
      } catch (error) {
        console.error(
          "Erro ao buscar produtos:",
          error.response?.data || error.message
        );
        toast.error("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts]);

  return (
    <div className="admin-panel-container">
      <h1>Painel Administrativo</h1>
      <div className="admin-buttons">
        <button
          className={`admin-button ${activePanel === "users" ? "active" : ""}`}
          onClick={() => handlePanelChange("users")}
        >
          <FaUsersCog className="admin-icon" />
          Gerir Utilizadores
        </button>
        <button
          className={`admin-button ${
            activePanel === "products" ? "active" : ""
          }`}
          onClick={() => handlePanelChange("products")}
        >
          <TbBasketCog className="admin-icon" />
          Gerir Produtos
        </button>
        <button
          className={`admin-button ${
            activePanel === "categories" ? "active" : ""
          }`}
          onClick={() => handlePanelChange("categories")}
        >
          <TbBuildingCog className="admin-icon" />
          Gerir Categorias
        </button>
        <button
          className={`admin-button ${
            activePanel === "user-products" ? "active" : ""
          }`}
          onClick={() => handlePanelChange("user-products")}
        >
          <FaSearch className="admin-icon" />
          Pesquisar Produtos de Usuário
        </button>
      </div>

      {/* Painel de Gerir Utilizadores */}
      {activePanel === "users" && (
        <div className="admin-panel-content">
          <h2>Gerir Utilizadores</h2>
          <button
            className="create-user-button"
            onClick={() => {
              console.log("Abrindo modal de criação de utilizador");
              setShowCreateModal(true);
            }}
          >
            + Criar Novo Utilizador
          </button>
          {loading ? (
            <p>A carregar utilizadores...</p>
          ) : (
            <div className="users-cards-container">
              {users.map((user) => (
                <div className="user-card" key={user.username}>
                  {/* Primeira Coluna */}
                  <div className="user-card-column user-card-column-center">
                    <img
                      src={user.imagem || "https://via.placeholder.com/70"}
                      alt={user.username}
                      className="user-card-image"
                    />
                    <div className="user-card-info-line">
                      <p className="user-card-username">{user.username}</p>
                      <span className="user-card-role">
                        ({user.isAdmin ? "Admin" : "Utilizador"})
                      </span>
                      <span
                        className={`user-card-status ${
                          user.isDeleted ? "deleted" : "active"
                        }`}
                      >
                        {user.isDeleted ? (
                          <>
                            <span>❌</span> Inativo
                          </>
                        ) : (
                          <>
                            <span>✅</span> Ativo
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Segunda Coluna */}
                  <div className="user-card-column">
                    <p>
                      <strong>Nome:</strong> {user.firstName}{" "}
                      {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {user.phone}
                    </p>
                    <div className="user-card-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.username)}
                      >
                        <FaTrash /> Apagar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Criar Novo Utilizador</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleCreateUser}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  required
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imagem"
                  value={newUser.imagem}
                  onChange={handleNewUserChange}
                />
              </label>
              <label>
                Admin:
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={newUser.isAdmin}
                  onChange={handleNewUserChange}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Painel de Gerir Produtos */}
      {activePanel === "products" && (
        <div className="admin-panel-content">
          <h2>Gerir Produtos</h2>
          <div className="admin-panel-header">
            <button
              className="create-product-button"
              onClick={() => setShowCreateProductModal(true)}
            >
              + Criar Novo Produto
            </button>
            <FilterDropdown
              selectedState={selectedState}
              onStateChange={setSelectedState}
              onClearFilter={() => setSelectedState("")}
            />
          </div>
          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length > 0 ? (
            <div className="products-cards-container">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-card-column">
                    <img
                      src={product.imagem || "https://via.placeholder.com/70"}
                      alt={product.title}
                      className="product-card-image"
                    />
                    <h3>{product.title}</h3>
                    <p>
                      <strong>Categoria:</strong> {product.category.nome}
                    </p>
                    <p>
                      <strong>Preço:</strong> {product.price} €
                    </p>
                    <p>
                      <strong>Estado:</strong> {product.state}
                    </p>
                  </div>
                  <div className="product-card-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditProduct(product)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FaTrash /> Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Sem produtos com o estado selecionado.</p>
          )}
        </div>
      )}
      {/* Modal de Criação de Produto */}
      {showCreateProductModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Criar Novo Produto</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleCreateProduct}>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Categoria:
                <select
                  name="category"
                  value={newProduct.category.id || ""}
                  onChange={(e) => {
                    const selectedCategory = categories.find(
                      (category) => category.id === parseInt(e.target.value)
                    );
                    setNewProduct({
                      ...newProduct,
                      category: {
                        id: selectedCategory.id,
                        nome: selectedCategory.nome,
                      },
                    });
                  }}
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
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </label>
              <label>
                URL da Imagem:
                <input
                  type="text"
                  name="imagem"
                  value={newProduct.imagem}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imagem: e.target.value })
                  }
                />
              </label>
              <label>
                Localização:
                <input
                  type="text"
                  name="local"
                  value={newProduct.local}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, local: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Descrição:
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Criar</button>
                <button
                  type="button"
                  onClick={() => setShowCreateProductModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Utilizador */}
      {showModal && editUser && (
        <EditUserModal
          user={editUser}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          onChange={handleEditChange}
          error={error}
        />
      )}

      {/* Modal de Edição de Produto */}
      {showProductModal && editProduct && (
        <EditProductModal
          product={editProduct}
          categories={categories}
          isVisible={showProductModal} // Passa o estado showProductModal como isVisible
          onClose={() => setShowProductModal(false)}
          onSave={handleSaveProduct}
          onChange={setEditProduct}
          error={error}
        />
      )}

      {/* Painel de Pesquisa de Produtos de Usuário */}
      {activePanel === "user-products" && <SearchUserProductsForm />}

      {activePanel === "categories" && <CategoryManager token={token} />}
    </div>
  );
}

export default AdminPanel;
