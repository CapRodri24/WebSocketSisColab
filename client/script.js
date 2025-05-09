document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const usernameDisplay = document.getElementById('username-display');
    const usernameInput = document.getElementById('username-input');
    const usernameBtn = document.getElementById('username-btn');
    
    // Conectar al servidor WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = "localhost:8080";
    console.log(`${protocol}//${host}/ws`);
    const ws = new WebSocket(`${protocol}//${host}/ws`);
    
    // Manejar conexión WebSocket
    ws.onopen = () => {
        console.log('Conectado al servidor WebSocket');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            addMessage(data.username, data.content, data.timestamp);
        } else if (data.type === 'notification') {
            addNotification(data.content);
        } else if (data.type === 'username') {
            usernameDisplay.textContent = data.content;
        }
    };
    
    ws.onclose = () => {
        addNotification('Desconectado del servidor. Recarga la página para reconectar.');
    };
    
    // Función para añadir mensaje al chat
    function addMessage(username, content, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="meta">
                <span class="username">${username}</span>
                <span class="timestamp">${timeString}</span>
            </div>
            <div class="content">${content}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Función para añadir notificación al chat
    function addNotification(content) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.textContent = content;
        
        messagesContainer.appendChild(notificationElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Enviar mensaje
    function sendMessage() {
        const content = messageInput.value.trim();
        if (content && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'message',
                content: content
            }));
            messageInput.value = '';
        }
    }
    
    // Cambiar nombre de usuario
    function changeUsername() {
        const newUsername = usernameInput.value.trim();
        if (newUsername && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'rename',
                username: newUsername
            }));
            usernameInput.value = '';
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    usernameBtn.addEventListener('click', changeUsername);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') changeUsername();
    });
});