/**
 * 🔐 Google OAuth Configuration
 * Frontend OAuth setup for QuesGen
 * Production-ready with proper error handling
 */

class GoogleOAuthConfig {
  constructor() {
    this.clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    this.scope = [
      'openid',
      'profile',
      'email'
    ];
    this.discoveryDocs = [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    ];
  }

  /**
   * Initialize Google Sign-In
   * Call this on component mount
   */
  async initialize() {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured. Set VITE_REACT_APP_GOOGLE_CLIENT_ID in .env');
    }

    return new Promise((resolve, reject) => {
      // Load Google API
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response) => {
            this.handleCredentialResponse(response);
          },
          error_callback: (error) => {
            console.error('Google Sign-In initialization error:', error);
            reject(error);
          },
          auto_select: false,
          itp_support: true,
        });

        resolve(window.google);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'));
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Render Google Sign-In button
   */
  renderButton(containerId, options = {}) {
    if (!window.google) {
      console.error('Google not loaded. Call initialize() first.');
      return;
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: '100%',
      locale: 'en',
      ...options
    };

    window.google.accounts.id.renderButton(
      document.getElementById(containerId),
      defaultOptions
    );
  }

  /**
   * Handle OAuth credential response
   */
  async handleCredentialResponse(response) {
    const { credential } = response;

    if (!credential) {
      throw new Error('No credential received from Google');
    }

    try {
      // Send token to backend for verification
      const backendResponse = await fetch(`${this.backendUrl}/api/auth/google-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: credential,
        }),
      });

      if (!backendResponse.ok) {
        const error = await backendResponse.json();
        throw new Error(error.message || 'Backend verification failed');
      }

      const data = await backendResponse.json();

      // Store tokens and user info
      if (data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('questra_user', JSON.stringify(data.data.user));

        if (data.data?.refreshToken) {
          localStorage.setItem('refresh_token', data.data.refreshToken);
        }
      }

      return data.data;
    } catch (error) {
      console.error('OAuth verification error:', error);
      throw error;
    }
  }

  /**
   * Verify token with backend
   */
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/google-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  /**
   * Sign out user
   */
  signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('questra_user');
  }

  /**
   * Get stored user info
   */
  getStoredUser() {
    const user = localStorage.getItem('questra_user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get stored token
   */
  getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getStoredToken() && !!this.getStoredUser();
  }
}

// Export singleton instance
export default new GoogleOAuthConfig();
