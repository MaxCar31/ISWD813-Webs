
/**
 * WebSocket manager for handling real-time communication
 */
class WebSocketManager {
    constructor(domUtils) {
        this.domUtils = domUtils;
        this.ws = null;
    }

    /**
     * Connect to WebSocket server with JWT token
     * @param {string} jwtToken - JWT authentication token
     */
    connect(jwtToken) {
        // Close existing connection if any
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`${CONFIG.WEBSOCKET_ENDPOINT}?token=${jwtToken}`);
        this.setupEventHandlers();
    }

    /**
     * Setup WebSocket event handlers
     */
    setupEventHandlers() {
        this.ws.onopen = (event) => {
            console.log("WebSocket connection established.");
            // Optional: Send initial message
            // this.ws.send("WS Open!");
        };

        this.ws.onmessage = (event) => {
            console.log("WebSocket message received: ", event.data);
            this.handleMessage(event.data);
        };

        this.ws.onerror = (event) => {
            console.error("WebSocket error received: ", event);
            this.domUtils.showError("WebSocket connection error.");
        };

        this.ws.onclose = (event) => {
            console.log("WebSocket connection closed.");
        };
    }

    /**
     * Handle incoming WebSocket message
     * @param {string} data - Message data
     */
    handleMessage(data) {
        if (data.includes("Error")) {
            this.domUtils.showError(data);
        } else {
            window.messageManager.addMessage(data);
        }
    }

    /**
     * Send message through WebSocket
     * @param {string} message - Message to send
     * @returns {boolean} - Success status
     */
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            return true;
        }
        return false;
    }

    /**
     * Check if WebSocket is connected
     * @returns {boolean}
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Close WebSocket connection
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Export for use in other modules
window.WebSocketManager = WebSocketManager;
