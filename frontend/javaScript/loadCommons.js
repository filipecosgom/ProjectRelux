'use strict';

import * as userAPI from './api/userAPI.js';
import * as productAPI from './api/productAPI.js';

export async function loadCommonElements() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log('Nenhum utilizador logado');
    return;
  }

  fetch('common/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .then(() => {
      welcomeMessage();
    })
    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => {
      addModalListeners();
    })
    .catch(error => console.error('Erro ao carregar o cabeçalho:', error));

  fetch('common/newProductModal.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Erro ao carregar o modal:', error));

  fetch('common/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o rodapé:', error));
}

async function welcomeMessage() {
  let user = null;
  const profilePicture = document.getElementById('profile-picture');
  const openModalBtn = document.getElementById('openModalBtn');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutButton = document.getElementById('botao-logout');
  const loginButton = document.getElementById('botao-login');

  try {
    user = await userAPI.getUserInfo(); // Fetch user info from the database using the token
  } catch (error) {
    console.error(
      'Erro ao buscar informações do usuário da base de dados',
      error
    );
  }

  if (user) {
    openModalBtn.classList.remove('hidden');
    welcomeMessage.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    loginButton.classList.remove('hidden');
  }
}

async function addModalListeners() {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('openModalBtn');
  const span = document.getElementsByClassName('close')[0];
  const cancel = document.getElementById('cancelar');
  const form = document.getElementById('form-novo-produto');

  btn.onclick = function () {
    modal.style.display = 'block';
    addNewProduct();
  };

  cancel.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  span.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      form.reset();
    }
  };
}

async function addNewProduct() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
  const form = document.getElementById('form-novo-produto');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const categoria =
      document.querySelector("select[name='categoria']").value || 'N/A';
    const tamanho =
      document.querySelector("select[name='tamanho']").value || 'N/A';
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value;
    const localizacao = document.getElementById('localizacao').value;
    const dataDePublicacao = new Date().toISOString().split('T')[0];

    const novoProduto = {
      titulo: titulo,
      descricao: descricao,
      categoria: categoria,
      tamanho: tamanho,
      preco: parseFloat(preco).toFixed(2),
      imagem: imagem,
      local: localizacao,
      dataDePublicacao: dataDePublicacao,
      userAutor: loggedInUser.username,
    };

    try {
      // Use the productAPI to handle the request
      const result = await productAPI.sendNewProductReq(novoProduto);
      if (!loggedInUser.produtos) {
        loggedInUser.produtos = [];
      }
      loggedInUser.produtos.push(result);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      const productIds = loggedInUser.produtos.map(product => product.id);
      const updatedUser = { ...loggedInUser, produtos: productIds };
      await userAPI.updateUser(updatedUser);
      alert('Produto criado com sucesso!');
      modal.style.display = 'none';
      form.reset();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar o produto:', error);
    }
  });
}
