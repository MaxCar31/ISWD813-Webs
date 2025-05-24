import { UIElementFactory } from './ui-factory.js';
import { StringUtils } from './utils.js';

/**
 * Manejador del DOM para la interfaz de chat
 * Principio SRP: Solo se encarga de manipular elementos del DOM
 */
export class DOMHandler {
  constructor() {
    this.elements = {
      messagesContainer: document.querySelector('#messages'),
      userAvatar: document.querySelector('#user-avatar'),
      onlineUsers: document.querySelector('#online-users'),
      messageInput: document.querySelector('#input'),
      usernameInput: document.querySelector('#username'),
      form: document.querySelector('#form')
    };
  }

  /**
   * Añade un mensaje al contenedor de mensajes
   * @param {string} messageHTML - HTML del mensaje
   */
  addMessage(messageHTML) {
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
      this.scrollToBottom();
    }
  }

  /**
   * Actualiza el avatar del usuario en el header
   * @param {string} username - Nombre del usuario
   */
  updateUserAvatar(username) {
    if (this.elements.userAvatar && StringUtils.isNotEmpty(username)) {
      const initials = StringUtils.getInitials(username);
      this.elements.userAvatar.textContent = initials;
    }
  }

  /**
   * Añade un usuario a la lista de conectados
   * @param {string} username - Nombre del usuario
   */
  addUserToOnlineList(username) {
    if (this.elements.onlineUsers) {
      const userHTML = UIElementFactory.createUserListItem(username);
      this.elements.onlineUsers.insertAdjacentHTML('beforeend', userHTML);
    }
  }

  /**
   * Obtiene el valor del input de mensaje
   * @returns {string} Texto del mensaje
   */
  getMessageValue() {
    return this.elements.messageInput?.value.trim() || '';
  }

  /**
   * Obtiene el valor del input de username
   * @returns {string} Nombre del usuario
   */
  getUsernameValue() {
    return this.elements.usernameInput?.value.trim() || '';
  }

  /**
   * Limpia el input de mensaje y le da foco
   */
  clearMessageInput() {
    if (this.elements.messageInput) {
      this.elements.messageInput.value = '';
      this.elements.messageInput.focus();
    }
  }

  /**
   * Hace scroll hacia abajo en el contenedor de mensajes
   */
  scrollToBottom() {
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    }
  }

  /**
   * Verifica si todos los elementos DOM necesarios están disponibles
   * @returns {boolean} True si todos los elementos están disponibles
   */
  areElementsAvailable() {
    return !!(this.elements.messageInput && 
              this.elements.usernameInput && 
              this.elements.messagesContainer);
  }

  /**
   * Añade listener al formulario
   * @param {Function} callback - Función callback para el submit
   */
  addFormListener(callback) {
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', callback);
    }
  }

  /**
   * Añade listener al input de username
   * @param {Function} callback - Función callback para el input
   */
  addUsernameInputListener(callback) {
    if (this.elements.usernameInput) {
      this.elements.usernameInput.addEventListener('input', callback);
    }
  }
}