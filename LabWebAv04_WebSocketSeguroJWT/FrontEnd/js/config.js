
/**
 * Application configuration and constants
 */
const CONFIG = {
    // API endpoints
    AUTH_ENDPOINT: "https://localhost:5000/auth",
    WEBSOCKET_ENDPOINT: "wss://localhost:5000/ws",
    
    // UI settings
    ERROR_MESSAGE_TIMEOUT: 5000,
    
    // DOM selectors
    SELECTORS: {
        MESSAGES: "#messages",
        ERROR_MESSAGE: "#errorMessage",
        USERNAME: "#username",
        PASSWORD: "#password",
        LOGIN_BTN: "#login",
        MESSAGE_CONTENT: "#messageContent",
        SEND_BTN: "#send"
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
