'use strict';

const rootPath = 'http://localhost:8080/mariana-jorge-proj2/rest';

const addProductURL = `${rootPath}/products/add`;

document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
});

async function getAllProducts() {
  const requestURL = `${rootPath}/products/all`;
  const request = new Request(requestURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const response = await fetch(request);
  const products = await response.json();
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

async function displayProducts() {
  const mainContainer = document.querySelector('.card-container');
  const products = await getAllProducts();
  mainContainer.innerHTML = '';
  products.forEach(p => {
    //console.log(p);
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
  console.log(products);
}

// Cria a card do produto
function createCard(produto) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.titulo}" />
    <div>
      <h1>${produto.titulo}</h1>
      <h4>${produto.local}</h4>
      <h2>${produto.categoria}</h2>
      <h3 class="rating">rating</h3>
      <span>${parseFloat(produto.preco).toFixed(2)}€</span>
      <button type="button" title="descricao">Saber mais</button>
    </div>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    window.location.href = `detalhes-produtos.html?id=${produto.id}`;
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
