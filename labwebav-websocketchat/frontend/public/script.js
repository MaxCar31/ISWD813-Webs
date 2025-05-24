import { WebSocketManager } from './websocket-manager.js';
import { DOMHandler } from './dom-handler.js';
import { UIElementFactory } from './ui-factory.js';
import { MessageService, ChatMessage } from './message.js';

/**
 * Controlador principal de la aplicación de chat
 * Principio SRP: Coordina la interacción entre todos los módulos
 * Principio DIP: Depende de abstracciones, no de implementaciones concretas
 */
class ChatController {
  constructor() {
    this.domHandler = new DOMHandler();
    this.websocketManager = new WebSocketManager('ws://localhost:5000');
    this.init();
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    if (!this.domHandler.areElementsAvailable()) {
      console.error('Required DOM elements not found');
      return;
    }

    this.setupEventListeners();
    await this.connectToWebSocket();
  }

  /**
   * Configura los event listeners de la UI
   */
  setupEventListeners() {
    // Listener para el formulario de envío de mensajes
    this.domHandler.addFormListener((e) => this.handleFormSubmit(e));
    
    // Listener para cambios en el input de username
    this.domHandler.addUsernameInputListener((e) => 
      this.domHandler.updateUserAvatar(e.target.value)
    );
  }

  /**
   * Establece la conexión WebSocket
   */
  async connectToWebSocket() {
    try {
      // Configurar handler de mensajes antes de conectar
      this.websocketManager.setMessageHandler((messageData) => 
        this.handleIncomingMessage(messageData)
      );
      
      await this.websocketManager.connect();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  handleFormSubmit(e) {
    e.preventDefault();
    
    const messageText = this.domHandler.getMessageValue();
    const username = this.domHandler.getUsernameValue();
    
    if (!messageText) {
      return; // No enviar mensajes vacíos
    }

    const message = MessageService.createOutgoingMessage(messageText, username);
    
    if (!message.isValid()) {
      console.error('Invalid message');
      return;
    }

    this.sendMessage(message);
    this.displayOwnMessage(message);
    this.domHandler.clearMessageInput();
  }

  /**
   * Envía un mensaje a través del WebSocket
   * @param {ChatMessage} message - Mensaje a enviar
   */
  sendMessage(message) {
    if (this.websocketManager.isConnected()) {
      this.websocketManager.send(message.toJSON());
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }

  /**
   * Muestra el mensaje propio en la interfaz
   * @param {ChatMessage} message - Mensaje a mostrar
   */
  displayOwnMessage(message) {
    this.domHandler.updateUserAvatar(message.username);
    const messageHTML = UIElementFactory.createChatMessage(
      message.message, 
      message.username, 
      true
    );
    this.domHandler.addMessage(messageHTML);
  }

  /**
   * Maneja mensajes entrantes del WebSocket
   * @param {string} rawData - Datos raw del mensaje
   */
  handleIncomingMessage(rawData) {
    const message = MessageService.processIncomingMessage(rawData);
    
    if (message) {
      this.displayIncomingMessage(message);
    } else {
      // Fallback para compatibilidad con mensajes de texto plano
      this.domHandler.addMessage(rawData);
    }
  }

  /**
   * Muestra un mensaje entrante en la interfaz
   * @param {ChatMessage} message - Mensaje a mostrar
   */
  displayIncomingMessage(message) {
    const messageHTML = UIElementFactory.createChatMessage(
      message.message,
      message.username,
      false
    );
    this.domHandler.addMessage(messageHTML);
  }

  /**
   * Desconecta y limpia recursos
   */
  destroy() {
    if (this.websocketManager) {
      this.websocketManager.disconnect();
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const chatApp = new ChatController();
  
  // Cleanup al cerrar la ventana
  window.addEventListener('beforeunload', () => {
    chatApp.destroy();
  });
});