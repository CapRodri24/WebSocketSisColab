const WebSocket = require('ws');
const http = require('http');

// Crear servidor HTTP y WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Almacén de conexiones y contador de usuarios
const clients = new Map();
let userCounter = 0; // Contador para nombres secuenciales

wss.on('connection', (ws) => {
    // Incrementar contador y asignar nombre de usuario secuencial
    userCounter++;
    const username = `Usuario_${userCounter}`;
    
    // Almacenar la conexión
    clients.set(ws, { username });
    
    console.log(`Nueva conexión: ${username}`);
    
    // Notificar a todos los usuarios
    broadcast({
        type: 'notification',
        content: `${username} se ha unido al chat`
    });
    
    // Enviar al cliente su nombre de usuario
    ws.send(JSON.stringify({
        type: 'username',
        content: username
    }));
    
    // Manejar mensajes del cliente
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'message') {
                // Reenviar mensaje a todos los clientes
                const userData = clients.get(ws);
                broadcast({
                    type: 'message',
                    content: data.content,
                    username: userData.username,
                    timestamp: new Date().toISOString()
                });
            } else if (data.type === 'rename' && data.username) {
                // Cambiar nombre de usuario
                const oldUsername = clients.get(ws).username;
                clients.get(ws).username = data.username;
                
                broadcast({
                    type: 'notification',
                    content: `${oldUsername} ahora es ${data.username}`
                });
            }
        } catch (e) {
            console.error('Error procesando mensaje:', e);
        }
    });
    
    // Manejar cierre de conexión
    ws.on('close', () => {
        const userData = clients.get(ws);
        clients.delete(ws);
        
        broadcast({
            type: 'notification',
            content: `${userData.username} ha abandonado el chat`
        });
        console.log(`${userData.username} se desconectó`);
    });
});

// Función para enviar un mensaje a todos los clientes conectados
function broadcast(message) {
    const data = JSON.stringify(message);
    
    for (const [client] of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

// Iniciar servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});