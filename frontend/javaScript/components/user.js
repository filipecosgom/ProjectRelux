'use strict';

import * as userAPI from '../api/userAPI.js';
import * as productAPI from '../api/productAPI.js';
import * as productComponent from './product.js';

export async function submitLoginForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  try {
    const response = await fetch(
      'http://localhost:8080/mariana-filipe-proj3/rest/users/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      const token = await response.text();

      console.log('estamos aqui', token);

      sessionStorage.setItem('token', token);

      sessionStorage.setItem('isUserLoggedin', true);

      window.location.href = 'index.html';
    } else {
      alert('Login falhou! Por favor verifique as suas credenciais.');
    }
  } catch (error) {
    alert('Erro ao fazer login. Tente novamente.');
    console.error('Erro no login:', error);
  }
}

export async function logout() {
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch(
      'http://localhost:8080/mariana-filipe-proj3/rest/users/logout',
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      sessionStorage.clear();
      window.location.href = 'pagina-login.html';
    } else {
      alert('Logout falhou!');
    }
  } catch (error) {
    alert('Erro ao fazer logou. Tente novamente.');
    console.error('Erro no logout:', error);
  }
}

export async function displayUser() {
  const user = JSON.parse(sessionStorage.getItem('user')) || [];
  if (!user) {
    document.getElementById('perfil-utilizador').innerHTML =
      '<p>Utilizador não encontrado</p>';
    return;
  }
  document.getElementById('primeiroNome').value = user.primeiroNome;
  document.getElementById('ultimoNome').value = user.ultimoNome;
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
      const card = productComponent.createCard(product);
      productsContainer.appendChild(card);
    });
  }

  //Para verificar se o utilizador é ou não é administrador

  if (user.isAdmin) {
    document.getElementById('admin-section').style.display = 'block';
  } else {
    document.getElementById('admin-section').style.display = 'none';
  }
}

export async function toggleFormUserEdit() {
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

export async function addNewUser() {
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
        const usernameExists = await userAPI.checkUsernameExists(username);
        if (usernameExists) {
          const usernameInput = document.getElementById('username');
          usernameInput.setCustomValidity(
            'O username já existe. Por favor escolha outro.'
          );
          usernameInput.reportValidity();
          return;
        }

        const newUser = {
          firstName: document.getElementById('nome').value,
          lastName: document.getElementById('apelido').value,
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          telefone: document.getElementById('telefone').value,
          imagem: document.getElementById('fotografia').value,
        };

        try {
          await userAPI.registerUser(newUser);
          alert('Utilizador registado! Bem-vindo/a, ' + newUser.firstName);
          window.location.href = 'pagina-login.html';
        } catch (error) {
          alert('Erro ao registar utilizador. Tente novamente.');
          console.error(error);
        }
      } else {
        alert('Erro ao registar utilizador. Tente novamente.');
        return;
      }
    });
}

export function validateFormPassword() {
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

export async function updateExistentUser() {
  let updatedUser = {};
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
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
      updatedUser = {
        nome: document.getElementById('nome').value,
        username: loggedInUser.username, // Username não pode ser alterado
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        imagem: document.getElementById('profile-pic').value,
        password: password,
      };
      console.log('As passwords foram validadas');
      console.log(updatedUser);
    }
  }

  document
    .getElementById('perfil-form')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() == true) {
        try {
          const result = await userAPI.updateUser(updatedUser);
          if (result.produtos && result.produtos.length > 0) {
            const userProducts = await productComponent.getProductsByIds(
              result.produtos
            );
            result.produtos = userProducts;
          } else {
            result.produtos = [];
          }
          alert('Dados atualizados com sucesso!');
          sessionStorage.setItem('user', JSON.stringify(result));
          window.location.reload();
        } catch (error) {
          alert('Erro ao atualizar os dados. Tente novamente.');
          console.error(error);
        }
      }
    });
}
