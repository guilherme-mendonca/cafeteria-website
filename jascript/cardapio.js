document.addEventListener('DOMContentLoaded', () => {
    const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
    const botaoCarrinho = document.querySelector('.botao-carrinho');

    const produtosDoCardapio = {
        'adicionar-expresso': { nome: 'Expresso', preco: 8.5 },
        'adicionar-cappuccino': { nome: 'Cappuccino', preco: 12 },
        'adicionar-latte': { nome: 'Latte', preco: 13.5 },
        'adicionar-cafecomleite': { nome: 'Café com Leite', preco: 10 },
        'adicionar-croissant': { nome: 'Croissant', preco: 9 },
        'adicionar-cheesecake': { nome: 'Cheesecake', preco: 15 },
        'adicionar-bolodechocolate': { nome: 'Bolo de Chocolate', preco: 14 },
        'adicionar-brownie': { nome: 'Brownie', preco: 12 },
        'adicionar-sanduiche': { nome: 'Sanduíche Natural', preco: 16 },
        'adicionar-quiche': { nome: 'Quiche', preco: 18 }
    };

    const nomeArmazenamento = 'carrinhoCatCafe';

    // Lê o carrinho salvo no navegador. Se não houver nada salvo começa com um carrinho vazio.
    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem(nomeArmazenamento);

        if (!carrinhoSalvo) {
            return [];
        }

        try {
            return JSON.parse(carrinhoSalvo);
        } catch (erro) {
            console.error('Não foi possível ler o carrinho salvo.', erro);
            return [];
        }
    }

    // Salva a lista atual no localStorage para o carrinho continuar na próxima página.
    function salvarCarrinho(carrinho) {
        localStorage.setItem(nomeArmazenamento, JSON.stringify(carrinho));
    }

    // Adiciona um produto no carrinho. Se ele já existir, soma a quantidade.
    function adicionarProdutoAoCarrinho(produto) {
        const carrinho = carregarCarrinho();
        const produtoExistente = carrinho.find((item) => item.nome === produto.nome);

        if (produtoExistente) {
            produtoExistente.quantidade += 1;
        } else {
            carrinho.push({
                nome: produto.nome,
                preco: produto.preco,
                quantidade: 1
            });
        }

        salvarCarrinho(carrinho);
        atualizarIndicadorDoCarrinho(carrinho);
    }

    // Calcula a quantidade total de itens para mostrar no botão do carrinho.
    function obterQuantidadeTotal(carrinho) {
        return carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    // Atualiza o texto do botão do carrinho com a quantidade atual.
    function atualizarIndicadorDoCarrinho(carrinho = carregarCarrinho()) {
        if (!botaoCarrinho) {
            return;
        }

        const quantidadeTotal = obterQuantidadeTotal(carrinho);
        botaoCarrinho.innerHTML = `
            <img src="../assets/cart.png" alt="Carrinho">
            <span>Carrinho ${quantidadeTotal > 0 ? `(${quantidadeTotal})` : ''}</span>
        `;
    }

    // Liga cada botão do cardápio ao produto correto usando o id no HTML.
    botoesAdicionar.forEach((botao) => {
        botao.addEventListener('click', () => {
            const produto = produtosDoCardapio[botao.id];

            if (!produto) {
                return;
            }

            adicionarProdutoAoCarrinho(produto);
        });
    });

    atualizarIndicadorDoCarrinho();
});
