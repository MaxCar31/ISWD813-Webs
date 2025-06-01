
/**
 * Authentication manager for handling login functionality
 */
class AuthManager {
    constructor(domUtils) {
        this.domUtils = domUtils;
    }

    /**
     * Authenticate user with username and password
     */
    async login() {
        const { username, password } = this.domUtils.getInputValues();

        if (!this.validateInput(username, password)) {
            return;
        }

        this.domUtils.setLoginLoading(true);

        try {
            const response = await this.authenticate(username, password);
            
            if (response.includes("Error")) {
                this.domUtils.showError(response);
            } else {
                this.domUtils.hideError();
                this.onLoginSuccess(response);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.domUtils.showError("Connection error. Please try again.");
        } finally {
            this.domUtils.setLoginLoading(false);
        }
    }

    /**
     * Validate login input
     * @param {string} username 
     * @param {string} password 
     * @returns {boolean}
     */
    validateInput(username, password) {
        if (!username || !password) {
            this.domUtils.showError("Please enter both username and password.");
            return false;
        }
        return true;
    }

    /**
     * Make authentication request
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<string>}
     */
    async authenticate(username, password) {
        const response = await fetch(`${CONFIG.AUTH_ENDPOINT}?username=${username}&password=${password}`);
        return await response.text();
    }

    /**
     * Handle successful login
     * @param {string} jwtToken 
     */
    onLoginSuccess(jwtToken) {
        // Clear the empty state message
        this.domUtils.removeEmptyState();
        
        // Initialize WebSocket connection
        window.websocketManager.connect(jwtToken);
    }
}

// Export for use in other modules
window.AuthManager = AuthManager;
