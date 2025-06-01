
/**
 * DOM utility functions for element manipulation and error handling
 */
class DOMUtils {
    constructor() {
        this.elements = this.initializeElements();
    }

    /**
     * Initialize and cache DOM elements
     */
    initializeElements() {
        return {
            messageDiv: document.querySelector(CONFIG.SELECTORS.MESSAGES),
            errorMessageSpan: document.querySelector(CONFIG.SELECTORS.ERROR_MESSAGE),
            usernameInput: document.querySelector(CONFIG.SELECTORS.USERNAME),
            passwordInput: document.querySelector(CONFIG.SELECTORS.PASSWORD),
            loginBtn: document.querySelector(CONFIG.SELECTORS.LOGIN_BTN),
            messageInput: document.querySelector(CONFIG.SELECTORS.MESSAGE_CONTENT),
            sendBtn: document.querySelector(CONFIG.SELECTORS.SEND_BTN)
        };
    }

    /**
     * Show error message with animation
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.elements.errorMessageSpan.innerHTML = message;
        this.elements.errorMessageSpan.classList.remove("hidden");
        setTimeout(() => {
            this.elements.errorMessageSpan.classList.add("hidden");
        }, CONFIG.ERROR_MESSAGE_TIMEOUT);
    }

    /**
     * Hide error message
     */
    hideError() {
        this.elements.errorMessageSpan.classList.add("hidden");
    }

    /**
     * Get input values
     */
    getInputValues() {
        return {
            username: this.elements.usernameInput.value,
            password: this.elements.passwordInput.value,
            messageContent: this.elements.messageInput.value
        };
    }

    /**
     * Clear message input
     */
    clearMessageInput() {
        this.elements.messageInput.value = "";
    }

    /**
     * Set login button loading state
     * @param {boolean} loading - Whether to show loading state
     */
    setLoginLoading(loading) {
        if (loading) {
            this.elements.loginBtn.innerHTML = `
                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...`;
            this.elements.loginBtn.disabled = true;
        } else {
            this.elements.loginBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login`;
            this.elements.loginBtn.disabled = false;
        }
    }

    /**
     * Remove empty state message from chat
     */
    removeEmptyState() {
        const emptyState = this.elements.messageDiv.querySelector('.text-center');
        if (emptyState) {
            emptyState.remove();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Allow sending messages with Enter key
        this.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.messageManager.sendMessage();
            }
        });
        
        // Allow login with Enter key
        this.elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.authManager.login();
            }
        });

        // Login button click
        this.elements.loginBtn.addEventListener('click', () => {
            window.authManager.login();
        });

        // Send button click
        this.elements.sendBtn.addEventListener('click', () => {
            window.messageManager.sendMessage();
        });
    }
}

// Export for use in other modules
window.DOMUtils = DOMUtils;
