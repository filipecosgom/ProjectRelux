document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('edit-other-user-products')
    .addEventListener('click', editOtherUserProducts);
  document
    .getElementById('delete-products')
    .addEventListener('click', deleteProducts);
  document
    .getElementById('search-user-profile')
    .addEventListener('click', searchUserProfile);
  document
    .getElementById('filter-user-products')
    .addEventListener('click', filterUserProducts);
  document
    .getElementById('filter-category-products')
    .addEventListener('click', filterCategoryProducts);
  document
    .getElementById('view-modified-products')
    .addEventListener('click', viewModifiedProducts);
  document
    .getElementById('add-category')
    .addEventListener('click', addCategory);
  document
    .getElementById('soft-delete-user')
    .addEventListener('click', softDeleteUser);
  document
    .getElementById('delete-user-products')
    .addEventListener('click', deleteUserProducts);
  document
    .getElementById('permanent-delete-product')
    .addEventListener('click', permanentDeleteProduct);
  document
    .getElementById('permanent-delete-user')
    .addEventListener('click', permanentDeleteUser);
});

async function editOtherUserProducts() {
  // Implementar a lógica para editar produtos de outros utilizadores
}

async function deleteProducts() {
  // Implementar a lógica para apagar produtos
}

async function searchUserProfile() {
  const username = document.getElementById('search-username').value;
  try {
    const user = await userAPI.getUserProfile(username);
    displayUserProfile(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do utilizador:', error);
  }
}

function displayUserProfile(user) {
  const userProfileDiv = document.getElementById('user-profile');
  userProfileDiv.innerHTML = `
        <p>Nome: ${user.firstName} ${user.lastName}</p>
        <p>Username: ${user.username}</p>
        <p>Email: ${user.email}</p>
        <p>Telefone: ${user.phone}</p>
        <p>Foto de Perfil: <img src="${user.imagem}" alt="Foto de Perfil" /></p>
    `;
}

async function filterUserProducts() {
  const username = document.getElementById('filter-username').value;
  try {
    const products = await productAPI.getProductsByUser(username);
    displayProducts(products, 'user-products');
  } catch (error) {
    console.error('Erro ao buscar produtos do utilizador:', error);
  }
}

async function filterCategoryProducts() {
  const category = document.getElementById('filter-category').value;
  try {
    const products = await productAPI.getProductsByCategory(category);
    displayProducts(products, 'category-products');
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
  }
}

async function viewModifiedProducts() {
  // Implementar a lógica para consultar produtos alterados
}

async function addCategory() {
  const category = document.getElementById('new-category').value;
  try {
    await productAPI.addCategory(category);
    alert('Categoria adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
  }
}

async function softDeleteUser() {
  const username = document.getElementById('delete-username').value;
  try {
    await userAPI.softDeleteUser(username);
    alert('Utilizador apagado com sucesso!');
  } catch (error) {
    console.error('Erro ao apagar utilizador:', error);
  }
}

async function deleteUserProducts() {
  const username = document.getElementById(
    'delete-user-products-username'
  ).value;
  try {
    await productAPI.deleteProductsByUser(username);
    alert('Produtos do utilizador apagados com sucesso!');
  } catch (error) {
    console.error('Erro ao apagar produtos do utilizador:', error);
  }
}

async function permanentDeleteProduct() {
  const productId = document.getElementById(
    'permanent-delete-product-id'
  ).value;
  try {
    await productAPI.permanentDeleteProduct(productId);
    alert('Produto excluído permanentemente com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir produto permanentemente:', error);
  }
}

async function permanentDeleteUser() {
  const username = document.getElementById('permanent-delete-username').value;
  try {
    await userAPI.permanentDeleteUser(username);
    alert('Utilizador excluído permanentemente com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir utilizador permanentemente:', error);
  }
}

function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <p>Preço: ${product.price}</p>
        `;
    container.appendChild(productDiv);
  });
}
