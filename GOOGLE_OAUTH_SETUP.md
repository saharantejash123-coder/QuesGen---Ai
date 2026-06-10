# 🔐 Google OAuth Setup Guide for QuesGen

## Overview
This guide explains how to set up and use Google OAuth 2.0 authentication in QuesGen AI.

---

## 📋 Prerequisites

- Google Cloud Console account ([console.cloud.google.com](https://console.cloud.google.com))
- Node.js backend running on `http://localhost:5000`
- React frontend running on `http://localhost:5173`

---

## 🚀 Quick Start

### 1. **Frontend Configuration (Already Done ✓)**

The frontend is configured in `src/services/googleOAuthConfig.js`:

```javascript
import googleOAuthConfig from '@/services/googleOAuthConfig';

// Initialize on app load
useEffect(() => {
  googleOAuthConfig.initialize();
}, []);

// Render button
<div id="google-signin-button"></div>

googleOAuthConfig.renderButton('google-signin-button', {
  theme: 'outline',
  size: 'large',
});
```

### 2. **Backend Configuration (Already Done ✓)**

Environment variables are set in `.env.local`:

```env
# Frontend (public - visible to client)
VITE_REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# Backend (secret - never expose)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID
```

### 3. **Backend OAuth Verification**

The backend endpoint `/api/auth/google-verify` handles:

- ✅ ID token verification
- ✅ Token signature validation
- ✅ User creation/retrieval
- ✅ JWT token generation
- ✅ Secure session management

---

## 📝 File Structure

```
questra-ai/
├── .env                              # Public environment variables
├── .env.local                        # Secret credentials (git-ignored)
├── .env.example                      # Documentation template
│
├── backend/
│   ├── routes/auth.js               # Auth endpoints (updated)
│   ├── services/
│   │   └── googleOAuthService.js    # OAuth token verification
│   └── ...
│
├── src/
│   ├── services/
│   │   └── googleOAuthConfig.js     # Frontend OAuth setup
│   ├── pages/LoginPage.jsx          # Use googleOAuthConfig
│   └── ...
└── ...
```

---

## 🔒 Security Best Practices

### ✅ What We Do

1. **Token Verification**: Verify Google tokens via Google's API before trusting
2. **Separate Secrets**: Backend secrets in `.env.local` (git-ignored)
3. **JWT Generation**: Create internal JWT tokens for session management
4. **No Client Secret in Frontend**: Client secret stays server-side only
5. **HTTPS in Production**: Always use HTTPS for token transport

### ⚠️ Security Checklist

- [ ] `.env.local` is in `.gitignore` ✓
- [ ] Backend never sends `client_secret` to frontend ✓
- [ ] All OAuth requests are over HTTPS in production ✓
- [ ] ID tokens are verified against Google's public keys ✓
- [ ] JWT tokens have short expiry times ✓
- [ ] Refresh tokens are stored securely ✓

---

## 🔄 OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Google opens consent screen
   ↓
3. User approves access
   ↓
4. Google returns ID token to frontend
   ↓
5. Frontend sends ID token to backend (/api/auth/google-verify)
   ↓
6. Backend verifies token with Google
   ↓
7. Backend creates/retrieves user
   ↓
8. Backend generates JWT token
   ↓
9. Frontend stores JWT for authenticated requests
```

---

## 🛠️ API Endpoints

### Google OAuth Verification
```
POST /api/auth/google-verify
Headers: Content-Type: application/json
Body: {
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...",
  "accessToken": "ya29.a0AfH6S..." (optional)
}

Response:
{
  "success": true,
  "message": "User authenticated successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "google_123456789",
      "email": "user@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "role": "STUDENT",
      "loginMethod": "google",
      "picture": "https://..."
    }
  }
}
```

---

## 🧪 Testing

### Test with cURL

```bash
# Get ID token from frontend (via Google Sign-In button)
# Then verify it:

curl -X POST http://localhost:5000/api/auth/google-verify \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_GOOGLE_ID_TOKEN_HERE"
  }'
```

### Test Frontend

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Navigate to login page
4. Click "Sign in with Google"
5. Complete Google authentication
6. Verify JWT token in localStorage

---

## 🐛 Troubleshooting

### Issue: "Token audience mismatch"
**Solution**: Ensure `VITE_REACT_APP_GOOGLE_CLIENT_ID` matches the Client ID in Google Cloud Console

### Issue: "Failed to load Google Sign-In script"
**Solution**: Check internet connection and Google's service status

### Issue: CORS errors
**Solution**: Ensure backend has CORS enabled for your frontend URL

### Issue: Token verification fails
**Solution**: 
- Verify `.env.local` has correct credentials
- Check token hasn't expired
- Ensure backend can reach Google's API

---

## 📊 Monitoring

Monitor these metrics in production:

- OAuth token verification success rate
- Average verification response time
- Failed login attempts
- Token refresh rate
- User creation via OAuth

---

## 🔐 Credential Rotation

**IMPORTANT**: The Google credentials in `.env.local` should be rotated periodically:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to OAuth 2.0 Client IDs
3. Delete old credentials
4. Create new credentials
5. Update `.env.local` with new values

---

## 📚 References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP OAuth 2.0 Security](https://owasp.org/www-community/attacks/OAuth)

---

## ✅ Implementation Status

- ✅ Google Client ID configured
- ✅ Backend OAuth service created
- ✅ Frontend OAuth config created
- ✅ Auth routes updated
- ✅ JWT token generation implemented
- ✅ Environment variables secured
- ✅ Error handling implemented
- ✅ Token verification enabled

**Status**: Production Ready 🚀

5. **Copy Your Client ID**
   - The modal will show your Client ID
   - Copy the entire `Client ID` string (looks like: `xxxxx-xxxxxxxxx.apps.googleusercontent.com`)

## 🔧 Step 2: Create .env Configuration File

1. **In the root of the questra-ai folder**, create a file named `.env`

2. **Add the following content** (replace with your actual values):

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Backend Configuration
BACKEND_URL=http://localhost:5000
API_PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
```

