// ==========================================================================
// SELECIONANDO OS ELEMENTOS DA TELA
// ==========================================================================
const btnsOpen = document.querySelectorAll('.btn-open-form');
const btnClose = document.querySelector('.btn-close-modal');
const modal = document.getElementById('formModal');
const form = document.getElementById('orcamentoForm');

// ==========================================================================
// FUNÇÕES PARA ABRIR E FECHAR O FORMULÁRIO
// ==========================================================================
function abrirModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==========================================================================
// ESCUTADORES DE EVENTOS (CLIQUES)
// ==========================================================================

// Aplica o clique de abrir em TODOS os botões com a classe .btn-open-form
btnsOpen.forEach(function(botao) {
    botao.addEventListener('click', abrirModal);
});

// Fecha no botão "X"
btnClose.addEventListener('click', fecharModal);

// Fecha se clicar fora do formulário
modal.addEventListener('click', function(evento) {
    if (evento.target === modal) {
        fecharModal();
    }
});

// Envio do formulário
form.addEventListener('submit', function(evento) {
    evento.preventDefault();
    alert('Obrigado! Seu pedido de orçamento foi enviado com sucesso.');
    fecharModal();
    form.reset();
});

// ==========================================================================
// ANIMAÇÃO REPETITIVA DO BOTÃO DO RODAPÉ
// ==========================================================================
function inicializarAnimacaoFooter() {
    const botaoFooter = document.querySelector('.btn-open-form-footer');
    if (!botaoFooter) return; 

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                botaoFooter.classList.add('animated-appear');
            } else {
                botaoFooter.classList.remove('animated-appear');
            }
        });
    }, {
        threshold: 0.1
    });

    observador.observe(botaoFooter);
}

// Garante a execução segura após o carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAnimacaoFooter);
} else {
    inicializarAnimacaoFooter();
}

// ==========================================================================
// ENVIO DO FORMULÁRIO DIRETO PARA O WHATSAPP (CORRIGIDO)
// ==========================================================================
form.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Impede a página de recarregar
    
    // NÚMERO CONFIGURADO COM SEU WHATSAPP REAL
    const meuNumeroWhatsapp = "5511986728797"; 

    // Captura os valores digitados nos campos de texto usando id ou seletores precisos
    const nome = document.querySelector('#orcamentoForm input[name="nome"]').value.trim();
    const whatsappCliente = document.querySelector('#orcamentoForm input[name="whatsapp"]').value.trim();
    const dataParto = document.querySelector('#orcamentoForm input[name="data_parto"]').value;
    const outraMaternidade = document.querySelector('#orcamentoForm input[name="outra_maternidade"]').value.trim();
    const origem = document.querySelector('#orcamentoForm textarea[name="origem"]').value.trim();

    // Captura a opção selecionada nos botões de rádio (procurando o input marcado dentro do form)
    const maternidadeSelecionada = document.querySelector('#orcamentoForm input[name="maternidade"]:checked');
    const viaPartoSelecionada = document.querySelector('#orcamentoForm input[name="via_parto"]:checked');

    const maternidade = maternidadeSelecionada ? maternidadeSelecionada.value : "Não informada";
    const viaParto = viaPartoSelecionada ? viaPartoSelecionada.value : "Não informada";

    // Formata a data de AAAA-MM-DD para o padrão brasileiro DD/MM/AAAA se estiver preenchida
    let dataFormatada = "Não informada";
    if (dataParto) {
        const partesData = dataParto.split('-');
        dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    }

    // Organiza a Maternidade (se preencheu "Outra", dá prioridade para o texto digitado)
    let maternidadeFinal = maternidade;
    if (outraMaternidade) {
        maternidadeFinal = `${outraMaternidade} (Outra)`;
    }

    // Monta o texto da mensagem com quebras de linha elegantes (%0A)
    let textoMensagem = `Olá Ana Paula! Gostaria de um orçamento para fotografia de parto.%0A%0A`;
    textoMensagem += `*DADOS DO PEDIDO:*%0A`;
    textoMensagem += `• *Nome:* ${nome || "Não informado"}%0A`;
    textoMensagem += `• *WhatsApp:* ${whatsappCliente || "Não informado"}%0A`;
    textoMensagem += `• *Data Prevista:* ${dataFormatada}%0A`;
    textoMensagem += `• *Maternidade:* ${maternidadeFinal}%0A`;
    textoMensagem += `• *Via de Parto:* ${viaParto}%0A`;
    
    if (origem) {
        textoMensagem += `• *Onde nos conheceu:* ${origem}%0A`;
    }

    // Cria o link final da API do WhatsApp
    const linkWhatsapp = `https://api.whatsapp.com/send?phone=${meuNumeroWhatsapp}&text=${textoMensagem}`;

    // Abre o WhatsApp em uma nova aba do navegador
    window.open(linkWhatsapp, '_blank');

    // Reseta o formulário e fecha a janela flutuante no site
    fecharModal();
    form.reset();
});