// chat.js


// Função para carregar o conteúdo de um arquivo HTML
function loadHTML(filePath, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

function replaceChatElement() {
    const chatElement = document.querySelector('chat');

    // Carregar o conteúdo do arquivo chat-content.html
    loadHTML('chat.html', function (chatContent) {
        // Substituir o elemento <chat></chat> pelo conteúdo carregado
        chatElement.outerHTML = chatContent;
    });
}

replaceChatElement();

// Conectar ao servidor Socket.io
const socket = io();

// Selecionar elementos do DOM
const chatContainer = document.getElementById('chatContainer');
const closeChatButton = document.getElementById('closeChatButton');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatButton = document.getElementById('toggleChatButton');

function toggleChat(){
    if(chatContainer.hasAttribute('hidden')){
        chatContainer.removeAttribute('hidden');
        chatButton.setAttribute('hidden', 'true');
    }else{
        chatContainer.setAttribute('hidden', 'false');
        chatButton.removeAttribute('hidden');
    }
}
console.log(closeChatButton);

// Adicionar eventos aos botões
closeChatButton.addEventListener('click', () => {
    toggleChat();
});
chatButton.addEventListener('click', () => {
    toggleChat();
});

sendButton.addEventListener('click', () => {
    sendMessage();
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
        e.preventDefault(); // Impede que o formulário seja enviado via Enter
        sendMessage();
    }
});



function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        // Enviar mensagem para o servidor via endpoint
        fetch('http://127.0.0.1:5000/chat/send_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pergunta: message }),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data[0].resposta)
            const resposta = data[0].resposta || 'Desculpe, não consegui entender.';
            // Adicionar resposta na interface do chat
            addMessage('Servidor', resposta, false); // false para indicar que é uma mensagem do servidor
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            // Tratar erro e exibir mensagem de erro na interface
            addMessage('Erro', 'Ocorreu um erro ao enviar a mensagem.', false);
        });

        // Limpar campo de mensagem
        messageInput.value = '';
        // Adicionar mensagem do usuário na interface do chat
        addMessage('Você', message, true); // true para indicar que é uma mensagem do usuário
    }
}

// Função para adicionar mensagem na interface do chat
function addMessage(sender, message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (isUser) {
        messageElement.classList.add('user-message');
        messageElement.innerHTML = `<div class="message-content">${message}</div><div class="message-sender">${sender}</div>`;
    } else {
        messageElement.classList.add('server-message');
        messageElement.innerHTML = `<div class="message-sender">${sender}</div><div class="message-content">${message}</div>`;
    }
    chatMessages.appendChild(messageElement);
    // Scroll para o final do chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Receber mensagens do servidor via Socket.io e exibir no chat
socket.on('chatMessage', (msg) => {
    addMessage('Servidor', msg, false); // false para indicar que é uma mensagem do servidor
});
