
/**
 * Main application initialization and orchestration
 */
class ChatApp {
    constructor() {
        this.domUtils = null;
        this.authManager = null;
        this.websocketManager = null;
        this.messageManager = null;
    }

    /**
     * Initialize the chat application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup application components
     */
    setup() {
        try {
            // Initialize components
            this.domUtils = new DOMUtils();
            this.authManager = new AuthManager(this.domUtils);
            this.websocketManager = new WebSocketManager(this.domUtils);
            this.messageManager = new MessageManager(this.domUtils);

            // Make managers globally available for cross-component communication
            window.domUtils = this.domUtils;
            window.authManager = this.authManager;
            window.websocketManager = this.websocketManager;
            window.messageManager = this.messageManager;

            // Setup event listeners
            this.domUtils.setupEventListeners();

            console.log('Chat application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize chat application:', error);
        }
    }

    /**
     * Cleanup function for when the page is unloaded
     */
    cleanup() {
        if (this.websocketManager) {
            this.websocketManager.disconnect();
        }
    }
}

// Initialize the application
const chatApp = new ChatApp();
chatApp.init();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    chatApp.cleanup();
});

// Export for global access
window.ChatApp = ChatApp;
