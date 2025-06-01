
/**
 * Message manager for handling chat messages display and sending
 */
class MessageManager {
    constructor(domUtils) {
        this.domUtils = domUtils;
        this.messageCounter = 0;
    }

    /**
     * Add a new message to the chat with styling
     * @param {string} messageText - The message text to display
     */
    addMessage(messageText) {
        this.messageCounter++;
        const newMessageDiv = this.createMessageElement(messageText);
        this.domUtils.elements.messageDiv.appendChild(newMessageDiv);
        this.scrollToBottom();
    }

    /**
     * Create a message DOM element
     * @param {string} messageText - The message text
     * @returns {HTMLElement} - The message element
     */
    createMessageElement(messageText) {
        const messageDiv = document.createElement("div");
        const messageClass = this.messageCounter % 2 === 1 ? 'message-odd' : 'message-even';
        messageDiv.className = `message-bubble p-4 rounded-lg text-white shadow-md ${messageClass}`;
        
        const timestamp = this.getCurrentTimestamp();
        messageDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <p class="flex-1 break-words">${this.escapeHtml(messageText)}</p>
                <span class="text-xs text-white/70 ml-2 whitespace-nowrap">${timestamp}</span>
            </div>
        `;
        
        return messageDiv;
    }

    /**
     * Get current timestamp formatted for display
     * @returns {string} - Formatted timestamp
     */
    getCurrentTimestamp() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        this.domUtils.elements.messageDiv.scrollTop = this.domUtils.elements.messageDiv.scrollHeight;
    }

    /**
     * Send a message through WebSocket
     */
    sendMessage() {
        const { messageContent } = this.domUtils.getInputValues();

        if (!this.validateMessage(messageContent)) {
            return;
        }

        if (window.websocketManager.send(messageContent)) {
            this.domUtils.clearMessageInput();
        } else {
            this.domUtils.showError("You must log in to send a message.");
        }
    }

    /**
     * Validate message before sending
     * @param {string} messageContent - Message content to validate
     * @returns {boolean} - Validation result
     */
    validateMessage(messageContent) {
        if (!messageContent || messageContent.trim() === "") {
            this.domUtils.showError("Message content cannot be empty.");
            return false;
        }

        if (!window.websocketManager.isConnected()) {
            this.domUtils.showError("You must log in to send a message.");
            return false;
        }

        return true;
    }

    /**
     * Clear all messages from chat
     */
    clearMessages() {
        this.domUtils.elements.messageDiv.innerHTML = `
            <div class="text-center text-gray-500 mt-8">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        this.messageCounter = 0;
    }
}

// Export for use in other modules
window.MessageManager = MessageManager;
