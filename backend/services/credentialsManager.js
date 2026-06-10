/**
 * 🔐 Credentials Manager
 * Safely load and validate environment variables
 * Production-ready configuration management
 */

class CredentialsManager {
  constructor() {
    this.config = {
      // Frontend credentials
      googleClientId: process.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
      backendUrl: process.env.VITE_BACKEND_URL || 'http://localhost:5000',

      // Backend credentials (server-side only)
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      googleProjectId: process.env.GOOGLE_PROJECT_ID,

      // JWT
      jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
      jwtExpiry: process.env.JWT_EXPIRY || '7d',
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '30d',

      // API
      apiPort: process.env.API_PORT || 5000,
      nodeEnv: process.env.NODE_ENV || 'development',

      // OAuth callbacks
      googleOAuthCallback: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      backendOAuthCallback: process.env.BACKEND_OAUTH_CALLBACK_URL,
    };

    this.validate();
  }

  /**
   * Validate critical credentials are present
   */
  validate() {
    const required = {
      'VITE_REACT_APP_GOOGLE_CLIENT_ID': this.config.googleClientId,
    };

    // Backend credentials only required on server
    if (typeof window === 'undefined') {
      Object.assign(required, {
        'GOOGLE_CLIENT_SECRET': this.config.googleClientSecret,
        'GOOGLE_CLIENT_ID': this.config.googleClientId,
        'JWT_SECRET': this.config.jwtSecret,
      });
    }

    const missing = Object.entries(required)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      console.warn(`⚠️  Missing credentials: ${missing.join(', ')}`);
      console.warn('📝 Copy .env.example to .env.local and fill in actual values');
    }

    return missing.length === 0;
  }

  /**
   * Get frontend-safe credentials (public)
   */
  getFrontendConfig() {
    return {
      googleClientId: this.config.googleClientId,
      backendUrl: this.config.backendUrl,
      nodeEnv: this.config.nodeEnv,
    };
  }

  /**
   * Get backend credentials (server-side only)
   */
  getBackendConfig() {
    if (typeof window !== 'undefined') {
      throw new Error('Backend credentials cannot be accessed from frontend');
    }

    return {
      googleClientSecret: this.config.googleClientSecret,
      googleProjectId: this.config.googleProjectId,
      jwtSecret: this.config.jwtSecret,
      jwtExpiry: this.config.jwtExpiry,
      refreshTokenSecret: this.config.refreshTokenSecret,
      refreshTokenExpiry: this.config.refreshTokenExpiry,
    };
  }

  /**
   * Check if running in development
   */
  isDevelopment() {
    return this.config.nodeEnv === 'development';
  }

  /**
   * Check if running in production
   */
  isProduction() {
    return this.config.nodeEnv === 'production';
  }

  /**
   * Get all config (with secrets redacted for logging)
   */
  getRedactedConfig() {
    return {
      ...this.config,
      googleClientSecret: '***REDACTED***',
      jwtSecret: '***REDACTED***',
      refreshTokenSecret: '***REDACTED***',
    };
  }

  /**
   * Log configuration status
   */
  logStatus() {
    console.log('📊 Configuration Status:');
    console.log(JSON.stringify(this.getRedactedConfig(), null, 2));
  }
}

// Export singleton instance
module.exports = new CredentialsManager();
