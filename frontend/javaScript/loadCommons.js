'use strict';

const rootPath = 'http://localhost:8080/mariana-jorge-proj2/rest';
const productsPath = `${rootPath}/products`;

export async function loadCommonElements() {
  fetch('common/newProductModal.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Erro ao carregar o modal:', error));

  fetch('common/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .then(() => {
      welcomeMessage();
      addModalListeners();
    })
    .catch(error => console.error('Erro ao carregar o cabeçalho:', error));

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
    user = JSON.parse(sessionStorage.getItem('user'));
  } catch (error) {
    console.error('Erro a ler user da sessionStorage', error);
  }

  if (user) {
    openModalBtn.classList.remove('hidden');
    welcomeMessage.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    loginButton.classList.add('hidden');
    profilePicture.classList.remove('hidden');
    profilePicture.src = user.imagem;
    welcomeMessage.innerHTML = `<a href="perfil-utilizador.html">Bem-vindo/a ${user.nome}</a>!`;

    logoutButton.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
  } else {
    openModalBtn.classList.add('hidden');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
    profilePicture.classList.add('hidden');
  }
}

async function addModalListeners() {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('openModalBtn');
  const span = document.getElementsByClassName('close')[0];
  const cancel = document.getElementById('cancelar');
  const form = document.getElementById('form-novo-produto');
  /*const submitBtn = document.getElementById('submitBtn');*/

  btn.onclick = function () {
    modal.style.display = 'block';
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

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Novo Produto Submetido');
    alert('Produto adicionado com Sucesso');

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const categoria =
      document.querySelector("select[name='categoria']").value || 'N/A';
    const tamanho =
      document.querySelector("select[name='tamanho']").value || 'N/A';
    const preco = document.getElementByID('preco').value;
    const imagem = document.getElementById('imagem').value;
    const localizacao = document.getElementById('localizacao').value;

    const novoProduto = {
      titulo: titulo,
      descricao: descricao,
      categoria: categoria,
      tamanho: tamanho,
      preco: preco,
      imagem: imagem,
      localizacao: localizacao,
    };

    console.log('Dados do novo produto:', JSON.stringify(novoProduto, null, 2));

    try {
      const result = await sendNewProductReq(novoProduto);
      console.log('Produto enviado com sucesso:', result);
      modal.style.display = 'none';
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar o produto:', error);
    }
  });
}

async function sendNewProductReq(product) {
  console.log('estou dentro da função sendNewRequest');
  try {
    const requestURL = productsPath;
    const response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar o produto: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao enviar o produto:', error);
    throw error;
  }
}
