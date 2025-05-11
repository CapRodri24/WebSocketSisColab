# WebSocketSisColab

Este informe documenta el desarrollo de un chat colaborativo en tiempo real utilizando WebSocket.El sistema permite la comunicación bidireccional entre múltiples usuarios, notificando conexiones, desconexiones y cambios de nombre en tiempo real.

## Requisitos previos

- Node.js
- Live Server 
- Dependecias
    - ws (Servidor WebSocket)

## Instalación y ejecucion 
## Configuracion del Servidor
1. Clona este repositorio:
   ```bash
   git clone https://github.com/CapRodri24/WebSocketSisColab.git
   cd WebSocketSisColab
   ```

2. Instala las dependencias:
   ```bash
   npm install ws
   ```

3. Iniciar Servidor:
   - node server.js

## Configuracion del Cliente
1. Hacer clic derecho en el archivo "client/index.html" y seleccionar la opcion "Open with Live Server".
2. Automaticamente se asignara un nombre de usuario (ej: Usuario_1).
3. Para tener distintos usuarios en el chat repetir el paso 1 tres veces.
4. Para cambiar el nombre, escribir en el campo correspondiente y presionar "Cambiar".
5. Escribir mensajes en el campo de texto y enviarlos con "Enviar" o Enter.
    