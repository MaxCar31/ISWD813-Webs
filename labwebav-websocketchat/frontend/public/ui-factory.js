import { TimeUtils, StringUtils, ColorUtils } from './utils.js';

/**
 * Factory para crear elementos de UI
 * Principio SRP: Solo se encarga de crear elementos HTML
 */
export class UIElementFactory {
  /**
   * Crea un mensaje de chat estilo burbuja
   * @param {string} message - Contenido del mensaje
   * @param {string} username - Nombre del usuario
   * @param {boolean} isOwn - Si es mensaje propio
   * @returns {string} HTML del mensaje
   */
  static createChatMessage(message, username, isOwn = true) {
    const timestamp = TimeUtils.getCurrentTime();
    const initials = StringUtils.getInitials(username);
    const avatarColor = ColorUtils.getRandomColor();
    
    if (isOwn) {
      return this.#createOwnMessage(message, initials, avatarColor, timestamp);
    } else {
      return this.#createOtherMessage(message, username, initials, avatarColor, timestamp);
    }
  }

  /**
   * Crea elemento de usuario para lista de conectados
   * @param {string} username - Nombre del usuario
   * @returns {string} HTML del elemento de usuario
   */
  static createUserListItem(username) {
    const initials = StringUtils.getInitials(username);
    const avatarColor = ColorUtils.getRandomColor();
    
    return `
      <div class="flex items-center space-x-2">
        <div class="h-6 w-6 ${avatarColor} rounded-full text-white font-semibold flex items-center justify-center text-xs">
          ${initials}
        </div>
        <span class="text-sm">${username}</span>
        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
    `;
  }

  static #createOwnMessage(message, initials, avatarColor, timestamp) {
    return `
      <div class="flex justify-end mb-4">
        <div class="mr-2">
          <div class="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-xs">
            ${message}
          </div>
          <div class="text-xs text-gray-500 text-right mt-1">${timestamp}</div>
        </div>
        <div class="h-8 w-8 ${avatarColor} rounded-full text-white font-semibold flex items-center justify-center text-xs">
          ${initials}
        </div>
      </div>
    `;
  }

  static #createOtherMessage(message, username, initials, avatarColor, timestamp) {
    return `
      <div class="flex justify-start mb-4">
        <div class="h-8 w-8 ${avatarColor} rounded-full text-white font-semibold flex items-center justify-center text-xs">
          ${initials}
        </div>
        <div class="ml-2">
          <div class="text-xs text-gray-600 mb-1">${username}</div>
          <div class="py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-xs">
            ${message}
          </div>
          <div class="text-xs text-gray-500 mt-1">${timestamp}</div>
        </div>
      </div>
    `;
  }
}