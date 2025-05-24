import { TimeUtils } from './utils.js';

/**
 * Modelo para representar un mensaje de chat
 * Principio SRP: Solo se encarga de la estructura y validación de mensajes
 */
export class ChatMessage {
  constructor(message, username, timestamp = null) {
    this.message = message;
    this.username = username || 'Anónimo';
    this.timestamp = timestamp || TimeUtils.getCurrentTime();
  }

  /**
   * Valida si el mensaje es válido
   * @returns {boolean} True si el mensaje es válido
   */
  isValid() {
    return this.message && this.message.trim() !== '';
  }

  /**
   * Convierte el mensaje a JSON para envío
   * @returns {string} JSON string del mensaje
   */
  toJSON() {
    return JSON.stringify({
      message: this.message,
      username: this.username,
      timestamp: this.timestamp
    });
  }

  /**
   * Crea un ChatMessage desde datos JSON
   * @param {Object} data - Datos del mensaje
   * @returns {ChatMessage} Instancia de ChatMessage
   */
  static fromJSON(data) {
    return new ChatMessage(data.message, data.username, data.timestamp);
  }
}

/**
 * Servicio para manejar mensajes de chat
 * Principio SRP: Solo se encarga de la lógica de mensajes
 */
export class MessageService {
  /**
   * Procesa un mensaje recibido del servidor
   * @param {string} rawData - Datos raw del mensaje
   * @returns {ChatMessage|null} Mensaje procesado o null si hay error
   */
  static processIncomingMessage(rawData) {
    try {
      const parsedMessage = JSON.parse(rawData);
      if (parsedMessage.message && parsedMessage.username) {
        return ChatMessage.fromJSON(parsedMessage);
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse message as JSON:', error);
      return null;
    }
  }

  /**
   * Crea un mensaje para envío
   * @param {string} message - Contenido del mensaje
   * @param {string} username - Nombre del usuario
   * @returns {ChatMessage} Mensaje creado
   */
  static createOutgoingMessage(message, username) {
    const displayName = username === '' ? 'Anónimo' : username;
    return new ChatMessage(message, displayName);
  }
}