/**
 * Utilidades generales para la aplicación de chat
 * Principio SRP: Solo se encarga de funciones utilitarias
 */
export class TimeUtils {
  /**
   * Genera un timestamp en formato español
   * @returns {string} Tiempo formateado HH:MM
   */
  static getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

export class StringUtils {
  /**
   * Obtiene las iniciales de un nombre
   * @param {string} name - Nombre del usuario
   * @returns {string} Iniciales en mayúscula
   */
  static getInitials(name) {
    if (!name || name.trim() === '') return 'AN';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  /**
   * Valida si un string no está vacío
   * @param {string} str - String a validar
   * @returns {boolean} True si no está vacío
   */
  static isNotEmpty(str) {
    return str && str.trim() !== '';
  }
}

export class ColorUtils {
  static #colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
  ];

  /**
   * Genera un color aleatorio para avatares
   * @returns {string} Clase CSS de color
   */
  static getRandomColor() {
    return this.#colors[Math.floor(Math.random() * this.#colors.length)];
  }
}