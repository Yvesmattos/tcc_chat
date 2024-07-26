@extends('layouts.app')

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Atendimento em Tempo Real</h1>
</div>

<div class="row">
    <div class="col-md-4">
        <h3>Fila de Espera</h3>
        <ul id="queue" class="list-group">
            <!-- A lista de espera será preenchida dinamicamente -->
        </ul>
    </div>
    <div class="col-md-8">
        <div id="chat-container" style="display: none;">
            <h3 id="current-chat-name">Atendendo: </h3>
            <div id="chat-window" class="chat-window">
                <!-- As mensagens de chat serão preenchidas dinamicamente -->
            </div>
            <div class="input-group mt-3">
                <input type="text" id="message-input" class="form-control">
                <div class="input-group-append">
                    <button id="send-message" class="btn btn-primary">Enviar</button>
                </div>
            </div>
        </div>
        <div id="no-chat-container">
            <h3>Selecione um usuário para atender</h3>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const wsUrl = 'ws://localhost:5001'; // Altere para o URL do seu servidor WebSocket
        let ws;
        let currentChatId = null;

        const queueList = document.getElementById('queue');
        const chatContainer = document.getElementById('chat-container');
        const noChatContainer = document.getElementById('no-chat-container');
        const chatWindow = document.getElementById('chat-window');
        const chatName = document.getElementById('current-chat-name');
        const messageInput = document.getElementById('message-input');
        const sendMessageButton = document.getElementById('send-message');

        function initializeWebSocket() {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('Conexão WebSocket aberta');
            };

            // Cria uma instância do FileReader
            ws.onmessage = (event) => {
                event.data.text().then(text => {
                    text = JSON.parse(text)
                    if (text.type === 'message') {
                        updateQueue(text.queue);
                    } else if (text.type === 'message') {
                        handleIncomingMessage(text.message);
                    }
                }).catch(error => {
                    console.error('Erro ao converter Blob para string:', error);
                });
            };

            ws.onerror = (error) => {
                console.error('Erro no WebSocket:', error);
            };

            ws.onclose = () => {
                console.log('Conexão WebSocket fechada');
            };
        }

        function updateQueue(queue) {
            queueList.innerHTML = '';
            console.log("chegou 1" + queue)
            queue.forEach(user => {
                console.log("chegou 2")
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    ${user.name}
                    <button class="btn btn-primary btn-sm" onclick="startChat(${user.id}, '${user.name}')">Atender</button>
                `;
                queueList.appendChild(listItem);
            });
        }

        function startChat(userId, userName) {
            currentChatId = userId;
            chatContainer.style.display = 'block';
            noChatContainer.style.display = 'none';
            chatName.textContent = `Atendendo: ${userName}`;
            chatWindow.innerHTML = ''; // Limpa a janela de chat
        }

        function handleIncomingMessage(message) {
            if (currentChatId && message.chatId === currentChatId) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.innerHTML = `<strong>${message.sender}:</strong> ${message.text}`;
                chatWindow.appendChild(messageDiv);
                chatWindow.scrollTop = chatWindow.scrollHeight; // Rolagem automática para a última mensagem
            }
        }

        function sendMessage() {
            const text = messageInput.value.trim();
            if (text && currentChatId !== null) {
                ws.send(stringify(message));
                ws.send(JSON.stringify({ type: 'message', message, sender: 'atendente',chatId : currentChatId}));
                handleIncomingMessage(message); // Adiciona a mensagem ao chat local
                messageInput.value = ''; // Limpa o campo de entrada
            }
        }

        sendMessageButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });

        initializeWebSocket();
    });
</script>

<style>
    .chat-window {
        border: 1px solid #ccc;
        height: 400px;
        overflow-y: scroll;
        padding: 10px;
        margin-bottom: 10px;
    }
    .message {
        margin-bottom: 10px;
    }
</style>
@endsection
