const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, asyncHandler } = require('../errors');
const { getClient } = require('../services/supabaseClient');
const db = require('../db/database');
const { storeOTP, checkOTP, sendOTPEmail } = require('../services/emailService');
const googleOAuthService = require('../services/googleOAuthService');
const { isGmailAccount, isValidEmail, validatePassword } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'questra_super_secret_key_123';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return errorResponse(res, 'Email and password required', 400);

  const supabase = getClient();
  if (supabase) {
    // Try Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data || !data.user) {
      return errorResponse(res, error?.message || 'Invalid credentials', 401);
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata?.firstName || '',
      lastName: data.user.user_metadata?.lastName || '',
      role: data.user.user_metadata?.role || 'STUDENT'
    };

    // Check if user is banned
    const banRow = await new Promise((resolve) => {
      db.get('SELECT reason FROM banned_users WHERE user_id = ? AND status = ?', [user.id, 'active'], (err, row) => resolve(row || null));
    });
    if (banRow) {
      return res.status(403).json({ success: false, banned: true, reason: banRow.reason || 'No reason provided', error: 'Your account has been banned.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return successResponse(res, { token, user });
  }

  // Fallback: demo user (no DB)
  const mockUser = { id: 'user_' + Date.now(), email: email.toLowerCase(), role: 'STUDENT', firstName: email.split('@')[0], lastName: '' };
  const token = jwt.sign({ userId: mockUser.id, role: mockUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  successResponse(res, { token, user: mockUser });
}));

// Register endpoint - Accept all email addresses
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Validate required fields
  if (!email || !password || !firstName) {
    return errorResponse(res, 'Missing required fields', 400);
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return errorResponse(res, 'Invalid email format', 400);
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return errorResponse(res, passwordValidation.message, 400);
  }

  const supabase = getClient();
  if (supabase) {
    try {
      // Create user via Supabase Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: { 
          firstName, 
          lastName: lastName || '', 
          role: role || 'STUDENT',
          registrationMethod: 'email'
        }
      });

      if (error) {
        console.error('Supabase registration error:', error);
        return errorResponse(res, error.message || 'Failed to create user account', 500);
      }

      const user = {
        id: data.user?.id || `user_${Date.now()}`,
        email: data.user?.email || email.toLowerCase(),
        firstName: firstName,
        lastName: lastName || '',
        role: role || 'STUDENT'
      };

      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRY }
      );
      return successResponse(res, { token, user }, 201);
    } catch (err) {
      console.error('Registration error:', err);
      return errorResponse(res, err.message || 'Failed to register user', 500);
    }
  }

  // Fallback: demo mode
  console.warn('Supabase not configured - using demo mode');
  const user = { 
    id: 'user_' + Date.now(), 
    email: email.toLowerCase(), 
    firstName, 
    lastName: lastName || '', 
    role: role || 'STUDENT', 
    createdAt: new Date() 
  };
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  successResponse(res, { token, user }, 201);
}));

// Refresh token endpoint
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret');
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    successResponse(res, { accessToken: newAccessToken });
  } catch (error) {
    errorResponse(res, 'Invalid refresh token', 401);
  }
}));

