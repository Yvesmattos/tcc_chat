# Instruções para Iniciar o Chat de Atendimento

Para integrar o chat de atendimento no seu site, siga os passos abaixo:

## Passo 1: Incluir o Script no Arquivo Principal

Adicione o seguinte código ao arquivo principal do seu site, como `index.html` ou `index.php`. Esse script cria e insere um `iframe` que hospeda o chat de atendimento.

```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body) {  // Verifica se document.body não é null
            const chatFrame = document.createElement('iframe');
            chatFrame.id = 'chat-frame';
            chatFrame.src = 'https://tcc-chat.netlify.app/';
            chatFrame.title = 'Chat App';
            chatFrame.style.position = 'fixed';
            chatFrame.style.bottom = '0';
            chatFrame.style.right = '0';
            chatFrame.style.width = '100vw';
            chatFrame.style.height = '100vh';
            chatFrame.style.border = 'none';
            chatFrame.style.zIndex = '9999'; // Garante que o iframe está acima de outros conteúdos
            document.body.appendChild(chatFrame);
        }
    });
</script>
