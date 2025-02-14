 document.addEventListener("DOMContentLoaded", function () {
            // Acede ao ID do produto
            const produtoId = localStorage.getItem("produtoSelecionado");

            if (!produtoId) {
                document.getElementById("produto_detalhes").innerHTML = "<p>Produto não encontrado.</p>";
                return;
            }

            // Procurar produto no localStorage
            const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
            let produtoAtual = null;

            for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id == produtoId) {
            produtoAtual = produtos[i];
            break;
        }
    }

    if (!produtoAtual) {
        document.getElementById("produto_detalhes").innerHTML = "<p>Produto não encontrado.</p>";
        return;
    }


// Ocultar campos eliminados ao carregar a página

    let camposEliminados = JSON.parse(localStorage.getItem("camposEliminados")) || [];
    for (let i = 0; i < camposEliminados.length; i++) {
        const idCampo = camposEliminados[i];
        const elemento = document.getElementById(idCampo);
        if (elemento) {
            elemento.parentElement.remove(); // Remove o campo e o seu rótulo, recorrendo ao parentElement
        }
    }
 

        
            document.getElementById("produto_detalhes").innerHTML = `
                <img src="${produtoAtual.imagem}" alt="${produtoAtual.titulo}" style="max-width: 300px;">
            `;
        
            // Verifica se o campo foi removido antes de mostrar
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("titulo")) {
                if (produtoAtual.titulo) document.getElementById("inputTitulo").value = produtoAtual.titulo;
            } else {
                document.getElementById("campo-titulo").style.display = "none";
            }
        
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("descricao")) {
                if (produtoAtual.descricao) document.getElementById("inputDescricao").value = produtoAtual.descricao;
            } else {
                document.getElementById("campo-descricao").style.display = "none";
            }
        
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("categoria")) {
                if (produtoAtual.categoria) document.getElementById("inputCategoria").value = produtoAtual.categoria;
            } else {
                document.getElementById("campo-categoria").style.display = "none";
            }
        
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("tamanho")) {
                if (produtoAtual.tamanho) document.getElementById("inputTamanho").value = produtoAtual.tamanho;
            } else {
                document.getElementById("campo-tamanho").style.display = "none";
            }
        
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("preco")) {
                if (produtoAtual.preco) document.getElementById("inputPreco").value = produtoAtual.preco;
            } else {
                document.getElementById("campo-preco").style.display = "none";
            }
        
            if (!produtoAtual.camposRemovidos || !produtoAtual.camposRemovidos.includes("localizacao")) {
                if (produtoAtual.localizacao) document.getElementById("inputLocalizacao").value = produtoAtual.localizacao;
            } else {
                document.getElementById("campo-localizacao").style.display = "none";
            }
        

            // Carregar as informações extra numa lista (se existirem)
            const infoExtraLista = document.getElementById("infoExtra");
            if (produtoAtual.infoExtra && produtoAtual.infoExtra.length > 0) {
                for (let i = 0; i < produtoAtual.infoExtra.length; i++) {
                    let li = document.createElement("li");
                    li.textContent = produtoAtual.infoExtra[i];
                    infoExtraLista.appendChild(li);
                }
            } else {
                infoExtraLista.innerHTML = "<li>Nenhuma informação extra</li>";
            }
        });


// Função para eliminar um campo completamente
function eliminarCampo(idCampo) {
    const elementoCampo = document.getElementById(idCampo);
    
    if (elementoCampo) {
        elementoCampo.parentElement.remove(); // Remove não só o input, mas também a div que o contém.
    }

    const produtoId = localStorage.getItem("produtoSelecionado");
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    let produtoAtual = null;

            for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id == produtoId) {
            produtoAtual = produtos[i];
            break;
        }
    }
    if (produtoAtual) {
        const campoNome = idCampo.replace("input", "").toLowerCase(); // Exemplo: inputTitulo → titulo
        if (produtoAtual.hasOwnProperty(campoNome)) {
            delete produtoAtual[campoNome]; // Remove a propriedade do objeto
        }
        // Salvar no localStorage que esse campo foi removido; a eliminação só se torna definitiva ao carregar em guardar alterações. Assim, os campos ainda podem ser recuperados mais tarde, antes de clicar em Guardar 
        if (!produtoAtual.camposRemovidos) {
            produtoAtual.camposRemovidos = [];
        }
        if (!produtoAtual.camposRemovidos.includes(campoNome)) {
            produtoAtual.camposRemovidos.push(campoNome);
        }

        localStorage.setItem("produtos", JSON.stringify(produtos));
    }
}






