/**
 * Lógica da tela de Gerenciamento de Estoque.
 * Realiza a integração com o backend Java via Fetch API.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carregamento inicial dos dados
    carregarProdutos();
    carregarReposicao();
    carregarHistorico();

    // Listener para o formulário de movimentação
    const formMov = document.getElementById('formMovimentacao');
    formMov.addEventListener('submit', registrarMovimentacao);

    // Listener para geração de solicitação de compra
    const btnCompra = document.getElementById('btnSolicitarCompra');
    btnCompra.addEventListener('click', gerarSolicitacaoCompra);
});

/**
 * Busca todos os produtos para preencher o select e a tabela de status.
 */
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const produtos = await response.json();
        
        const select = document.getElementById('produtoSelect');
        const corpoTabela = document.getElementById('corpoTabelaProdutos');
        
        select.innerHTML = '<option value="">Selecione um produto</option>';
        corpoTabela.innerHTML = '';

        produtos.forEach(p => {
            // Preencher Select do formulário
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nomeProduto;
            select.appendChild(option);

            // Regra 5: Status automático (Repor ou OK)
            const status = p.quantidade <= p.estoqueMinimo ? 'Repor estoque' : 'OK';
            const statusClass = p.quantidade <= p.estoqueMinimo ? 'status-repor' : 'status-ok';
            
            // Preencher Tabela de Status
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nomeProduto}</td>
                <td>${p.quantidade}</td>
                <td>${p.localArmazenamento || 'N/A'}</td>
                <td>${p.estoqueMinimo}</td>
                <td class="${statusClass}">${status}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

/**
 * Busca produtos que precisam de reposição.
 */
async function carregarReposicao() {
    try {
        const response = await fetch('/api/produtos/reposicao');
        const produtos = await response.json();
        
        const corpoTabela = document.getElementById('corpoTabelaReposicao');
        corpoTabela.innerHTML = '';

        produtos.forEach(p => {
            // Cálculo sugerido: Dobro do mínimo menos o atual
            const sugerido = p.estoqueMinimo * 2 - p.quantidade;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nomeProduto}</td>
                <td>${p.quantidade}</td>
                <td>${p.estoqueMinimo}</td>
                <td>${sugerido > 0 ? sugerido : p.estoqueMinimo}</td>
                <td>${p.localArmazenamento || 'N/A'}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar reposição:', error);
    }
}

/**
 * Busca o histórico de movimentações realizadas.
 */
async function carregarHistorico() {
    try {
        const response = await fetch('/api/movimentacoes');
        const movimentacoes = await response.json();
        
        const corpoTabela = document.getElementById('corpoTabelaHistorico');
        corpoTabela.innerHTML = '';

        movimentacoes.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarData(m.dataMovimentacao)}</td>
                <td>${m.nomeProduto}</td>
                <td>${m.tipo}</td>
                <td>${m.quantidade}</td>
                <td>${m.observacao || '-'}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

/**
 * Envia os dados da nova movimentação para o servidor.
 */
async function registrarMovimentacao(e) {
    e.preventDefault();
    
    const msgErro = document.getElementById('msgErro');
    msgErro.style.display = 'none';

    const mov = {
        produtoId: parseInt(document.getElementById('produtoSelect').value),
        tipo: document.getElementById('tipoMov').value,
        quantidade: parseInt(document.getElementById('qtdMov').value),
        dataMovimentacao: document.getElementById('dataMov').value,
        observacao: document.getElementById('obsMov').value
    };

    try {
        const response = await fetch('/api/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mov)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
            document.getElementById('formMovimentacao').reset();
            // Atualiza todas as tabelas após a mudança
            carregarProdutos();
            carregarReposicao();
            carregarHistorico();
        } else {
            // Regra 3: Mostrar erro "Quantidade insuficiente em estoque."
            msgErro.textContent = result.message;
            msgErro.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao registrar movimentação:', error);
        alert('Erro ao processar requisição.');
    }
}

/**
 * Gera um arquivo de texto com a solicitação de compra baseada na tabela de reposição.
 */
function gerarSolicitacaoCompra() {
    const linhas = document.querySelectorAll('#corpoTabelaReposicao tr');
    if (linhas.length === 0) {
        alert('Não há itens para reposição no momento.');
        return;
    }

    let solicitacao = 'SOLICITAÇÃO DE COMPRA\n\n';
    linhas.forEach(linha => {
        const cols = linha.querySelectorAll('td');
        solicitacao += `Produto: ${cols[0].textContent}\n`;
        solicitacao += `Qtd Atual: ${cols[1].textContent}\n`;
        solicitacao += `Estoque Mínimo: ${cols[2].textContent}\n`;
        solicitacao += `Qtd Sugerida: ${cols[3].textContent}\n`;
        solicitacao += `Local: ${cols[4].textContent}\n`;
        solicitacao += '---------------------------\n';
    });

    // Gera o download do arquivo
    const blob = new Blob([solicitacao], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitacao_compra.txt';
    a.click();
    
    alert('Solicitação de compra gerada com sucesso!');
}

/**
 * Formata data de YYYY-MM-DD para DD/MM/YYYY.
 */
function formatarData(dataStr) {
    if (!dataStr) return '-';
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
