'use strict';

const rootPath = 'http://localhost:8080/mariana-jorge-proj2/rest';
const getAllProductsURL = `${rootPath}/products/all`;
const addProductURL = `${rootPath}/products/add`;

document.addEventListener('DOMContentLoaded', () => {
  displayMostRecentProducts();
  displayMostRatedProducts();
});

async function getAllProducts() {
  const requestURL = getAllProductsURL;
  const request = new Request(requestURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const response = await fetch(request);
  const products = await response.json();
  console.log(products);
  return products;
}

async function addProduct(product) {
  const requestURL = addProductURL;
  const request = new Request(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  const response = await fetch(request);
  const result = await response.json();
  return result;
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
  console.log(products);
}

async function displayMostRatedProducts() {
  const mainContainer = document.querySelector('.most-rated-products');
  const products = await getAllProducts();
  const mostRatedProducts = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRatedProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}

// Cria a card do produto
function createCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.imagem}" alt="${product.titulo}" />
    <div>
      <h1>${product.titulo}</h1>
      <h4>${product.local}</h4>
      <h2>${product.categoria}</h2>
      <h3 class="rating">${gerarRating(product.avaliacoes)}</h3>
      <span>${parseFloat(product.preco).toFixed(2)}€</span>
      <button type="button" title="descricao">Saber mais</button>
    </div>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    window.location.href = `detalhes-produtos.html?id=${product.id}`;
  });

  return card;
}

// Gera o rating de cada produto conforme definido no ficheiro .json.
function gerarRating(avaliacoes) {
  let totalEstrelas = 0;
  for (let avaliacao of avaliacoes) {
    totalEstrelas += avaliacao.estrelas;
  }
  let mediaEstrelas = totalEstrelas / avaliacoes.length;

  let estrelas = '';
  for (let i = 0; i < 5; i++) {
    if (i < mediaEstrelas) {
      estrelas += '&#9733';
    } else {
      estrelas += '&#10032';
    }
  }
  return estrelas;
}