// Função para guardar as alterações no localStorage
function guardarAlteracoes() {
    const produtoId = localStorage.getItem("produtoSelecionado");

    if (!produtoId) {
        alert("Erro: Produto não encontrado!");
        return;
    }

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    let produtoAtual=null;
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id == produtoId) {
            produtoAtual = produtos[i];
            break;
        }
    }

    if (!produtoAtual) {
        alert("Erro: Produto não encontrado!");
        return;
    } 

    // Atualizar os valores apenas se os campos ainda existirem
    if (document.getElementById("inputTitulo")) {
        produtoAtual.titulo = document.getElementById("inputTitulo").value;
    }
    if (document.getElementById("inputDescricao")) {
        produtoAtual.descricao = document.getElementById("inputDescricao").value;
    }
    if (document.getElementById("inputCategoria")) {
        produtoAtual.categoria = document.getElementById("inputCategoria").value;
    }
    if (document.getElementById("inputTamanho")) {
        produtoAtual.tamanho = document.getElementById("inputTamanho").value;
    }
    if (document.getElementById("inputPreco")) {
        produtoAtual.preco = document.getElementById("inputPreco").value;
    }
    if (document.getElementById("inputLocalizacao")) {
        produtoAtual.localizacao = document.getElementById("inputLocalizacao").value;
    }
    // Guardar no localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));

// Limpar a lista de campos eliminados
localStorage.removeItem("camposEliminados"); 

    // Exibir mensagem de sucesso e recarregar a página
    alert("Alterações guardadas com sucesso!");
}






function adicionarInfoExtra() {
    const novaInfo = document.getElementById("novaInfo").value;
    const produtoId = localStorage.getItem("produtoSelecionado");

    if (!novaInfo) {
        document.getElementById("mensagem_informacao_adicionada").innerHTML = "Preencha o campo acima.";
        return;
    }

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    let produtoAtual = null;
for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id == produtoId) {
        produtoAtual = produtos[i];
        break; 
    }
}

    if (!produtoAtual) {
        alert("Erro: Produto não encontrado!");
        return;
    }

    // Adicionar nova informação ao array de informações extras
    if (!produtoAtual.infoExtra) {
        produtoAtual.infoExtra = [];
    }
    produtoAtual.infoExtra.push(novaInfo);

    // Atualizar o produto no localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));

    

    // Limpar campo de input
    document.getElementById("novaInfo").value = "";

    // Recarregar a página automaticamente após adicionar informação
    location.reload();

    alert("Nova informação adicionada com sucesso!");
}



function eliminarProdutoAtual() {
    const produtoId = localStorage.getItem("produtoSelecionado");

    if (!produtoId) {
        alert("Erro: Nenhum produto selecionado!");
        return;
    }

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    
    // Cria um novo array, a partir de produtos, mas sem o produto eliminado, encontrado pelo id 
    let produtosAtualizados = [];
for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id != produtoId) {
        produtosAtualizados.push(produtos[i]);
    }
}
produtos = produtosAtualizados; // Atualiza o array original

    // Atualizar o localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));

    // Remover o ID do produto selecionado do localStorage
    localStorage.removeItem("produtoSelecionado");

    alert("Produto eliminado com sucesso!");

    // Redirecionar para a página principal ou outra página desejada
    window.location.href = "Pagina_principal.html";
}
       


//função para controlar o envio de uma mensagem ao vendedor
function submeterMensagem() {
    if(document.getElementById("area_mensagem").value !== ""){   
    document.getElementById("mensagem").innerHTML = "Mensagem enviada com sucesso!";
    document.getElementById("area_mensagem").value = "";
}
else document.getElementById("mensagem").innerHTML = "Escreva algo.";    
  }


