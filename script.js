const input_valor = document.getElementById("valor");
const select_origem = document.getElementById("moeda-origem");
const select_destino = document.getElementById("moeda-destino");
const btn_enviar = document.getElementById("enviar");
const p_resposta = document.getElementById("resposta");

async function pega_cotacao(moedaOrigem, moedaDestino) {
  try {
    const url = `https://api.exchangerate-api.com/v4/latest/${moedaOrigem}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
  
    const data = await response.json();
    
    if (!data.rates || !data.rates[moedaDestino]) {
      throw new Error("Moeda de destino não encontrada");
    }
    
    return data.rates[moedaDestino];

  } catch (error) {
    console.error('Erro ao obter cotação:', error);
    return null;
  }
}

async function funcaoClicar() {
  let valor = parseFloat(input_valor.value);
  let moedaOrigem = select_origem.value;
  let moedaDestino = select_destino.value;

  if (isNaN(valor) || valor <= 0) {
    p_resposta.innerHTML = "Por favor, insira um valor válido maior que zero.";
    return;
  }

  let taxaConversao = await pega_cotacao(moedaOrigem, moedaDestino);

  if (taxaConversao === null) {
    p_resposta.innerHTML = "Não foi possível obter a cotação. Tente novamente mais tarde.";
    return;
  }

  let valorConvertido = valor * taxaConversao;

  p_resposta.innerHTML = `
    ${valor.toFixed(2)} ${moedaOrigem} = 
    ${valorConvertido.toFixed(2)} ${moedaDestino}<br>
    Taxa de conversão: 1 ${moedaOrigem} = ${taxaConversao.toFixed(6)} ${moedaDestino}
  `;
}

btn_enviar.addEventListener("click", funcaoClicar);