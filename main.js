var data = [];
var pedidoFinal = {};
var dadosAdicionais = {};

var taxasShopee = {
  comissao: 0.12,
  taxaTransacao: 0.02,
  taxaDeTransporte: 0,
  taxaFixaPorItemVendido: 4.00,
  valorLimite: 100.00
}

var tamanho = {
  altura: 0,
  largura: 0,
  comprimento: 0
}

function submitFile() {
  const freteGratisInput = document.getElementById('frete-gratis');
  const programaFreteGratis = freteGratisInput.checked;
  const fileInput = document.getElementById('inputGroupFile02');
  const file = fileInput.files[0];

  if (!file) {
    alert('Selecione um arquivo Excel primeiro!');
    return;
  }

  extrairDados(file).then((dados) => {
    criarPedido(dados, programaFreteGratis);
    renderizarPedido(pedidoFinal);
  });
}

function criarPedido(dados, programaFreteGratis) {
  let totalCompra = 0.00;
  let totalVenda = 0.00;
  let totalTaxas = 0.00;
  let totalVendaSemTaxas = 0.00;
  let total = 0;

  !pedidoFinal.produtos ? pedidoFinal.produtos = [] : '';

  dados.forEach(produto => {
    const novoProduto = criarProduto(produto, programaFreteGratis);

    pedidoFinal.produtos.push(novoProduto);

    totalCompra += novoProduto.preco * novoProduto.quantidade;
    totalVenda += (novoProduto.preco + novoProduto.taxa) * produto.quantidade;
    totalTaxas += novoProduto.taxa * novoProduto.quantidade;
    totalVendaSemTaxas += novoProduto.preco * novoProduto.quantidade;
    total += totalVenda;
  });
  pedidoFinal.totalCompra = totalCompra;
  pedidoFinal.totalVenda = totalVenda;
  pedidoFinal.totalTaxas = totalTaxas;
  pedidoFinal.totalVendaSemTaxas = totalVendaSemTaxas;
  pedidoFinal.total = total;

}

function criarProduto(produto, programaFreteGratis) {
  let novoProduto = {};
  let compraRaw = produto.compra || 0;
  let vendaRaw = produto.venda || 0;
  let qtdRaw = produto.quantidade || 0;

  novoProduto.nome = produto.nome || '';
  novoProduto.compra = Number(compraRaw.toFixed(2));
  novoProduto.venda = Number(vendaRaw.toFixed(2));
  novoProduto.quantidade = Number(qtdRaw.toFixed(2));

  novoProduto.custoTotal = calcCustoTotal(novoProduto.compra, novoProduto.quantidade);
  novoProduto.vendaTotal = calcVendatotal(novoProduto.venda, novoProduto.quantidade);
  novoProduto.taxa = calcularTaxas(novoProduto.venda, programaFreteGratis);
  novoProduto.taxaTotal = calcTaxaTotal(novoProduto.taxa, novoProduto.quantidade);
  novoProduto.lucroUnitario = calcLucroUnitario(novoProduto.venda, novoProduto.compra, novoProduto.taxa);
  novoProduto.lucroTotal = calcLucroTotal(novoProduto.custoTotal, novoProduto.taxaTotal, novoProduto.vendaTotal);

  return novoProduto;
}

function calcTaxaTotal(taxa, quantidade) {
  return Number((Number(taxa) * Number(quantidade)).toFixed(2));
}

function calcCustoTotal(compra, quantidade) {
  return Number((Number(compra) * Number(quantidade)).toFixed(2));
}

function calcVendatotal(venda, quantidade) {
  return Number((Number(venda) * Number(quantidade)).toFixed(2));
}

function calcLucroUnitario(venda, compra, taxa) {
  return Number((Number(venda) - (Number(compra) + Number(taxa))).toFixed(2));
}

function calcLucroTotal(custoTotal, taxaTotal, vendaTotal) {
  return Number((vendaTotal - (custoTotal + taxaTotal)).toFixed(2));
}

