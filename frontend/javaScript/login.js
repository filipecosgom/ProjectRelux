/* LOGIN */
const rootPath = 'http://localhost:8080/mariana-jorge-proj2/rest';
const loginRequestURL = `${rootPath}/users/login`; // URL para o pedido de login

async function submitLoginForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  const loginData = {
    username: username,
    password: password,
  };

  const requestURL = loginRequestURL;
  const response = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (response.ok) {
    const result = await response.json();
    alert('Login bem sucedido! Bemvindo, ' + result.nome);
    console.log('login successful', result);
    // TODO: adcicionar o nome do utilizador à sessionStorage e redicionar para a página principal
    sessionStorage.setItem('username', result.username);
    window.location.href = 'index.html';
  } else {
    alert('Login falhou! Por favor verifique as suas credenciais.');
  }
}
