'use strict';

import { loadCommonElements } from './loadCommons.js';
import * as productComponent from './components/product.js';
import * as userComponent from './components/user.js';
import * as userAPI from './api/userAPI.js';

init();

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonElements();

    // Route handling based on the current page
    if (window.location.pathname.endsWith('index.html')) {
      await productComponent.displayAllProducts();
    }

    if (window.location.pathname.endsWith('pagina-login.html')) {
      document
        .getElementById('submitLoginForm')
        .addEventListener('click', userComponent.submitLoginForm);
      document
        .getElementById('login-form')
        .addEventListener('keypress', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            userComponent.submitLoginForm();
          }
        });
    }

    if (window.location.pathname.endsWith('produto-total.html')) {
      await productComponent.displayAllProducts();
    }

    if (window.location.pathname.endsWith('detalhes-produto.html')) {
      await productComponent.gerarDetalhesDoProduto();
    }

    if (window.location.pathname.endsWith('perfil-utilizador.html')) {
      await userComponent.displayUser();
      await userComponent.toggleFormUserEdit();
      await userComponent.searchUser();
      await userComponent.displayUserInfo();
    }

    if (window.location.pathname.endsWith('novo-registo.html')) {
      await userComponent.addNewUser();
    }
  });
}

async function setupAdminSearch() {
  try {
    const user = await userAPI.getUserInfo();
    if (user.isAdmin) {
      document
        .getElementById('admin-search-wrapper')
        .classList.remove('hidden');
      document
        .getElementById('search-user-button')
        .addEventListener('click', searchUser);
    }
  } catch (error) {
    console.error('Erro ao verificar permissões do utilizador:', error);
  }
}

async function searchUser() {
  const username = document.getElementById('search-username').value;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/filipe-proj4/rest/users/profile/${username}`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar perfil do utilizador');
    }

    const user = await response.json();
    displaySearchResults(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do utilizador:', error);
    document.getElementById('search-results').innerText =
      'Erro ao buscar perfil do utilizador';
  }
}

function displaySearchResults(user) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = `
    <p>Nome: ${user.nome}</p>
    <p>Username: ${user.username}</p>
    <p>Email: ${user.email}</p>
    <p>Telefone: ${user.telefone}</p>
    <p>Foto de Perfil: <img src="${user.profilePic}" alt="Foto de Perfil" /></p>
  `;
  document.getElementById('search-results-wrapper').classList.remove('hidden');
}

function openForm() {
  document.getElementById('myForm').style.display = 'block';
}

function closeForm() {
  document.getElementById('myForm').style.display = 'none';
}
