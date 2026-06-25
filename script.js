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
// ENVIO DO FORMULÁRIO DIRETO PARA O WHATSAPP (SOLUÇÃO DEFINITIVA)
// ==========================================================================
form.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Impede a página de recarregar
    
    // NÚMERO CONFIGURADO COM SEU WHATSAPP REAL
    const meuNumeroWhatsapp = "5511986728797"; 

    // Usamos 'document.getElementById' para garantir que encontramos o formulário
    const formulario = document.getElementById('orcamentoForm');

    // Captura os valores digitados nos campos de texto usando o atributo 'name'
    const nome = formulario.elements['nome'].value.trim();
    const whatsappCliente = formulario.elements['whatsapp'].value.trim();
    const dataParto = formulario.elements['data_parto'].value;
    const outraMaternidade = formulario.elements['outra_maternidade'].value.trim();
    const origem = formulario.elements['origem'].value.trim();

    // Captura a opção selecionada nos botões de rádio
    const maternidade = formulario.elements['maternidade'].value;
    const viaParto = formulario.elements['via_parto'].value;

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
    textoMensagem += `• *Maternidade:* ${maternidadeFinal || "Não informada"}%0A`;
    textoMensagem += `• *Via de Parto:* ${viaParto || "Não informada"}%0A`;
    
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

// ==========================================================================
// ANIMAÇÃO DE ROLAGEM COM MARGEM DE SEGURANÇA (FOTOS DA SEÇÃO SOBRE)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const fotosSobre = document.querySelectorAll('.about-photo');

    const observadorOpcoes = {
        root: null,
        // ESTA LINHA É O SEGREDO: Cria uma margem virtual que segura a animação na tela
        // e impede que ela suma antes de você conseguir enxergar o efeito.
        rootMargin: "-50px 0px -100px 0px", 
        threshold: 0.05 // Dispara logo no primeiro pixel visível
    };

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                // Quando entra na área visível, adiciona a animação
                entrada.target.classList.add('animated-fade-in');
            } else {
                // Só remove se o usuário realmente rolar muito para longe da seção
                entrada.target.classList.remove('animated-fade-in');
            }
        });
    }, observadorOpcoes);

    fotosSobre.forEach(foto => {
        observador.observe(foto);
    });
});

// ==========================================================================
// CARROSSEL INFINITO - ATIVADO AUTOMATICAMENTE APENAS NO PORTFÓLIO
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll('.carousel-container');

    containers.forEach((container, index) => {
        const grid = container.querySelector('.portfolio-carousel');
        if (!grid) return;

        // 1. CLONAGEM: Duplica as fotos em todas as seções para manter o scroll infinito funcional
        const itensOriginais = Array.from(grid.children);
        itensOriginais.forEach(item => {
            const clone = item.cloneNode(true);
            grid.appendChild(clone);
        });

        let IDAnimacao;
        let posicaoScroll = 0;
        const velocidade = 0.5; // Velocidade do giro automático
        let estaPausado = false;

        // Identifica se é o Portfólio (Geralmente a primeira linha de carrossel do site, index 0)
        // Se você quiser que o carrossel rode sozinho apenas nele:
        const ehPortfolio = (index === 0); 

        // 2. FUNÇÃO DE ANIMAÇÃO CONTINUA
        function animar() {
            // Só executa o movimento automático se for o portfólio e não estiver pausado
            if (ehPortfolio && !estaPausado) {
                posicaoScroll += velocidade;
                
                const larguraMetade = grid.scrollWidth / 2;
                if (posicaoScroll >= larguraMetade) {
                    posicaoScroll = 0;
                }
                
                container.scrollLeft = posicaoScroll;
            }
            
            // Mantém o sistema de looping ativo em segundo plano
            IDAnimacao = requestAnimationFrame(animar);
        }

        // Sincroniza o arrastar manual das outras seções (Relatos e Família)
        container.addEventListener('scroll', () => {
            posicaoScroll = container.scrollLeft;
        });

        // 3. EVENTOS DE INTERAÇÃO (Pausa o Portfólio se o cliente puser o mouse/dedo em cima)
        function pausar() {
            estaPausado = true;
        }

        function retomar() {
            estaPausado = false;
        }

        if (ehPortfolio) {
            container.addEventListener('mouseenter', pausar);
            container.addEventListener('mouseleave', retomar);
            container.addEventListener('touchstart', pausar);
            container.addEventListener('touchend', () => {
                setTimeout(() => {
                    const larguraMetade = grid.scrollWidth / 2;
                    if (container.scrollLeft >= larguraMetade) {
                        container.scrollLeft -= larguraMetade;
                        posicaoScroll = container.scrollLeft;
                    }
                    retomar();
                }, 50);
            });
        } else {
            // Para Relatos e Família: Se o usuário arrastar até o final, faz a compensação invisível do infinito
            container.addEventListener('touchend', () => {
                const larguraMetade = grid.scrollWidth / 2;
                if (container.scrollLeft >= larguraMetade) {
                    container.scrollLeft -= larguraMetade;
                }
            });
        }

        // Inicia a execução
        animar();
    });
});

// ==========================================================================
// CONTROLE PARA ABRIR O MODAL DE ORÇAMENTO PELO MENU SUPERIOR
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o botão do menu e a janela do modal
    const botaoMenuOrcamento = document.querySelector('.btn-abrir-orcamento');
    const modal = document.getElementById('formModal');

    // Se os dois elementos existirem na página, ativa o clique
    if (botaoMenuOrcamento && modal) {
        botaoMenuOrcamento.addEventListener('click', function (evento) {
            evento.preventDefault(); // Impede a página de pular ou recarregar
            
            // ATENÇÃO: Verifique qual classe o seu CSS usa para mostrar o modal.
            // Geralmente os projetos usam 'active', 'open' ou mudam o display.
            // Vamos adicionar a classe 'active' e também garantir o display block por segurança:
            modal.classList.add('active'); 
            modal.style.display = 'flex'; // Força o modal a aparecer centralizado
        });
    }
});
// ==========================================================================
// CONTROLE DINÂMICO DAS SOMBRAS DO CARROSSEL (APARECE AO TOCAR)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll('.carousel-container');

    containers.forEach(container => {
        function atualizarSombras() {
            const posicaoScroll = container.scrollLeft;
            const scrollMaximo = container.scrollWidth - container.clientWidth;

            // Se o scroll passou de 5px, significa que a foto tocou na esquerda -> Ativa sombra esquerda
            if (posicaoScroll > 5) {
                container.classList.add('sombra-esquerda');
            } else {
                container.classList.remove('sombra-esquerda');
            }

            // Se ainda não chegou no final total da rolagem -> Mantém a sombra direita ativa
            if (posicaoScroll < scrollMaximo - 5) {
                container.classList.add('sombra-direita');
            } else {
                container.classList.remove('sombra-direita');
            }
        }

        // Monitora a rolagem (tanto manual quanto a automática do Portfólio)
        container.addEventListener('scroll', atualizarSombras);
        
        // Executa uma vez no início para checar o estado inicial de cada carrossel
        setTimeout(atualizarSombras, 100);
    });
});
