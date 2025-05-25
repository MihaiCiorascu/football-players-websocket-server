import http from 'http';
import { initWebSocket } from './websocket.js';
import './backgroundMonitor.js'; // Start background monitoring

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running');
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
  initWebSocket(server);
}); 