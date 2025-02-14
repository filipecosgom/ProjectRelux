document
  .getElementById("formulario_login")
  .addEventListener("submit", function (event) {
    event.preventDefault(); //Isto faz com que quando clicamos no botão de submeter o formulário não recarregue a página

    let username = document.getElementById("username").value;

    console.log(username.value);

    //armazenar o nome no sessionStorage
    sessionStorage.setItem("username", username);

    //mostrar mensagem de boas-vindas
    alert("Bem-vindo, " + username + "!");

    //redirecionar para a página principal
    window.location.href = "index.html";
    console.log("Estou a fazer login");
  });
