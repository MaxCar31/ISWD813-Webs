import express, { Express, Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';

const app: Express = express();
const server: http.Server = http.createServer(app);
const wss: WebSocketServer = new WebSocket.Server({ server });
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;


app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../../frontend/public', 'index.html'));
});


wss.on('connection', (ws: WebSocket) => {
  console.log('Nuevo cliente conectado');
  
  ws.on('message', (message: WebSocket.RawData) => {
    console.log('Mensaje recibido:', message.toString());
    

    wss.clients.forEach((client: WebSocket) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('error', (err: Error) => {
    console.error('Error en WebSocket:', err);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, (): void => {
  console.log(`Servidor WebSocket en ejecución en http://localhost:${PORT}`);
});