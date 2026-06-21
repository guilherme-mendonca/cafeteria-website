document.addEventListener('DOMContentLoaded', () => {
    const tituloPedidos = document.querySelector('h1');
    const subtituloPedidos = document.querySelector('.subtitulo');
    const cardPedidos = document.querySelector('.card-pedidos');

    const imagensProdutos = {
        'Expresso': '../assets/expresso.jpg',
        'Cappuccino': '../assets/cappuccino.jpg',
        'Latte': '../assets/latte.jpg',
        'Café com Leite': '../assets/cafecomleite.jpg',
        'Croissant': '../assets/croissant.jpg',
        'Cheesecake': '../assets/cheesecake.jpg',
        'Bolo de Chocolate': '../assets/bolodechacolate.jpg',
        'Brownie': '../assets/brownie.jpg',
        'Sanduíche Natural': '../assets/sanduiche.jpg',
        'Quiche': '../assets/quiche.jpg'
    };

    function carregarPedidosSalvos() {
        const pedidosSalvos = localStorage.getItem('pedidosCatCafe');
        const pedidoAntigoSalvo = localStorage.getItem('pedidoConfirmadoCatCafe');

        if (!pedidosSalvos) {
            if (!pedidoAntigoSalvo) {
                return [];
            }

            try {
                const pedidoAntigo = JSON.parse(pedidoAntigoSalvo);
                return pedidoAntigo ? [pedidoAntigo] : [];
            } catch (erro) {
                console.error('Não foi possível ler o pedido antigo salvo.', erro);
                return [];
            }
        }

        try {
            const pedidos = JSON.parse(pedidosSalvos);
            return Array.isArray(pedidos) ? pedidos : [];
        } catch (erro) {
            console.error('Não foi possível ler os pedidos salvos.', erro);
            return [];
        }
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function formatarDataHora(dataHora) {
        const data = new Date(dataHora);

        if (Number.isNaN(data.getTime())) {
            return '';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(data);
    }

    function obterImagemDoProduto(nomeProduto) {
        return imagensProdutos[nomeProduto] || '../assets/logo.png';
    }

    function renderizarEstadoVazio() {
        if (tituloPedidos) {
            tituloPedidos.textContent = 'Pedidos';
        }

        if (subtituloPedidos) {
            subtituloPedidos.textContent = 'Nenhum pedido no momento';
        }

        if (cardPedidos) {
            cardPedidos.innerHTML = '<p style="min-height: 120px; display: grid; place-items: center; margin: 0; color: #8B6F47; font-size: 18px; text-align: center; padding: 24px;">Aguardando pedidos dos clientes...</p>';
        }
    }

    function renderizarPedidos(pedidos) {
        if (!tituloPedidos || !subtituloPedidos || !cardPedidos) {
            return;
        }

        const pedidosHtml = pedidos.map((pedido) => {
            const itensHtml = pedido.itens.map((item) => {
                const subtotalItem = item.preco * item.quantidade;

                return `
                    <div class="item">
                        <img src="${obterImagemDoProduto(item.nome)}" alt="${item.nome}">
                        <div class="descricao">
                            <h5>${item.nome}</h5>
                            <p>${formatarMoeda(item.preco)}</p>
                        </div>

                        <div class="quantidade-preco-total">
                            <p class="quantidade">${item.quantidade}x</p>
                            <p class="preco">${formatarMoeda(subtotalItem)}</p>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <article class="card-pedido">
                    <div class="gradiente">
                        <div class="informacoes-pedido">
                            <div class="informacao">
                                <div class="cliente">
                                    <h3 class="nome">${pedido.nomeCliente}</h3>
                                    <span class="mesa">Mesa ${pedido.numeroMesa}</span>
                                </div>

                                <div class="detalhes-pedido">
                                    <p class="pedido">Pedido confirmado em ${formatarDataHora(pedido.dataHora)}</p>
                                </div>
                            </div>

                            <div class="valor">
                                <p>${formatarMoeda(pedido.valorTotal)}</p>
                            </div>
                        </div>
                    </div>

                    <div class="itens">
                        <h4>Itens do Pedido</h4>
                        ${itensHtml}

                        <div class="campo-status">
                            <div class="status">
                                <span>Pendente</span>
                            </div>

                            <input type="button" value="Marcar como Pronto" class="botao-pronto">
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        tituloPedidos.textContent = 'Pedidos';
        subtituloPedidos.textContent = `${pedidos.length} pedido(s) no sistema`;

        cardPedidos.innerHTML = `
            <div class="lista-pedidos">
                ${pedidosHtml}
            </div>
        `;
    }

    const pedidosSalvos = carregarPedidosSalvos();

    if (pedidosSalvos.length === 0) {
        renderizarEstadoVazio();
        return;
    }

    renderizarPedidos(pedidosSalvos);
});