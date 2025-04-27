import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { useProductStore } from "../stores/ProductStore";
import CategoryManager from "../components/category/CategoryManager";
import { FaUsersCog, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { TbBasketCog, TbBuildingCog } from "react-icons/tb";
import api from "../services/apiService";
import "./AdminPanel.css";
import EditProductModal from "../components/product/EditProductModal";
import EditUserModal from "../components/user/EditUserModal";
import SearchUserProductsForm from "../components/admin/SearchUserProductsForm";
import FilterDropdown from "../components/admin/FilterDropdown"; // Importa o componente de filtro
import { toast } from "react-toastify"; // Importa o toastify
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function AdminPanel() {
  const isAdmin = userStore((state) => state.isAdmin);
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const { products, setProducts, addProduct, updateProduct, removeProduct } =
    useProductStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imagem: "",
    isAdmin: false,
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
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

  const [sessionTimeout, setSessionTimeout] = useState(""); // Estado para tempo de expiração

  const [editCategory, setEditCategory] = useState(null); // Categoria a ser editada
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false); // Controle do modal

  // Estados para o dashboard
  const [userStats, setUserStats] = useState({ total: 0, verified: 0 });
  const [productStats, setProductStats] = useState([]);
  const [productsByUser, setProductsByUser] = useState([]);
  const [averageTimeToPurchase, setAverageTimeToPurchase] = useState(0);
  const [usersOverTime, setUsersOverTime] = useState([]);
  const [purchasedProductsOverTime, setPurchasedProductsOverTime] = useState(
    []
  );

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

  useEffect(() => {
    const fetchSessionTimeout = async () => {
      try {
        const response = await api.get("/admin/settings/session-timeout", {
          headers: {
            Authorization: token,
          },
        });
        setSessionTimeout(response.data.timeout); // Atualiza o estado com o valor do timeout
      } catch (error) {
        console.error("Erro ao buscar o tempo de expiração:", error);
        toast.error("Erro ao carregar o tempo de expiração.");
      }
    };

    fetchSessionTimeout();
  }, [token]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResponse = await api.get("/admin/stats/users");
        setUserStats(userResponse.data);

        const productResponse = await api.get("/admin/stats/products");
        setProductStats(
          Object.entries(productResponse.data).map(([key, value]) => ({
            name: key,
            value,
          }))
        );

        const categoryResponse = await api.get("/admin/stats/categories");
        setCategories(categoryResponse.data);

        const productsByUserResponse = await api.get(
          "/admin/stats/products-by-user"
        );
        setProductsByUser(productsByUserResponse.data);

        const averageTimeResponse = await api.get(
          "/admin/stats/average-time-to-purchase"
        );
        setAverageTimeToPurchase(
          averageTimeResponse.data.averageTimeToPurchase
        );

        const usersOverTimeResponse = await api.get(
          "/admin/stats/registered-users-over-time"
        );
        setUsersOverTime(usersOverTimeResponse.data);

        const purchasedProductsResponse = await api.get(
          "/admin/stats/purchased-products-over-time"
        );
        setPurchasedProductsOverTime(purchasedProductsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

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

  useEffect(() => {
    if (activePanel === "categories") {
      fetchCategories(); // Busca as categorias do backend
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

  const handleSaveTimeout = async () => {
    try {
      // Converte o valor de sessionTimeout para inteiro
      const timeoutValue = parseInt(sessionTimeout, 10);

      if (isNaN(timeoutValue) || timeoutValue <= 0) {
        toast.error("O valor de timeout deve ser um número inteiro positivo.");
        return;
      }

      await api.put(
        "/admin/settings/session-timeout",
        { timeout: timeoutValue }, // Envia como número inteiro
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success("Tempo de expiração atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar o tempo de expiração.");
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category); // Define a categoria a ser editada
    setShowEditCategoryModal(true); // Abre o modal
  };

  const handleSaveCategory = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/categories/${editCategory.id}`, editCategory); // Atualiza a categoria no backend
      toast.success("Categoria atualizada com sucesso!");
      setShowEditCategoryModal(false); // Fecha o modal
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
      toast.error("Erro ao atualizar categoria. Tente novamente.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Tem certeza que deseja apagar esta categoria?")) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`); // Faz o request para apagar a categoria
      toast.success("Categoria apagada com sucesso!");
      fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error("Erro ao apagar categoria:", error.response?.data || error.message);
      toast.error("Erro ao apagar categoria. Tente novamente.");
    }
  };

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
                      <strong>Nome:</strong> {user.firstName} {user.lastName}
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
                      <strong>Categoria:</strong> {product.category.name}
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
                      {category.name}
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
      {/* Painel de Gerir Categorias */}
      {activePanel === "categories" && (
        <div className="admin-panel-content">
          <h2>Gerir Categorias</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                {category.name}
                <div className="category-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditCategory(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showEditCategoryModal && editCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Categoria</h3>
            <form onSubmit={handleSaveCategory}>
              <label>
                Nome da Categoria:
                <input
                  type="text"
                  name="name"
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowEditCategoryModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Configuração de Sessão */}
      <div className="session-config">
        <h3>Configuração de Sessão</h3>
        <p>Tempo atual de expiração: {sessionTimeout} minutos</p>
        <input
          type="number"
          value={sessionTimeout}
          onChange={(e) => setSessionTimeout(e.target.value)}
          placeholder="Tempo de expiração (minutos)"
          min="1" // Garante que o valor mínimo seja 1
        />
        <button onClick={handleSaveTimeout}>Salvar</button>
      </div>
      {/* Dashboard de Estatísticas */}
      <div className="admin-dashboard">
        <h2>Dashboard de Estatísticas</h2>

        {/* Estatísticas de Utilizadores */}
        <div>
          <h3>Utilizadores</h3>
          <p>Total: {userStats.total}</p>
          <p>Confirmados: {userStats.verified}</p>
        </div>

        {/* Estatísticas de Produtos por Estado */}
        <div>
          <h3>Produtos por Estado</h3>
          <BarChart width={500} height={300} data={productStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Listagem de Categorias */}
        <div>
          <h3>Categorias</h3>
          <ul>
            {categories.map((category) => (
              <li key={category.name}>
                {category.name}: {category.count} produtos
              </li>
            ))}
          </ul>
        </div>

        {/* Produtos por Utilizador */}
        <div>
          <h3>Produtos por Utilizador</h3>
          <table>
            <thead>
              <tr>
                <th>Utilizador</th>
                <th>Total</th>
                <th>Rascunho</th>
                <th>Publicado</th>
                <th>Reservado</th>
                <th>Comprado</th>
              </tr>
            </thead>
            <tbody>
              {productsByUser.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.totalProducts}</td>
                  <td>{user.draftProducts}</td>
                  <td>{user.publishedProducts}</td>
                  <td>{user.reservedProducts}</td>
                  <td>{user.purchasedProducts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tempo Médio para Compra */}
        <div>
          <h3>Tempo Médio para Compra</h3>
          <p>{averageTimeToPurchase} dias</p>
        </div>

        {/* Gráficos Temporais */}
        <div>
          <h3>Utilizadores Registados ao Longo do Tempo</h3>
          <LineChart width={500} height={300} data={usersOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>

        <div>
          <h3>Produtos Comprados ao Longo do Tempo</h3>
          <LineChart width={500} height={300} data={purchasedProductsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
      )}
    </div>
  );
}

export default AdminPanel;
