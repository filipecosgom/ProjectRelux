const rootPath = "http://localhost:8080/mariana-jorge-proj2/rest";
const registerRequestURL = `${rootPath}/users/register`;

function addNewUser() {
  document
    .getElementById("formulario_novo_registo")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const dadosUtilizador = {
        nome: document.getElementById("nome").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        telefone: document.getElementById("telefone").value,
        fotografia: document.getElementById("fotografia").value,
      };

      const response = await fetch(registerRequestURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosUtilizador),
      });

      if (response.ok) {
        alert("Utilizador registado! Bem-vindo/a, " + dadosUtilizador.username);
        window.location.href = "pagina-login.html";
      } else {
        alert("Erro ao registar utilizador. Tente novamente.");
      }
    });
}
