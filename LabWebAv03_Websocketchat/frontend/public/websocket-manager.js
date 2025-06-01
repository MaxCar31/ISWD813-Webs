/**
 * Manejador de conexión WebSocket
 * Principio SRP: Solo se encarga de la comunicación WebSocket
 * Principio OCP: Extensible para diferentes tipos de conexión
 */
export class WebSocketManager {
  constructor(url, messageHandler = null) {
    this.url = url;
    this.socket = null;
    this.messageHandler = messageHandler;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Establece la conexión WebSocket
   * @returns {Promise<void>} Promesa de conexión
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        this.setupEventListeners(resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Configura los event listeners del WebSocket
   * @param {Function} resolve - Función resolve de la promesa
   * @param {Function} reject - Función reject de la promesa
   */
  setupEventListeners(resolve, reject) {
    this.socket.addEventListener('open', (event) => {
      console.log('Connection established with the WebSocket server');
      this.reconnectAttempts = 0;
      resolve(event);
    });

    this.socket.addEventListener('message', async (event) => {
      const messageData = await this.processMessageData(event.data);
      console.log('Mensaje recibido del servidor:', messageData);
      
      if (this.messageHandler) {
        this.messageHandler(messageData);
      }
    });

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed');
      this.handleReconnection();
    });
  }

  /**
   * Procesa los datos del mensaje (maneja Blob y string)
   * @param {*} data - Datos del mensaje
   * @returns {string} Datos procesados como string
   */
  async processMessageData(data) {
    if (data instanceof Blob) {
      return await data.text();
    }
    return data;
  }

  /**
   * Envía un mensaje a través del WebSocket
   * @param {string} message - Mensaje a enviar
   * @returns {boolean} True si se envió correctamente
   */
  send(message) {
    if (this.isConnected()) {
      this.socket.send(message);
      console.log('Mensaje enviado:', message);
      return true;
    } else {
      console.error('WebSocket connection is not open');
      return false;
    }
  }

  /**
   * Verifica si la conexión está abierta
   * @returns {boolean} True si está conectado
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Maneja la reconexión automática
   */
  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Establece el handler de mensajes
   * @param {Function} handler - Función para manejar mensajes
   */
  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  /**
   * Cierra la conexión WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}