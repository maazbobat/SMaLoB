// backend/websocket.js
const WebSocket = require('ws');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Add ping/pong to keep connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.on('message', (message) => {
      console.log('Received:', message.toString());
      // Broadcast to all clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(pingInterval);
    });
  });

  return wss;
};

module.exports = setupWebSocket;