function calcularTaxas(preco, programaFreteGratis) {
  const taxas = taxasShopee;
  if (programaFreteGratis) {
    taxas.taxaDeTransporte = 0.06;
  }
  taxas.comissao = 0.12;
  taxas.taxaFixaPorItemVendido = preco > 8 ? 4.00 : preco / 2;
  taxas.taxaTransacao = 0.02;

  const taxa = ((taxas.comissao + taxas.taxaDeTransporte + taxas.taxaTransacao) * preco) + taxas.taxaFixaPorItemVendido

  return taxa > 100 ? 100 : taxa;

}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function extrairDados(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const dataXls = new Uint8Array(event.target.result);
        const workbook = XLSX.read(dataXls, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
}

function recalcular(input) {
  const index = Number(input.dataset.index);
  const produto = pedidoFinal.produtos[index];

  if (input.classList.contains('quantidade')) {
    const quantidade = Number(input.value);
    produto.quantidade = quantidade;
  } else if (input.classList.contains('valorCompra')) {
    produto.compra = Number(input.value) || 0;
  } else if (input.classList.contains('valorVenda')) {
    produto.venda = Number(input.value) || 0;
  }

  produto.taxa = calcularTaxas(produto.venda, false);
  produto.lucroUnitario = calcLucroUnitario(produto.venda, produto.compra, produto.taxa);
  produto.custoTotal = calcCustoTotal(produto.compra, produto.quantidade); h
  produto.vendaTotal = calcVendatotal(produto.venda, produto.quantidade);
  produto.taxaTotal = calcTaxaTotal(produto.taxa, produto.quantidade);
  produto.lucroTotal = calcLucroTotal(produto.custoTotal, produto.taxaTotal, produto.vendaTotal);

  document.getElementById(`custoTotal-${index}`).textContent = formatCurrency(produto.custoTotal);
  document.getElementById(`vendaTotal-${index}`).textContent = formatCurrency(produto.vendaTotal);
  document.getElementById(`taxa-${index}`).textContent = formatCurrency(produto.taxa);
  document.getElementById(`lucroUnitario-${index}`).textContent = formatCurrency(produto.lucroUnitario);
  document.getElementById(`lucroTotal-${index}`).textContent = formatCurrency(produto.lucroTotal);
  document.getElementById(`taxaTotal-${index}`).textContent = formatCurrency(produto.taxaTotal);
}

function addRow() {
  const produtoVazio = {
    nome: "Novo Item",
    compra: 0,
    venda: 0,
    quantidade: 1
  };

  const itemProcessado = criarProduto(produtoVazio, false);

  if (!pedidoFinal.produtos) {
    pedidoFinal.produtos = [];
    pedidoFinal.produtos.push(itemProcessado)
  } else {
    pedidoFinal.produtos.push(itemProcessado);
  }

  renderizarPedido();
  window.scrollTo(0, document.body.scrollHeight);
}

function gerarId(prefixo = 'id') {
  return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function limparPedido() {
  pedidoFinal = {
    produtos: []
  };
  renderizarPedido(pedidoFinal);
}

function removerItem(index) {
  pedidoFinal.produtos.splice(index, 1);
  renderizarPedido();
}

function mudarNomeProduto(input) {
  const index = Number(input.dataset.index);
  pedidoFinal.produtos[index].nome = input.value;
  renderizarPedido();
}

function gerarPDF() {
  if (!pedidoFinal.produtos || pedidoFinal.produtos.length === 0) {
    alert("Não há dados para gerar o PDF!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const inputNome = document.getElementById('recipient-name');
  const nomeDigitado = inputNome.value.trim();
  let tituloPDF = "Pedido Monsterbox";
  let nomeArquivo = `Monsterbox_Pedido_${Date.now()}.pdf`;

  if (nomeDigitado.length > 0) {
    tituloPDF = nomeDigitado;
    nomeArquivo = nomeDigitado.replace(/[/\\?%*:|"<>]/g, '-');
  }

  doc.setFontSize(18);
  doc.text(tituloPDF, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data da exportação: ${dataAtual}`, 14, 28);

  const colunas = [
    "Item",
    "Qtd",
    "Custo Un.",
    "Custo Total",
    "Venda Total",
    "Taxas",
    "Lucro Total"
  ];

  const linhas = pedidoFinal.produtos.map(item => [
    item.nome || "Item sem nome",
    item.quantidade,
    formatCurrency(item.compra),
    formatCurrency(item.custoTotal),
    formatCurrency(item.vendaTotal),
    formatCurrency(item.taxaTotal),
    formatCurrency(item.lucroTotal)
  ]);

  const totalVendaGeral = pedidoFinal.produtos.reduce((acc, item) => acc + item.vendaTotal, 0);
  const totalLucroGeral = pedidoFinal.produtos.reduce((acc, item) => acc + item.lucroTotal, 0);

  linhas.push([
    { content: 'TOTAIS GERAIS', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
    formatCurrency(totalVendaGeral),
    "-",
    { content: formatCurrency(totalLucroGeral), styles: { fontStyle: 'bold', fillColor: [220, 255, 220] } }
  ]);

  doc.autoTable({
    head: [colunas],
    body: linhas,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      6: { fontStyle: 'bold' }
    },

    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 6) {
        const valorTexto = data.cell.raw;
      }
    }
  });

  inputNome.value = "";

  doc.save(`${nomeArquivo}.pdf`);
}

function renderizarPedido() {
  const desktop = document.getElementById('pedido');
  const mobile = document.getElementById('cards');

  mobile.innerHTML = '';
  desktop.innerHTML = '';
  let total = 0;

  if (!pedidoFinal.produtos) return;

  pedidoFinal.produtos.forEach((item, index) => {
    const metaLucro = item.custoTotal * 0.40;

    desktop.innerHTML += `
      <tr data-index="${index}">
        <th scope="row" class="text-center delete-buttom">
          <button type="button" class="col btn btn-danger" onclick="removerItem(${index})"> - </button>
        </th>
        <th scope="row">${index + 1}</th>
        <td>
        <div class="input-group mb-3">
            <input type="text" value="${item.nome}" class="inputTable form-control quantidade" aria-label="Amount" data-index="${index}" onchange="mudarNomeProduto(this)">
          </div>
        </td>
        <td>
          <div class="input-group mb-3">
            <input type="number" value="${item.quantidade}" class="col inputTable form-control quantidade" aria-label="Amount" data-index="${index}" onchange="recalcular(this)">
          </div>
        </td>
        <td class="custoUnitario">
          <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">R$</span>
            <input type="text" value="${item.compra}" class="inputTable form-control valorCompra" aria-label="Amount" data-index="${index}" onchange="recalcular(this)">
          </div>
        </td>
        <td id="custoTotal-${index}">${formatCurrency(item.custoTotal)}</td>
        <td id="vendaUnitaria-${index}">
          <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-sm">R$</span>
            <input type="text" value="${item.venda}" class="inputTable form-control valorVenda" aria-label="Amount" data-index="${index}"  onchange="recalcular(this)">
          </div>
        </td>
        <td class="taxa" id="taxa-${index}">${formatCurrency(item.taxa)}</td>
        <td class="lucroUnitario" id="lucroUnitario-${index}">${formatCurrency(item.lucroUnitario)}</td>
        <td class="vendaTotal" id="vendaTotal-${index}">${formatCurrency(item.vendaTotal)}</td>
        <td class="lucroTotal" id="lucroTotal-${index}">${formatCurrency(item.lucroTotal)}</td>
        <td class="taxa" id="taxaTotal-${index}">${formatCurrency(item.taxaTotal)}</td>
      </tr>
    `;

    mobile.innerHTML += `
      <div class="card ${item.lucroTotal < metaLucro ? (item.lucro < 0 ? 'border-danger' : 'border-warning') : 'border-success'} mb-3">
          <div class="card-header d-flex justify-content-between">
            <div class="d-flex gap-3">
              <strong>${item.nome.toUpperCase()}</strong>
              <span class="my-badge text-center">( ${item.quantidade} )</span>
            </div>
            <strong><span class="badge rounded-pill ${item.lucroTotal < metaLucro ? (item.lucro < 0 ? 'text-bg-danger' : 'text-bg-warning') : 'text-bg-success'}">${formatCurrency(item.lucroTotal)}</span></strong>
          </div>
          <div class="card-body d-flex flex-column gap-3">
            <div class="row mobile-compra d-flex gap-3 border-bottom">
              <div class="col input-group">
                <span class="input-group-text col-3">Custo un.</span>
                <input type="text" aria-label="Custo unidade" class="form-control" value="${formatCurrency(item.compra)}">
                <span class="input-group-text col-3">Custo Total</span>
                <input type="text" aria-label="Custo Total" class="form-control" value="${formatCurrency(item.custoTotal)}">
              </div>
            </div>
            <div class="row mobile-venda d-flex gap-3 border-bottom">
              <div class="col input-group">
                <span class="input-group-text col-3">Venda un.</span>
                <input type="text" aria-label="Venda unidade" class="form-control" value="${formatCurrency(item.venda)}">
                <span class="input-group-text col-3">Venda Total</span>
                <input type="text" aria-label="Venda Total" class="form-control" value="${formatCurrency(item.vendaTotal)}">
              </div>
            </div>
            <div class="row mobile-taxa-lucro d-flex gap-3 border-bottom">
              <div class="col input-group">
                <span class="input-group-text col-3">Lucro un.</span>
                <input type="text" aria-label="Lucro unidade" class="form-control" value="${formatCurrency(item.lucroUnitario)}">
                <span class="input-group-text col-3">Lucro Total</span>
                <input type="text" aria-label="Lucro Total" class="form-control" value="${formatCurrency(item.lucroTotal)}">
              </div>
            </div>
            <div class="row mobile-taxa-lucro-total d-flex gap-3 border-bottom">
              <div class="col input-group">
                <span class="input-group-text col-3">Taxa un.</span>
                <input type="text" aria-label="Taxa unidade" class="form-control" value="${formatCurrency(item.taxa)}">
                <span class="input-group-text col-3">Taxa Total</span>
                <input type="text" aria-label="Taxa Total" class="form-control" value="${formatCurrency(item.taxaTotal)}">
              </div>
            </div>
          </div>
      </div>
    `
  });
}