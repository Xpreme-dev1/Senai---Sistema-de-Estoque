async function filtroEstoque(){
    try{    
    const nome = document.getElementById("pesquisarNome").value;
    const tipo = document.getElementById("tipoMovimentacao").value;
    const data = document.getElementById("filtroData").value;

    const response = await fetch("http://localhost:8080/api/estoque");
    const daos = await response.json();


    const url = `http://localhost:8080/api/estoque?nome=${encodeURIComponent(nome)}
                &tipo=${encodeURIComponent(tipo)}&data=${encodeURIComponent(data)}`;

    const tabela = document.getElementById("corpoTabela");
    tabela.innerHTML = "";

    const filtrados = dados.filter(item =>{
        const matchNome = nome === "" || item.nomeProduto.totalCase().includes(nome);
        const matchTipo = tipo === "" || item.status === tipo;
        const matchData = datat === "" || item.datafabricação === data;

        return matchNome && matchTipo && matchData;
    });

    filtrados.forEach(item =>{
        const linha = `
            <tr>
                <td>${item.cadigoBarras}</td>
                <td>${item.nomeProduto}</td>
                <td>${item.fabricante}</td>
                <td>${item.marca}</td>
                <td>${item.quantidade}</td>
                <td>${parseFloat(item.valor).toFixed(2)}</td>
                <td>${parseFloat(item.total).toFixed(2)}</td>
                <td>${item.status}</td>
            </tr>
        `

    });
    }catch (erro){
        console.error("erro ao filtro", erro);
    }
}

document.getElementById("btnPesquisar").addEventListener("click", filtroEstoque);