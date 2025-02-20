'use strict';

import { loadCommonElements } from './loadCommons.js';

const rootPath = 'http://localhost:8080/mariana-jorge-proj2/rest';
const productsPath = `${rootPath}/products`;
const getAllProductsURL = `${rootPath}/products/all`;
const loginRequestURL = `${rootPath}/users/login`; // URL para o pedido de login
const registerRequestURL = `${rootPath}/users/register`;

init();

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonElements();

    if (window.location.pathname.endsWith('index.html')) {
      await displayMostRecentProducts();
      await displayMostRatedProducts();
    }

    if (window.location.pathname.endsWith('pagina-login.html')) {
      document
        .getElementById('submitLoginForm')
        .addEventListener('click', submitLoginForm);
    }

    if (window.location.pathname.endsWith('produto-total.html')) {
      await displayAllProducts();
    }

    if (window.location.pathname.endsWith('detalhes-produto.html')) {
      await gerarDetalhesDoProduto();
    }

    if (window.location.pathname.endsWith('perfil-utilizador.html')) {
      await displayUser();
      await toggleFormUserEdit();
    }

    if (window.location.pathname.endsWith('novo-registo.html')) {
      await addNewUser();
    }
  });
}

async function getAllProducts() {
  try {
    const requestURL = getAllProductsURL;
    const response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function displayAllProducts() {
  const container = document.querySelector('.product-list');
  const products = await getAllProducts();

  if (!container) {
    console.log('Não está a chegar ao html');
    return;
  }
  container.innerHTML = '';
  products.forEach(product => {
    console.log('Estou a carregar os cartões dos produtos');
    const card = createCard(product);
    container.appendChild(card);
  });
}

async function displayMostRecentProducts() {
  const mainContainer = document.querySelector('.recent-products');
  const products = await getAllProducts();
  const mostRecentProducts = products
    .sort((a, b) => new Date(b.dataDePublicacao) - new Date(a.dataDePublicacao))
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRecentProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}

async function displayMostRatedProducts() {
  const mainContainer = document.querySelector('.most-rated-products');
  const products = await getAllProducts();
  const mostRatedProducts = products
    .map(product => ({
      ...product,
      mediaEstrelas: gerarRating(product.avaliacoes).mediaEstrelas,
    }))
    .sort((a, b) => b.mediaEstrelas - a.mediaEstrelas)
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRatedProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}

// Cria a card do produto
function createCard(product) {
  const rating = gerarRating(product.avaliacoes);
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.imagem}" alt="${product.titulo}" />
    <div>
      <h1>${product.titulo}</h1>
      <h4>${product.local}</h4>
      <h2>${product.categoria}</h2>
      <h3 class="rating">${rating.estrelas}</h3>
      <span>${parseFloat(product.preco).toFixed(2)}€</span>
      <button type="button" title="descricao">Saber mais</button>
    </div>
  `;
  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    window.location.href = `detalhes-produto.html?id=${product.id}`;
  });
  return card;
}

// Gera o rating de cada produto conforme definido no ficheiro .json.
function gerarRating(avaliacoes) {
  if (!avaliacoes) {
    avaliacoes = [];
  }

  let totalEstrelas = 0;
  for (let avaliacao of avaliacoes) {
    totalEstrelas += avaliacao.estrelas;
  }
  let mediaEstrelas =
    avaliacoes.length > 0 ? totalEstrelas / avaliacoes.length : 0;
  let estrelas = '';
  for (let i = 0; i < 5; i++) {
    if (i < mediaEstrelas) {
      estrelas += '&#9733';
    } else {
      estrelas += '&#10032';
    }
  }
  return { mediaEstrelas, estrelas };
}

async function gerarDetalhesDoProduto() {
  const produtos = await getAllProducts();
  const containerDetalhes = document.querySelector('.detalhes-container');
  const urlParams = new URLSearchParams(window.location.search);
  const idDoProduto = urlParams.get('id');
  containerDetalhes.innerHTML = '';

  const produto = produtos.find(prod => prod.id === idDoProduto);
  const rating = gerarRating(produto.avaliacoes);

  if (produto) {
    containerDetalhes.innerHTML = `
    <div class="imagem">
      <img src="${produto.imagem}" alt="${produto.titulo}" />
    </div>
    <div class="detalhes">
      <h1>${produto.titulo}</h1>
      <h4>${produto.local}</h4>
      <h2>${produto.categoria}</h2>
      <a id="link-avaliacoes" href="#">
      <h3>
        ${produto.avaliacoes.length == 0 ? 'Sem avaliações' : rating.estrelas}
        <span id="numero-avaliacoes">
        (${produto.avaliacoes.length} avaliações)
        </span>
      </h3>
      </a>
      <h6>${parseFloat(produto.preco).toFixed(2)}€</h6>
      <h2>Publicado por ${produto.userAutor} em ${produto.dataDePublicacao}<h2>
      <p>${produto.descricao}</p>
      <button type="button" title="Enviar Mensagem\nFuncionalidade não implementada">
    Enviar Mensagem <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
    </button>
      <button type="button" title="Editar Produto" onclick="mostrarFormularioEdicao('${
        produto.id
      }')">Editar <i class="fa fa-pencil" aria-hidden="true"></i></button>
      <button type="button" title="Eliminar Produto" onclick="eliminarProduto('${
        produto.id
      }')">Eliminar <i class="fa fa-times" aria-hidden="true"></i></button>
    </div>
    `;

    let avaliacoesVisiveis = false;
    document
      .getElementById('link-avaliacoes')
      .addEventListener('click', function (event) {
        event.preventDefault();
        const avaliacoesContainer = document.querySelector('.avaliacoes');
        if (avaliacoesVisiveis) {
          avaliacoesContainer.innerHTML = '';
        } else {
          avaliacoesContainer.innerHTML = '';
          produto.avaliacoes.forEach(avaliacao => {
            const avaliacaoElement = document.createElement('div');
            avaliacaoElement.className = 'avaliacao';
            avaliacaoElement.innerHTML = `
              <h4>
              ${avaliacao.autor}  <span>(${avaliacao.data})<span>
              </h4>
              <div class="rating">${gerarRating([avaliacao])}</div>
              <p>${avaliacao.texto}</p>
              <hr id="separador" />
            `;
            avaliacoesContainer.appendChild(avaliacaoElement);
          });
        }
        avaliacoesVisiveis = !avaliacoesVisiveis;
      });
  } else {
    alert('Produto não encontrado!');
  }
}

async function getProductsByIds(ids) {
  const products = await getAllProducts();
  return products.filter(product => ids.includes(product.id));
}

/* LOGIN */
async function submitLoginForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  const requestURL = loginRequestURL;
  const response = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Username: username,
      Password: password,
    },
  });

  if (response.ok) {
    const result = await response.json();
    alert('Login bem sucedido! Bem- vindo/a, ' + result.nome);
    console.log('login successful', result);

    const userProducts = await getProductsByIds(result.produtos);
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        username: result.username,
        password: result.password,
        nome: result.nome,
        email: result.email,
        telefone: result.telefone,
        localizacao: result.localizacao,
        imagem: result.imagem,
        produtos: userProducts,
      })
    );
    window.location.href = 'index.html';
  } else {
    alert('Login falhou! Por favor verifique as suas credenciais.');
  }
}

async function displayUser() {
  const user = JSON.parse(sessionStorage.getItem('user')) || [];
  if (!user) {
    document.getElementById('perfil-utilizador').innerHTML =
      '<p>Utilizador não encontrado</p>';
    return;
  }
  document.getElementById('nome').value = user.nome;
  document.getElementById('username').value = user.username;
  document.getElementById('telefone').value = user.telefone;
  document.getElementById('email').value = user.email;
  document.getElementById('profile-pic').value = user.imagem;
  document.querySelector('.imagem-perfil').src = user.imagem;

  const productsContainer = document.querySelector('.card-container');
  productsContainer.innerHTML = '';
  const products = user.produtos || [];
  if (products.length === 0) {
    productsContainer.innerHTML =
      '<h2>Ainda não adicionou nenhum produto para venda!</h2>';
  } else {
    products.forEach(product => {
      const card = createCard(product);
      productsContainer.appendChild(card);
    });
  }
}

async function toggleFormUserEdit() {
  document
    .getElementById('toggle-readonly')
    .addEventListener('click', function () {
      const formElements = document.querySelectorAll('#perfil-form input');
      const passwordWrapper = document.querySelector('.password-wrapper');
      const confirmPasswordWrapper = document.querySelector(
        '.confirm-password-wrapper'
      );
      const saveChangesToUser = document.querySelector('.save-user-changes');

      let isReadOnly = true;

      formElements.forEach(element => {
        if (element.id !== 'username') {
          if (element.hasAttribute('readonly')) {
            element.removeAttribute('readonly');
            isReadOnly = false;
          } else {
            element.setAttribute('readonly', 'readonly');
          }
        }
      });

      if (isReadOnly) {
        passwordWrapper.classList.add('hidden');
        confirmPasswordWrapper.classList.add('hidden');
        saveChangesToUser.classList.add('hidden');
      } else {
        passwordWrapper.classList.remove('hidden');
        confirmPasswordWrapper.classList.remove('hidden');
        saveChangesToUser.classList.remove('hidden');
        updateExistentUser();
      }

      const button = document.getElementById('toggle-readonly');
      if (isReadOnly) {
        button.textContent = 'Editar';
      } else {
        button.textContent = 'Cancelar';
      }
    });
}

async function addNewUser() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  passwordInput.addEventListener('input', validatePasswords);
  confirmPasswordInput.addEventListener('input', validatePasswords);

  function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      confirmPasswordInput.setCustomValidity(
        'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
      );
    } else if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity('As passwords não coincidem.');
    } else {
      confirmPasswordInput.setCustomValidity('');
    }
  }

  document
    .getElementById('formulario_novo_registo')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() === true) {
        const username = document.getElementById('username').value;
        // Verificar se o username já existe
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          const usernameInput = document.getElementById('username');
          usernameInput.setCustomValidity(
            'O username já existe. Por favor escolha outro.'
          );
          usernameInput.reportValidity();
          return;
        }

        const newUser = {
          nome: document.getElementById('nome').value,
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          telefone: document.getElementById('telefone').value,
          imagem: document.getElementById('fotografia').value,
        };

        const response = await fetch(registerRequestURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          alert('Utilizador registado! Bem-vindo/a, ' + newUser.nome);
          window.location.href = 'pagina-login.html';
        } else {
          alert('Erro ao registar utilizador. Tente novamente.');
        }
      } else {
        alert('Erro ao registar utilizador. Tente novamente.');
        return;
      }
    });
}

function validateFormPassword() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert(
      'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert('As passwords não coincidem.');
    return false;
  }

  return true;
}

async function checkUsernameExists(username) {
  const response = await fetch(
    `${rootPath}/users/check-username?username=${username}`
  );
  if (response.ok) {
    const result = await response.json();
    return result.exists; // Supondo que a API retorna um objeto { exists: true/false }
  } else {
    console.error('Erro ao verificar username:', response.statusText);
    return false;
  }
}

async function updateExistentUser() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const updatedUser = {
    nome: document.getElementById('nome').value,
    username: user.username, // Username não pode ser alterado
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    imagem: document.getElementById('profile-pic').value,
  };

  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  passwordInput.addEventListener('input', validatePasswords);
  confirmPasswordInput.addEventListener('input', validatePasswords);

  function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      confirmPasswordInput.setCustomValidity(
        'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
      );
    } else if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity('As passwords não coincidem.');
    } else {
      confirmPasswordInput.setCustomValidity('');
      updatedUser.password = password;
      console.log('As passwords foram validadas');
    }
  }

  document
    .getElementById('perfil-form')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() == true) {
        const requestURL = `${rootPath}/users/${user.username}`;
        const response = await fetch(requestURL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          const result = await response.json();
          const userProducts = await getProductsByIds(result.produtos);
          result.produtos = userProducts;
          alert('Dados atualizados com sucesso!');
          sessionStorage.setItem('user', JSON.stringify(result));
          window.location.reload();
        } else {
          alert('Erro ao atualizar os dados. Tente novamente.');
        }
      }
    });
}
