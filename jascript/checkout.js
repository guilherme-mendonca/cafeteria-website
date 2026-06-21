document.addEventListener('DOMContentLoaded', () => {
	const nomeArmazenamento = 'carrinhoCatCafe';
	const chavePedidosSalvos = 'pedidosCatCafe';
	const chavePedidoAntigo = 'pedidoConfirmadoCatCafe';
	const secaoPrincipal = document.querySelector('.checkout-section');
	const imagemProdutos = {
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

	// Lê o carrinho salvo no navegador. Se estiver vazio devolve uma lista vazia.
	function carregarCarrinho() {
		const carrinhoSalvo = localStorage.getItem(nomeArmazenamento);

		if (!carrinhoSalvo) {
			return [];
		}
		try {
			return JSON.parse(carrinhoSalvo);
		} catch (erro) {
			console.error('Erro ao carregar o carrinho.', erro);
			return [];
		}
	}

	// Salva o carrinho para manter os itens mesmo trocando de página.
	function salvarCarrinho(carrinho) {
		localStorage.setItem(nomeArmazenamento, JSON.stringify(carrinho));
	}

	function carregarPedidosSalvos() {
		const pedidosSalvos = localStorage.getItem(chavePedidosSalvos);
		const pedidoAntigoSalvo = localStorage.getItem(chavePedidoAntigo);

		if (!pedidosSalvos) {
			if (!pedidoAntigoSalvo) {
				return [];
			}

			try {
				const pedidoAntigo = JSON.parse(pedidoAntigoSalvo);
				return pedidoAntigo ? [pedidoAntigo] : [];
			} catch (erro) {
				console.error('Erro ao carregar o pedido antigo salvo.', erro);
				return [];
			}
		}

		try {
			const pedidos = JSON.parse(pedidosSalvos);

			if (Array.isArray(pedidos)) {
				return pedidos;
			}

			return [];
		} catch (erro) {
			console.error('Erro ao carregar os pedidos salvos.', erro);
			return [];
		}
	}

	function salvarPedidos(pedidos) {
		localStorage.setItem(chavePedidosSalvos, JSON.stringify(pedidos));
	}

	// Busca a imagem do item pelo nome.
	function obterImagemDoProduto(nomeProduto) {
		return imagemProdutos[nomeProduto] || '../assets/logo.png';
	}

	// Formata o valor para o padrão de moeda usado na tela.
	function formatarMoeda(valor) {
		return valor.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		});
	}

	// Soma a quantidade total de itens no carrinho.
	function obterQuantidadeTotal(carrinho) {
		return carrinho.reduce((total, item) => total + item.quantidade, 0);
	}

	// Soma o valor final considerando preço e quantidade.
	function obterValorTotal(carrinho) {
		return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
	}

	// Aumenta a quantidade de um item específico.
	function aumentarQuantidade(indiceDoItem) {
		const carrinho = carregarCarrinho();

		if (!carrinho[indiceDoItem]) {
			return;
		}

		carrinho[indiceDoItem].quantidade += 1;
		salvarCarrinho(carrinho);
		renderizarCarrinho();
	}

	// Diminui a quantidade. Se chegar em zero remove o item do carrinho.
	function diminuirQuantidade(indiceDoItem) {
		const carrinho = carregarCarrinho();

		if (!carrinho[indiceDoItem]) {
			return;
		}

		if (carrinho[indiceDoItem].quantidade <= 1) {
			carrinho.splice(indiceDoItem, 1);
		} else {
			carrinho[indiceDoItem].quantidade -= 1;
		}

		salvarCarrinho(carrinho);
		renderizarCarrinho();
	}

	// Remove um item específico do carrinho usando o índice.
	function removerItem(indiceDoItem) {
		const carrinho = carregarCarrinho();
		carrinho.splice(indiceDoItem, 1);
		salvarCarrinho(carrinho);
		renderizarCarrinho();
	}

	// Limpa o carrinho inteiro.
	function esvaziarCarrinho() {
		salvarCarrinho([]);
		renderizarCarrinho();
	}

	// Confirma o pedido e salva os dados preenchidos pelo cliente.
	function confirmarPedido(evento) {
		evento.preventDefault();

		const carrinho = carregarCarrinho();
		const nomeCliente = document.querySelector('[data-campo="nome-cliente"]')?.value.trim();
		const numeroMesa = document.querySelector('[data-campo="numero-mesa"]')?.value.trim();

		if (!nomeCliente || !numeroMesa) {
			alert('Preencha o nome do cliente e o número da mesa.');
			return;
		}

		if (carrinho.length === 0) {
			alert('O carrinho está vazio.');
			return;
		}

		const pedidoConfirmado = {
			id: Date.now(),
			nomeCliente,
			numeroMesa,
			itens: carrinho,
			valorTotal: obterValorTotal(carrinho),
			dataHora: new Date().toISOString()
		};

		const pedidosSalvos = carregarPedidosSalvos();
		pedidosSalvos.push(pedidoConfirmado);
		salvarPedidos(pedidosSalvos);
		localStorage.removeItem(chavePedidoAntigo);
		salvarCarrinho([]);
		renderizarTelaConfirmacao(nomeCliente, numeroMesa);
	}

	// Mostra a tela final depois da confirmação do pedido.
	function renderizarTelaConfirmacao(nomeCliente, numeroMesa) {
		if (!secaoPrincipal) {
			return;
		}

		secaoPrincipal.innerHTML = `
			<section class="card-confirmacao-pedido" aria-labelledby="titulo-confirmacao">
				<div class="icone-confirmacao" aria-hidden="true">
					<span>✓</span>
				</div>

				<h1 id="titulo-confirmacao" class="titulo-confirmacao">Pedido Realizado!</h1>
				<p class="mensagem-confirmacao">
					Obrigado por seu pedido ${nomeCliente}, espere na mesa de numero ${numeroMesa} e já já seu pedido virá a voce.
				</p>

				<a href="../index.html" class="botao-voltar-menu">Voltar ao menu inicial</a>
			</section>
		`;
	}

	// Monta o HTML do carrinho com innerHTML, exibindo produtos, quantidades e total.
	function renderizarCarrinho() {
		const carrinho = carregarCarrinho();

		if (!secaoPrincipal) {
			return;
		}

		if (carrinho.length === 0) {
			secaoPrincipal.innerHTML = `
				<section class="card-carrinho-vazio" aria-labelledby="checkout-title">
					<p id="checkout-title" class="mensagem-carrinho">Seu carrinho está vazio</p>
					<a href="./cardapio.html" class="botao-cardapio">Ver Cardápio</a>
				</section>
			`;
			return;
		}

		const quantidadeTotal = obterQuantidadeTotal(carrinho);
		const valorTotal = obterValorTotal(carrinho);

		const itensHtml = carrinho.map((item, indice) => {
			const subtotal = item.preco * item.quantidade;

			return `
				<div class="item-carrinho">
					<img class="item-carrinho__imagem" src="${obterImagemDoProduto(item.nome)}" alt="${item.nome}">

					<div class="item-carrinho__dados">
						<h3 class="item-carrinho__nome">${item.nome}</h3>
						<p class="item-carrinho__quantidade">Quantidade: ${item.quantidade}</p>
					</div>

					<div class="item-carrinho__quantidade-controle">
						<button type="button" class="botao-quantidade" data-acao="diminuir" data-indice="${indice}">−</button>
						<span class="quantidade-atual">${item.quantidade}</span>
						<button type="button" class="botao-quantidade" data-acao="aumentar" data-indice="${indice}">+</button>
					</div>

					<div class="item-carrinho__valores">
						<p class="item-carrinho__preco">${formatarMoeda(item.preco)}</p>
						<p class="item-carrinho__subtotal">${formatarMoeda(subtotal)}</p>
					</div>
				</div>
			`;
		}).join('');

		secaoPrincipal.innerHTML = `
			<section class="checkout-conteudo">
				<div class="checkout-itens">
					<div class="cabecalho-carrinho">
						<div>
							<p class="titulo-carrinho">Seu carrinho</p>
							<p class="resumo-carrinho">${quantidadeTotal} item(ns) adicionados</p>
						</div>

						<button type="button" class="botao-limpar-carrinho">Limpar carrinho</button>
					</div>

					<div class="lista-carrinho">
						${itensHtml}
					</div>
				</div>

				<aside class="resumo-pedido">
					<h2 class="titulo-resumo">Resumo do Pedido</h2>

					<div class="linhas-resumo">
						<div class="linha-resumo">
							<span>Subtotal</span>
							<strong>${formatarMoeda(valorTotal)}</strong>
						</div>
						<div class="linha-resumo destaque">
							<span>Total</span>
							<strong>${formatarMoeda(valorTotal)}</strong>
						</div>
					</div>

					<form class="formulario-pedido">
						<label class="campo-label" for="nome-cliente">Seu nome</label>
						<input class="campo-texto" type="text" id="nome-cliente" data-campo="nome-cliente" placeholder="Digite seu nome">

						<label class="campo-label" for="numero-mesa">Número da mesa</label>
						<input class="campo-texto" type="text" id="numero-mesa" data-campo="numero-mesa" placeholder="Digite o número da mesa">

						<button type="submit" class="botao-confirmar">Confirmar Pedido</button>
					</form>
				</aside>
			</section>
		`;

		// Depois de reescrever o HTML, religa os eventos dos botões criados
		document.querySelectorAll('.botao-quantidade').forEach((botao) => {
			botao.addEventListener('click', () => {
				const indiceDoItem = Number(botao.dataset.indice);
				const acao = botao.dataset.acao;

				if (acao === 'aumentar') {
					aumentarQuantidade(indiceDoItem);
					return;
				}

				diminuirQuantidade(indiceDoItem);
			});
		});

		const botaoLimparCarrinho = document.querySelector('.botao-limpar-carrinho');
		const formularioPedido = document.querySelector('.formulario-pedido');

		if (botaoLimparCarrinho) {
			botaoLimparCarrinho.addEventListener('click', esvaziarCarrinho);
		}

		if (formularioPedido) {
			formularioPedido.addEventListener('submit', confirmarPedido);
		}
	}

	renderizarCarrinho();
});
