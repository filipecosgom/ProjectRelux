'use strict';

export async function loadHeaderFooter() {
  fetch('common/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .then(() => {
      welcomeMessage();
      addNewProduct();
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
    welcomeMessage.innerHTML = `<a href="pagina_perfil_utilizador.html">Bemvindo/a ${user.nome}</a>!`;

    logoutButton.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
  } else {
    openModalBtn.classList.add('hidden');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
  }
}

async function addNewProduct() {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('openModalBtn');
  const span = document.getElementsByClassName('close')[0];

  console.log(modal, btn, span);

  btn.onclick = function () {
    modal.style.display = 'block';
  };

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
