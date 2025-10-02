// Authentication Helper Functions
class AuthManager {
    constructor() {
        this.adminPass = 'admin123';
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    }

    // Check if user is logged in
    isLoggedIn() {
        const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        const loginTime = localStorage.getItem('loginTime');
        
        if (!loggedIn || !loginTime) {
            return false;
        }

        // Check session timeout
        const now = new Date().getTime();
        const loginTimestamp = new Date(loginTime).getTime();
        
        if (now - loginTimestamp > this.sessionTimeout) {
            this.logout();
            return false;
        }

        return true;
    }

    // Get admin username
    getUsername() {
        return localStorage.getItem('adminUsername') || 'Admin';
    }

    // Login function
    login(username, password) {
        if (username === 'admin' && password === this.adminPass) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUsername', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            return true;
        }
        return false;
    }

    // Logout function
    logout() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('loginTime');
    }

    // Get auth headers for API calls
    getAuthHeaders() {
        return {
            'x-admin-pass': this.adminPass,
            'Content-Type': 'application/json'
        };
    }

    // Make authenticated API call
    async authFetch(url, options = {}) {
        if (!this.isLoggedIn()) {
            throw new Error('Not authenticated');
        }

        const defaultOptions = {
            headers: this.getAuthHeaders()
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            this.logout();
            window.location.href = 'login.html';
            throw new Error('Session expired');
        }

        return response;
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Update session time
    updateSession() {
        if (this.isLoggedIn()) {
            localStorage.setItem('loginTime', new Date().toISOString());
        }
    }
}

// Create global auth manager instance
const auth = new AuthManager();

// Auto-update session on user activity
document.addEventListener('click', () => auth.updateSession());
document.addEventListener('keypress', () => auth.updateSession());

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check for login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }

    // Check if this is a protected page
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!auth.requireAuth()) {
            return;
        }
    }
});

// Export for use in other scripts
window.auth = auth;


