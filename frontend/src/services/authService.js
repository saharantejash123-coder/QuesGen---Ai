const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

// ─── Demo accounts — always available, no server needed ───────────────────────
const DEMO_USERS = [
  { id: 'student_demo', email: 'student@questra.com', password: 'demo_password_123', role: 'student', firstName: 'Demo', lastName: 'Student' },
  { id: 'teacher_demo', email: 'teacher@questra.com', password: 'teacher123',        role: 'teacher', firstName: 'Demo', lastName: 'Teacher' },
  { id: 'admin_demo',   email: 'admin@questra.com',   password: 'admin123',          role: 'admin',   firstName: 'Demo', lastName: 'Admin'   },
  { id: 'school_demo',  email: 'school@questra.com',  password: 'school123',         role: 'school',  firstName: 'Demo', lastName: 'School'  },
];

// ─── Local registered accounts (localStorage) ─────────────────────────────────
function getRegistered() {
  try { return JSON.parse(localStorage.getItem('questra_registered') || '[]'); }
  catch { return []; }
}
function saveRegistered(users) {
  localStorage.setItem('questra_registered', JSON.stringify(users));
}

// ─── OTP helpers ──────────────────────────────────────────────────────────────
// Returns { sent: bool, demoOtp: string|null }
// sent=true  → real email was dispatched, demoOtp is null
// sent=false → SMTP not configured, demoOtp holds the code to display
export async function sendOTP(email) {
  const backend = BACKEND_URL;
  try {
    const res = await fetch(`${backend}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.data?.sent) return { sent: true, demoOtp: null };
      // Backend running but SMTP unconfigured — use returned demo OTP
      return { sent: false, demoOtp: data.data?.demoOtp || null };
    }
    throw new Error(data.error || 'Failed to send OTP');
  } catch (err) {
    // Backend unreachable (wrong URL, offline, CORS, timeout) — fall back to local demo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('questra_pending_otp', JSON.stringify({
      email: email.trim().toLowerCase(), otp, expires: Date.now() + 10 * 60 * 1000,
    }));
    return { sent: false, demoOtp: otp };
  }
}

export async function verifyOTP(email, enteredOtp) {
  const backend = BACKEND_URL;

  // Try backend verification first
  try {
    const res = await fetch(`${backend}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: enteredOtp.trim() }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (res.ok && data.data?.verified) return true;
    if (!res.ok) throw new Error(data.error || 'Incorrect OTP. Please try again.');
  } catch (err) {
    if (!err.message.includes('fetch') && err.name !== 'TimeoutError') throw err;
    // Backend offline — fall back to localStorage OTP
  }

  // Offline fallback: check localStorage OTP
  const raw = localStorage.getItem('questra_pending_otp');
  if (!raw) throw new Error('No OTP found. Please request a new one.');
  const record = JSON.parse(raw);
  if (record.email !== email.trim().toLowerCase()) throw new Error('OTP mismatch. Please request a new one.');
  if (Date.now() > record.expires) {
    localStorage.removeItem('questra_pending_otp');
    throw new Error('OTP has expired. Please request a new one.');
  }
  if (record.otp !== enteredOtp.trim()) throw new Error('Incorrect OTP. Please try again.');
  localStorage.removeItem('questra_pending_otp');
  return true;
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email, password) {
  await new Promise((r) => setTimeout(r, 700));

  const lEmail = email.trim().toLowerCase();

  // 1. Demo accounts
  const demo = DEMO_USERS.find((u) => u.email === lEmail);
  if (demo) {
    if (demo.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...user } = demo;
    return user;
  }

  // 2. Locally registered accounts
  const registered = getRegistered();
  const found = registered.find((u) => u.email === lEmail);
  if (found) {
    if (found.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...user } = found;
    return user;
  }

  // 3. Try the real backend (may not be running)
  try {
    const backend = BACKEND_URL;
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
    if (res.status === 401) throw new Error('Incorrect password.');
    if (res.status === 404) throw new Error('No account found with this email. Please register first.');
  } catch (err) {
    if (err.message.includes('Incorrect') || err.message.includes('No account')) throw err;
    // Backend offline — fall through to "not found"
  }

  // 4. Not found anywhere — reject
  throw new Error('No account found with this email. Please register first.');
}

// ─── Google Login with JWT Token ──────────────────────────────────────────────
export async function loginWithGoogleToken(googleToken) {
  await new Promise((r) => setTimeout(r, 700));
  if (!googleToken) throw new Error('Google token is required');

  try {
    const backend = BACKEND_URL;
    const res = await fetch(`${backend}/api/auth/google-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: googleToken }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      const userData = data.data || data.user || data;
      if (userData.user || userData.email) {
        const user = userData.user || userData;
        return { ...user, role: (user.role || 'student').toLowerCase(), loginMethod: 'google' };
      }
    }
  } catch (err) {
    console.warn('Backend Google verify failed, using local decode:', err);
  }

  // Fallback: decode JWT locally
  const decoded = decodeJWT(googleToken);
  if (decoded && decoded.email) {
    const registered = getRegistered();
    const found = registered.find((u) => u.email === decoded.email.toLowerCase());
    if (found) {
      const { password: _, ...user } = found;
      return { ...user, loginMethod: 'google' };
    }
    // Google sign-ins create an account automatically (Google already verified identity)
    return {
      id: 'google_' + Date.now(),
      email: decoded.email.toLowerCase(),
      firstName: decoded.given_name || decoded.email.split('@')[0],
      lastName: decoded.family_name || '',
      role: 'student',
      loginMethod: 'google',
    };
  }

  throw new Error('Unable to authenticate with Google. Please try again.');
}

// ─── JWT Decoder ──────────────────────────────────────────────────────────────
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

// ─── Register (saves locally + tries backend) ─────────────────────────────────
export async function register({ email, password, firstName, lastName, role = 'student', schoolName, phone, subject, registrationNumber }) {
  await new Promise((r) => setTimeout(r, 700));

  const lEmail = email.trim().toLowerCase();

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
    password,
    firstName,
    lastName: lastName || '',
    role,
    schoolName: schoolName || '',
    phone: phone || '',
    subject: subject || '',
    registrationNumber: registrationNumber || '',
    createdAt: new Date().toISOString(),
  };

  // Save locally first so login always works
  saveRegistered([...registered, user]);

  // Also try the backend (non-blocking)
  try {
    const backend = BACKEND_URL;
    await fetch(`${backend}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: lEmail, password, role, firstName, lastName }),
      signal: AbortSignal.timeout(3000),
    });
  } catch { /* backend offline — local save is enough */ }

  const { password: _, ...publicUser } = user;
  return publicUser;
}

// ─── Session helpers ──────────────────────────────────────────────────────────
export function saveSession(user) {
  localStorage.setItem('questra_user', JSON.stringify(user));
  localStorage.setItem('questra_token', 'local_session_' + user.id);
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem('questra_user')); }
  catch { return null; }
}

export function clearSession() {
  localStorage.removeItem('questra_user');
  localStorage.removeItem('questra_token');
}
