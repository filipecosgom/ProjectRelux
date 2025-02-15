/*Funções para abrir e fechar o formulário de adicionar novo produto*/

function openForm() {
  document.getElementById("formulario_novo_produto").style.display = "block";
}

function closeForm() {
  document.getElementById("formulario_novo_produto").style.display = "none";
}

// Função para carregar os produtos do localStorage e criar os cartões
document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("formulario_novo_produto");
  const listaProdutos = document.querySelector(".lista_produtos");

  if (!form) {
    console.error("Erro: Formulário não encontrado!");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita recarregar a página
    console.log("Formulário submetido!");

    // Recuperar array de produtos do localstorage, ou iniciar

    // JSON makes it possible to store JavaScript objects as text, using stringify
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    // Guarda todos os valores que vêm do formulário

    console.log("estou a carregar um produto com todas as caracteristicas");

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const categoria =
      document.querySelector("select[name='categoria']").value || "N/A";
    const tamanho =
      document.querySelector("select[name='tamanho']").value || "N/A";
    const preco = document.querySelector(".Preço input").value;
    const imagem = document.getElementById("imagem").value;
    const localizacao = document.querySelector(".Localização input").value;

    // Criar um ID para cada produto baseado no tamanho do array. Cada id é igual ao valor do ultimo criado, +1
    let novoId;

    if (produtos.length > 0) {
      novoId = produtos[produtos.length - 1].id + 1;
    } else {
      novoId = 1;
    }

    // Guardar localStorage
    const produto = {
      id: novoId,
      titulo,
      descricao,
      categoria,
      tamanho,
      preco,
      imagem,
      localizacao,
    };

    // Adicionar ao array dos produtos, com método de javascript push
    produtos.push(produto);
    localStorage.setItem("produtos", JSON.stringify(produtos));

    // Cria o cartão do produto
    const novoProduto = document.createElement("div");
    novoProduto.classList.add("cartao_produto");
    novoProduto.innerHTML = `
    <img src="${imagem}" alt="${titulo}">
    <h2 class="categoria">${categoria}</h2>
    <p class="product-description">${descricao} </p>
    <p class="product-price">${preco} €</p>
    <button class="botao_comprar_produto" onclick="verDetalhesProduto('${produto.id}')">Comprar</button> `;

    // Adicionar o novo produto à lista de produtos
    listaProdutos.appendChild(novoProduto);
    alert("Produto adicionado com sucesso!");
  });

  // Carregar produtos do localStorage ao iniciar a página
  carregarProdutos();

  function carregarProdutos() {
    // listaProdutos.innerHTML = ""; // Limpar antes de carregar para evitar duplicação de um produto

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    if (produtos.length == 0) {
      console.log("Não há produtos guardados no localStorage");
      return;
    }

    console.log("Há produtos guardados no localStorage");

    for (let i = 0; i < produtos.length; i++) {
      console.log("entrei no ciclo para gerar os cartoes");

      const produto = produtos[i];

      const novoProduto = document.createElement("div");
      novoProduto.classList.add("cartao_produto");
      novoProduto.innerHTML = `<img src="${produto.imagem}" alt="${produto.titulo}">
                <h2 class="categoria">${produto.categoria}</h2>
                <p class="product-description">${produto.descricao} </p>
                <p class="product-price">${produto.preco} €</p>
                <button class="botao_comprar_produto" onclick="verDetalhesProduto('${produto.id}')">Comprar</button> `;

      listaProdutos.appendChild(novoProduto);
    }
  }
});

// Atualizar a lista de produtos na página
carregarProdutos();

function verDetalhesProduto(produtoId) {
  localStorage.setItem("produtoSelecionado", produtoId);
  window.location.href = "pagina_detalhe_produto.html";
}
