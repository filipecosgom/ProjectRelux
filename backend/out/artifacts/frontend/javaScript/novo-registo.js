function Add_new_user() {
  document
    .getElementById("formulario_novo_registo")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const dados_utilizador = {
        primeiro_nome: document.getElementById("primeiro_nome").value,
        ultimo_nome: document.getElementById("ultimo_nome").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        telefone: document.getElementById("telefone").value,
        fotografia: document.getElementById("fotografia").value,
      };
      const jsonData = JSON.stringify(dados_utilizador);

      const response = await fetch(
        "http://localhost:8080/my_activities_backend/rest/users/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonData,
        }
      );

      if (response.ok) {
        alert("Utilizador registado! Bem vindo," + username);
      } else {
        alert("ERRO!!!!!!!!!!!!.");
      }
    });
}
