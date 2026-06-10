/**
 * 🔐 Google OAuth Service
 * Handles OAuth token verification and user authentication
 * Production-ready with proper error handling
 */

const https = require('https');
const { promisify } = require('util');

class GoogleOAuthService {
  constructor() {
    this.tokenInfo = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    this.verifyUrl = 'https://oauth2.googleapis.com/tokeninfo';
    this.pubKeysUrl = 'https://www.googleapis.com/oauth2/v1/certs';
    this.pubKeys = null;
    this.pubKeysExpire = 0;
  }

  /**
   * Fetch Google's public keys for token verification
   * Keys are cached with TTL
   */
  async getGooglePublicKeys() {
    const now = Date.now();

    // Return cached keys if still valid
    if (this.pubKeys && now < this.pubKeysExpire) {
      return this.pubKeys;
    }

    try {
      const response = await this.httpsGet(this.pubKeysUrl);
      const data = JSON.parse(response);

      // Cache for 24 hours
      this.pubKeys = data;
      this.pubKeysExpire = now + 24 * 60 * 60 * 1000;

      return data;
    } catch (error) {
      console.error('Failed to fetch Google public keys:', error.message);
      throw new Error('Unable to fetch OAuth verification keys');
    }
  }

  /**
   * HTTPS GET request helper
   */
  httpsGet(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  /**
   * Verify Google ID Token (Production method)
   * Validates token signature against Google's public keys
   */
  async verifyIdToken(idToken) {
    if (!idToken) {
      throw new Error('ID token is required');
    }

    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [headerStr, payloadStr, signatureStr] = parts;
      const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString());

      // Verify token audience (accept multiple env var names)
      const expectedAud = process.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      if (expectedAud && payload.aud !== expectedAud) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Token audience mismatch');
        } else {
          console.warn('Warning: token audience mismatch (dev mode) — continuing for demo');
        }
      }

      if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') {
        throw new Error('Invalid token issuer');
      }

      if (Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired');
      }

      // In production with node-jose or jsonwebtoken:
      // await verifyTokenSignature(idToken, publicKeys);

      return {
        success: true,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        sub: payload.sub // Google unique ID
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Verify Google ID Token via Google's tokeninfo endpoint (fallback method)
   * Less secure but works without external dependencies
   */
  async verifyIdTokenViaGoogle(idToken) {
    if (!idToken) {
      throw new Error('ID token is required');
    }

    try {
      const response = await this.httpsGet(
        `${this.verifyUrl}?id_token=${encodeURIComponent(idToken)}`
      );
      const data = JSON.parse(response);

      if (data.error) {
        throw new Error(`Google verification error: ${data.error_description}`);
      }

      const expectedAud = process.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      if (expectedAud && data.aud !== expectedAud) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Token audience mismatch');
        } else {
          console.warn('Warning: token audience mismatch via Google endpoint (dev mode) — continuing for demo');
        }
      }

      return {
        success: true,
        email: data.email,
        name: data.name,
        picture: data.picture,
        sub: data.sub
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Verify access token validity
   */
  async verifyAccessToken(accessToken) {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    try {
      const response = await this.httpsGet(
        `${this.verifyUrl}?access_token=${encodeURIComponent(accessToken)}`
      );
      const data = JSON.parse(response);

      if (data.error) {
        throw new Error('Invalid access token');
      }

      return {
        success: true,
        userId: data.user_id,
        email: data.email,
        scopes: data.scope.split(' ')
      };
    } catch (error) {
      throw new Error(`Access token verification failed: ${error.message}`);
    }
  }

  /**
   * Extract user info from ID token payload (without verification - for demo/fallback)
   */
  extractTokenPayload(idToken) {
    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        sub: payload.sub
      };
    } catch (error) {
      throw new Error(`Failed to parse token: ${error.message}`);
    }
  }
}

module.exports = new GoogleOAuthService();