// Google OAuth - Verify ID token and login/register
router.post('/google-verify', asyncHandler(async (req, res) => {
  const { idToken, firstName, lastName, role } = req.body;

  if (!idToken) {
    return errorResponse(res, 'ID token required', 400);
  }

  try {
    // Verify token with Google
    const googleUser = await googleOAuthService.verifyIdToken(idToken);

    const supabase = getClient();
    const email = googleUser.email.toLowerCase();
    const firstName_final = firstName || googleUser.given_name || 'User';
    const lastName_final = lastName || googleUser.family_name || '';

    if (supabase) {
      // Try to sign in existing user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: `google_${googleUser.sub}` // Use Google sub as password placeholder
      });

      if (signInData && signInData.user) {
        // User exists, log them in
        const user = {
          id: signInData.user.id,
          email: signInData.user.email,
          firstName: signInData.user.user_metadata?.firstName || firstName_final,
          lastName: signInData.user.user_metadata?.lastName || lastName_final,
          role: signInData.user.user_metadata?.role || role || 'STUDENT'
        };
        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        return successResponse(res, { token, user });
      }

      // User doesn't exist, create them
      try {
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: `google_${googleUser.sub}`,
          email_confirm: true,
          user_metadata: {
            firstName: firstName_final,
            lastName: lastName_final,
            role: role || 'STUDENT',
            googleId: googleUser.sub,
            registrationMethod: 'google_oauth'
          }
        });

        if (createError) {
          // If user already exists, try login again
          const { data: retryData } = await supabase.auth.signInWithPassword({
            email,
            password: `google_${googleUser.sub}`
          });

          if (retryData && retryData.user) {
            const user = {
              id: retryData.user.id,
              email: retryData.user.email,
              firstName: retryData.user.user_metadata?.firstName || firstName_final,
              lastName: retryData.user.user_metadata?.lastName || lastName_final,
              role: retryData.user.user_metadata?.role || role || 'STUDENT'
            };
            const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
            return successResponse(res, { token, user });
          }
          // Error creating user
          return errorResponse(res, 'Failed to register account', 500);
        }

        const user = {
          id: createData.user?.id || `user_${Date.now()}`,
          email: createData.user?.email || email,
          firstName: firstName_final,
          lastName: lastName_final,
          role: role || 'STUDENT'
        };

        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        return successResponse(res, { token, user }, 201);
      } catch (err) {
        console.error('User creation error:', err);
        return errorResponse(res, err.message || 'Failed to register', 500);
      }
    }

    // Fallback: no Supabase, create demo user (demo mode only)
    console.warn('Supabase not configured - using demo mode for Google OAuth');
    const user = {
      id: googleUser.sub,
      email: email,
      firstName: firstName_final,
      lastName: lastName_final,
      role: role || 'STUDENT'
    };
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    successResponse(res, { token, user }, 201);
  } catch (error) {
    console.error('Google verification error:', error);
    errorResponse(res, error.message || 'Google verification failed', 401);
  }
}));

// ── Send OTP ──────────────────────────────────────────────────────────────────
router.post('/send-otp', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return errorResponse(res, 'Email is required', 400);

  const otp = storeOTP(email);
  const result = await sendOTPEmail(email.trim().toLowerCase(), otp);

  if (result.sent) {
    return successResponse(res, { sent: true, message: 'OTP sent to your email.' });
  }
  // SMTP not configured — return OTP so frontend can display it (demo mode)
  return successResponse(res, { sent: false, demoOtp: result.demoOtp, message: 'SMTP not configured. Use the displayed OTP.' });
}));

// ── Ban check — queries Supabase first, then SQLite ────────────────────────
router.get('/ban-check', asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) return errorResponse(res, 'Email query param required', 400);
  const lcEmail = email.toLowerCase().trim();

  const supabase = getClient();

  // 1. Try Supabase Data API banned_users table (by email — works for ALL users)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('banned_users')
        .select('*')
        .eq('email', lcEmail)
        .eq('status', 'active')
        .limit(1);
      if (!error && data && data.length > 0) {
        const row = data[0];
        return successResponse(res, { banned: true, reason: row.reason || '', userId: row.user_id || row.email, bannedAt: row.banned_at });
      }
    } catch { /* table may not exist — fall through */ }

    // 2. Try Supabase Auth (for real UUID Supabase users)
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (!error && data?.users) {
        const u = data.users.find(x => x.email?.toLowerCase() === lcEmail);
        if (u && u.banned_until && new Date(u.banned_until) > new Date()) {
          return successResponse(res, { banned: true, reason: (u.user_metadata?.banReason) || '', userId: u.id, bannedAt: u.banned_until });
        }
      }
    } catch { /* fall through to SQLite */ }
  }

  // 3. Fall back to SQLite (for demo / local accounts)
  const row = await new Promise((resolve) => {
    db.get('SELECT * FROM banned_users WHERE email = ? AND status = ?', [lcEmail, 'active'], (err, row) => resolve(row || null));
  });
  if (row) {
    return successResponse(res, { banned: true, reason: row.reason || '', userId: row.user_id, bannedAt: row.banned_at });
  }

  return successResponse(res, { banned: false });
}));

// ── Verify OTP ────────────────────────────────────────────────────────────────
router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return errorResponse(res, 'Email and OTP are required', 400);

  const result = checkOTP(email, otp);
  if (!result.ok) return errorResponse(res, result.message, 400);

  return successResponse(res, { verified: true });
}));

module.exports = router;