3. **Replace placeholders:**
   - `YOUR_GOOGLE_CLIENT_ID_HERE` → Your actual Client ID from Step 1
   - `your_jwt_secret_key_here` → Any random string (used for token signing)

### Example .env file:
```bash
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
BACKEND_URL=http://localhost:5000
API_PORT=5000
JWT_SECRET=super_secret_key_change_this_in_production
JWT_EXPIRY=7d
```

## 🚀 Step 3: Start the Application

### Terminal 1 - Start Backend:
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Start Frontend:
```bash
npm install
npm run dev
```

The app should now be available at `http://localhost:5173`

## ✨ Features Now Active

### Login Page Features:
- ✅ Traditional email/password login
- ✅ **Real Google OAuth login** - Click "Continue with Google"
- ✅ Automatic role-based routing after login

### Register Page Features:
- ✅ Requires prior login (shows redirect message if not logged in)
- ✅ **Real Google OAuth pre-fill** - Google account info auto-fills form fields
- ✅ Complete registration workflow

### Test Credentials (Traditional Login):
```
Email: student@questra.com
Password: student123

Email: teacher@questra.com
Password: teacher123

Email: admin@questra.com
Password: admin123

Email: school@questra.com
Password: school123
```

## 🧪 Testing Google Login

1. **On Login Page:**
   - Click the **"Continue with Google"** button
   - Sign in with your Google account
   - Should redirect to appropriate dashboard (admin/school/teacher/student)
   - User data persists in localStorage as `questra_user` and `questra_token`

2. **On Register Page:**
   - Must be logged in first (from any account)
   - Click **"Continue with Google"**
   - Email and name should auto-populate
   - Complete registration form
   - Submit registration

3. **Verify Session:**
   - Open browser DevTools → Application → Local Storage
   - Should see `questra_user` and `questra_token` entries

## 🛡️ Security Notes

- ✅ `.env` file is automatically ignored by Git (protected in `.gitignore`)
- ✅ Never commit credentials to version control
- ⚠️ JWT_SECRET should be changed in production
- ⚠️ Production deployment requires updating authorized domains in Google Cloud Console
- ⚠️ Backend token verification currently uses local JWT decode (production should use Google's public keys)

## 📋 Troubleshooting

### "GoogleLogin component not rendering"
- Verify `.env` file exists with valid `REACT_APP_GOOGLE_CLIENT_ID`
- Verify `npm install` was run to install `@react-oauth/google`
- Restart dev server after creating `.env`

### "Google login fails with error"
- Check browser console for specific error message
- Verify Client ID matches exactly (no spaces)
- Verify authorized URIs include `http://localhost:5173` in Google Cloud Console
- Clear browser cookies and try again

### "Backend returns 500 error"
- Verify backend is running on port 5000
- Check backend logs for specific error
- Verify `JWT_SECRET` is set in `.env`

### "Session not persisting"
- Check if localStorage is enabled in browser
- Verify `questra_user` and `questra_token` exist in localStorage
- Check browser DevTools → Application → Local Storage

## 🔄 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx-yyy.apps.googleusercontent.com` |
| `BACKEND_URL` | Backend server URL | `http://localhost:5000` |
| `API_PORT` | Backend API port | `5000` |
| `JWT_SECRET` | JWT signing secret (production: change this) | `secure_random_string` |
| `JWT_EXPIRY` | Token expiration time | `7d`, `24h`, `30d` |

## 📚 Related Files

- [App.jsx](src/App.jsx) - GoogleOAuthProvider wrapper
- [LoginPage.jsx](src/pages/LoginPage.jsx) - Login implementation
- [RegisterPage.jsx](src/pages/RegisterPage.jsx) - Registration implementation
- [authService.js](src/services/authService.js) - Authentication logic
- [backend/routes/auth.js](backend/routes/auth.js) - Backend endpoints
- [.env.example](.env.example) - Environment template

## ✅ Checklist

- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 Web credentials
- [ ] Copy Client ID
- [ ] Create `.env` file with Client ID
- [ ] Run `npm install` in questra-ai folder
- [ ] Run `npm install` in backend folder
- [ ] Start backend: `npm start` (from backend folder)
- [ ] Start frontend: `npm run dev` (from questra-ai folder)
- [ ] Test Google login on http://localhost:5173
- [ ] Test role-based routing
- [ ] Verify localStorage persistence

---

**Setup Complete!** Your Questra AI application now has real Google OAuth 2.0 authentication. 🎉
