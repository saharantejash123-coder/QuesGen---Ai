// ─── Demo accounts — always available, no server needed ───────────────────────
const DEMO_USERS = [
  {
    id: 'student_demo',
    email: 'student@questra.com',
    password: 'demo_password_123', // Changed to avoid generic patterns
    role: 'student',
    firstName: 'Demo',
    lastName: 'Student',
  },
  {
    id: 'teacher_demo',
    email: 'teacher@questra.com',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Demo',
    lastName: 'Teacher',
  },
  {
    id: 'admin_demo',
    email: 'admin@questra.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Demo',
    lastName: 'Admin',
  },
  {
    id: 'school_demo',
    email: 'school@questra.com',
    password: 'school123',
    role: 'school',
    firstName: 'Demo',
    lastName: 'School',
  },
];

// Registered accounts persisted in localStorage
function getRegistered() {
  try {
    return JSON.parse(localStorage.getItem('questra_registered') || '[]');
  } catch {
    return [];
  }
}

function saveRegistered(users) {
  localStorage.setItem('questra_registered', JSON.stringify(users));
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email, password) {
  // Simulate a brief network feel
  await new Promise((r) => setTimeout(r, 700));

  const lEmail = email.trim().toLowerCase();

  // 1. Check demo users
  const demo = DEMO_USERS.find((u) => u.email === lEmail);
  if (demo) {
    if (demo.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...user } = demo;
    return user;
  }

  // 2. Check locally registered users
  const registered = getRegistered();
  const found = registered.find((u) => u.email === lEmail);
  if (found) {
    if (found.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...user } = found;
    return user;
  }

  // 3. Try the real backend (may not be running — silently fallback)
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backend}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: lEmail, password }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) return { ...data.user, role: (data.user.role || 'student').toLowerCase() };
    }
  } catch {
    // backend offline — continue to demo fallback below
  }

  // 4. Accept any credentials in demo mode (creates a guest student session)
  return {
    id: 'guest_' + Date.now(),
    email: lEmail,
    firstName: lEmail.split('@')[0],
    lastName: '',
    role: 'student',
  };
}

// ─── Google Login with JWT Token ──────────────────────────────────────────────
export async function loginWithGoogleToken(googleToken) {
  // Simulate a brief network feel
  await new Promise((r) => setTimeout(r, 700));

  if (!googleToken) {
    throw new Error('Google token is required');
  }

  try {
    // Try to send token to backend for verification
    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backend}/api/auth/google-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: googleToken }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      // Backend returns data wrapped in .data object
      const userData = data.data || data.user || data;
      if (userData.user || userData.email) {
        const user = userData.user || userData;
        return {
          ...user,
          role: (user.role || 'student').toLowerCase(),
          loginMethod: 'google',
          googleToken: googleToken
        };
      }
    }
  } catch (err) {
    console.warn('Backend verification failed, attempting local decode:', err);
  }

  // Fallback: Decode JWT locally (without verification - for demo only)
  try {
    const decoded = decodeJWT(googleToken);
    
    if (decoded && decoded.email) {
      const registered = getRegistered();
      const found = registered.find((u) => u.email === decoded.email.toLowerCase());
      
      if (found) {
        const { password: _, ...user } = found;
        return { ...user, loginMethod: 'google', googleToken: googleToken };
      }

      // Create a new guest student session with Google info
      return {
        id: 'google_' + Date.now(),
        email: decoded.email.toLowerCase(),
        firstName: decoded.given_name || decoded.email.split('@')[0],
        lastName: decoded.family_name || '',
        role: 'student',
        loginMethod: 'google',
        googleToken: googleToken,
      };
    }
  } catch (decodeErr) {
    console.error('Failed to decode JWT:', decodeErr);
  }

  throw new Error('Unable to authenticate with Google. Please try again.');
}

// ─── JWT Decoder (for demo purposes) ──────────────────────────────────────────
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT decode error:', err);
    return null;
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register({ email, password, firstName, lastName, role = 'student' }) {
  await new Promise((r) => setTimeout(r, 700));

  const lEmail = email.trim().toLowerCase();

  // Block reuse of demo emails
  if (DEMO_USERS.some((u) => u.email === lEmail)) {
    throw new Error('This email is reserved for demo use.');
  }

  const registered = getRegistered();
  if (registered.some((u) => u.email === lEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: 'user_' + Date.now(),
    email: lEmail,
    password,           // plain text — demo only, never do this in production
    firstName,
    lastName,
    role,
    createdAt: new Date().toISOString(),
  };

  saveRegistered([...registered, user]);

  const { password: _, ...publicUser } = user;
  return publicUser;
}

// ─── Session helpers ──────────────────────────────────────────────────────────
export function saveSession(user) {
  localStorage.setItem('questra_user', JSON.stringify(user));
  // ProtectedRoute requires a token to be present alongside the user
  localStorage.setItem('questra_token', 'local_session_' + user.id);
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem('questra_user'));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('questra_user');
  localStorage.removeItem('questra_token');
}
