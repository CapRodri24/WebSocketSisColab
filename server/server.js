const WebSocket = require('ws');
const http = require('http');
const uuid = require('uuid'); // Para generar IDs únicos

// Crear servidor HTTP (opcional, para servir el cliente si está en el mismo proyecto)
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Almacén de conexiones y usuarios
const clients = new Map();

wss.on('connection', (ws) => {
    // Generar un ID único y nombre de usuario temporal
    const userId = uuid.v4().substr(0, 8);
    const username = `Usuario_${userId}`;
    
    // Almacenar la conexión
    clients.set(ws, { username });
    
    console.log(`Nueva conexión: ${username}`);
    
    // Notificar a todos que un usuario se ha unido
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
                const userData = clients.get(ws);
                broadcast({
                    type: 'message',
                    content: data.content,
                    username: userData.username,
                    timestamp: new Date().toISOString()
                });
            } else if (data.type === 'rename' && data.username) {
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
        console.log(`${username} se desconecto`);
    });
});

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