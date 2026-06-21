// garante que o código seja executado apenas após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário de login
    const formLogin = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const botaoEntrar = document.getElementById('botao-entrar');
    const botaoEsqueciSenha = document.querySelector('.esqueci-senha');

    // Verifica se os elementos existem antes de adicionar os event listeners
    if (!formLogin || !emailInput || !senhaInput || !botaoEntrar) {
        return;
    }

    // Usuário válido para teste
    const usuarioValido = {
        email: 'garcom123@gmail.com',
        senha: 'garcom123'
    };

    // Função para validar o login
    const validarLogin = (event) => {
        if (event) {
            event.preventDefault();
        }

        // Remove espaços em branco dos campos
        const emailDigitado = emailInput.value.trim();
        const senhaDigitada = senhaInput.value.trim();

        if (!emailDigitado || !senhaDigitada) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailDigitado)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        // Verifica se o email e a senha correspondem ao usuário válido
        if (emailDigitado === usuarioValido.email && senhaDigitada === usuarioValido.senha) {
            localStorage.setItem('usuarioLogado', JSON.stringify({ email: emailDigitado }));
            window.location.href = 'pedidos.html';
            return;
        }
        alert('Email ou senha inválidos. Por favor, tente novamente.');
    };

    // O que está dentro do form é acionado ao clicar no botão de submit ou pressionar Enter
    formLogin.addEventListener('submit', validarLogin);
    botaoEntrar.addEventListener('click', validarLogin);

    if (botaoEsqueciSenha) {
        botaoEsqueciSenha.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Entre em contato com o suporte para recuperar a senha.');
        });
    }
});