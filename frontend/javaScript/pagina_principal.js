window.onload = function () {
  const username = sessionStorage.getItem("username");
  const loginLink = document.getElementById("botao_login");
  const welcomeMessage = document.getElementById("bem-vindo");
  const logoutSection = document.getElementById("logout");

  if (username) {
    // Se o usuário estiver logado, esconder o botão de login e mostrar o nome
    loginLink.classList.add("hidden");
    welcomeMessage.style.display = "block";
    welcomeMessage.innerHTML = `Bem-vindo/a, <a href="pagina_perfil_utilizador.html">${username}</a>!`;
    logoutSection.style.display = "block";
    document.getElementById("username").textContent = username;
  }
};

function logout() {
  sessionStorage.removeItem("username");
  location.reload();
}
