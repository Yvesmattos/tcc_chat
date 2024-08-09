@extends('layouts.app')

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Atendimento em Tempo Real</h1>
</div>

<div class="row">
    <div class="col-md-12">
        <div id="chat-container">
            <h3 id="current-chat-name">Chat</h3>
            <div id="chat-window" class="chat-window">
                <!-- As mensagens de chat serão preenchidas dinamicamente -->
            </div>
            <div class="input-group mt-3">
                <input type="text" id="message-input" class="form-control" placeholder="Digite sua mensagem...">
                <div class="input-group-append">
                    <button id="send-message" class="btn btn-primary">Enviar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const wsUrl = 'ws://localhost:5001'; // Altere para o URL do seu servidor WebSocket
        let ws;

        const chatWindow = document.getElementById('chat-window');
        const messageInput = document.getElementById('message-input');
        const sendMessageButton = document.getElementById('send-message');

        function initializeWebSocket() {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('Conexão WebSocket aberta');
            };

            ws.onmessage = (event) => {
                event.data.text().then(text => {
                    // console.log(text)
                    message = JSON.parse(text);
                    // console.log(message)
                    handleIncomingMessage(message);
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

        function handleIncomingMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `<strong>${message.sender}:</strong> ${message.message}`;
            chatWindow.appendChild(messageDiv);
            chatWindow.scrollTop = chatWindow.scrollHeight; // Rolagem automática para a última mensagem
        }

        function sendMessage() {
            const text = messageInput.value.trim();
            if (text) {
                const message = {
                    sender: 'Você',
                    message: text
                };
                ws.send(JSON.stringify(message));
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
