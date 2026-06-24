const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';
import { logRegistration } from './adminService';
import { generateUID } from './schoolService';

// ─── Demo accounts — always available, no server needed ───────────────────────
const DEMO_USERS = [
  { id: 'student_demo', email: 'student@questra.com', password: 'demo_password_123', role: 'student', firstName: 'Demo', lastName: 'Student' },
  { id: 'teacher_demo', email: 'teacher@questra.com', password: 'teacher123',        role: 'teacher', firstName: 'Demo', lastName: 'Teacher' },
  { id: 'admin_demo',   email: 'admin@questra.com',   password: 'admin123',          role: 'admin',   firstName: 'Demo', lastName: 'Admin'   },
  { id: 'school_demo',  email: 'school@questra.com',  password: 'school123',         role: 'school',  firstName: 'Demo', lastName: 'School'  },
];

// ─── Per-UID account store ────────────────────────────────────────────────────
// Every account's full record is also stored individually under its UID, so an
// account can be looked up / persisted on its own (`questra_account_<uid>`),
// alongside the `questra_registered` index used elsewhere in the app.
const ACCOUNT_PREFIX = 'questra_account_';

function saveAccountByUid(user) {
  if (!user || !user.uid) return;
  try { localStorage.setItem(ACCOUNT_PREFIX + user.uid, JSON.stringify(user)); }
  catch { /* storage full / unavailable — index still holds the record */ }
}

export function getAccountByUid(uid) {
  if (!uid) return null;
  try { return JSON.parse(localStorage.getItem(ACCOUNT_PREFIX + uid)); }
  catch { return null; }
}

// ─── Local registered accounts (localStorage) ─────────────────────────────────
function getRegistered() {
  try { return JSON.parse(localStorage.getItem('questra_registered') || '[]'); }
  catch { return []; }
}
// Writing the index also mirrors each record into its own per-UID slot so the
// two stores never drift apart.
function saveRegistered(users) {
  localStorage.setItem('questra_registered', JSON.stringify(users));
  users.forEach(saveAccountByUid);
}

// One-time reconciliation: give every legacy account a UID and mirror it into
// the per-UID store. Idempotent — accounts that already have a UID are untouched.
function migrateAccountsToUidStore() {
  try {
    const registered = getRegistered();
    if (registered.length === 0) return;
    let changed = false;
    const updated = registered.map((u) => {
      if (u.uid) { saveAccountByUid(u); return u; }
      changed = true;
      const withUid = { ...u, uid: generateUID() };
      saveAccountByUid(withUid);
      return withUid;
    });
    if (changed) localStorage.setItem('questra_registered', JSON.stringify(updated));
  } catch { /* best-effort */ }
}

// ─── OTP helpers ──────────────────────────────────────────────────────────────
// Dispatches a real OTP email via the backend. Throws if the email could not be
// sent — there is no demo-code fallback, the code only ever arrives by email.
export async function sendOTP(email) {
  const backend = BACKEND_URL;
  let res;
  try {
    res = await fetch(`${backend}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      signal: AbortSignal.timeout(30000), // 30s — Render cold starts can take ~20s
    });
  } catch {
    throw new Error('Could not reach the email server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.data?.sent) {
    throw new Error(data.error || data.message || 'Could not send the OTP email. Please try again.');
  }
  return { sent: true };
}

export async function verifyOTP(email, enteredOtp) {
  const backend = BACKEND_URL;
  const res = await fetch(`${backend}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), otp: enteredOtp.trim() }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await res.json();
  if (res.ok && data.data?.verified) return true;
  throw new Error(data.error || 'Incorrect OTP. Please try again.');
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email, password) {
  await new Promise((r) => setTimeout(r, 700));

  const lEmail = email.trim().toLowerCase();

  // 0. Check ban from backend (cross-device sync)
  if (BACKEND_URL) {
    try {
      const bc = await fetch(`${BACKEND_URL}/api/auth/ban-check?email=${encodeURIComponent(lEmail)}`, { signal: AbortSignal.timeout(2000) });
      if (bc.ok) {
        const bd = await bc.json();
        const backendBan = (bd.data || bd);
        if (backendBan?.banned) {
          persistBanLocal(lEmail, backendBan);
          return { email: lEmail, role: 'student', firstName: lEmail.split('@')[0], lastName: '', _banned: true, _banReason: backendBan.reason || '' };
        }
      }
    } catch { /* backend unreachable — fall through */ }
  }

  // 1. Demo accounts
  const demo = DEMO_USERS.find((u) => u.email === lEmail);
  if (demo) {
    if (demo.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...demoBase } = demo;
    // Pick up any enrichment saved by initializeDemoAccounts (uid, schoolName, etc.)
    const registered = getRegistered();
    const enriched = registered.find(u => u.email === lEmail);
    const user = enriched ? { ...demoBase, ...(({ password: __, ...rest }) => rest)(enriched) } : demoBase;
    const localBan = getLocalBan(lEmail);
    if (localBan) return { ...user, _banned: true, _banReason: localBan.reason || '' };
    return user;
  }

  // 2. Locally registered accounts
  const registered = getRegistered();
  const found = registered.find((u) => u.email === lEmail);
  if (found) {
    if (found.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...user } = found;
    const localBan = getLocalBan(lEmail);
    if (localBan) return { ...user, _banned: true, _banReason: localBan.reason || '' };
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
      if (data.user) {
        const user = { ...data.user, role: (data.user.role || 'student').toLowerCase() };
        // Also check local ban as safety net
        const localBan = getLocalBan(lEmail);
        if (localBan) return { ...user, _banned: true, _banReason: localBan.reason || '' };
        return user;
      }
    }
    if (res.status === 401) throw new Error('Incorrect password.');
    if (res.status === 403) {
      const banData = await res.json();
      if (banData.banned) {
        persistBanLocal(lEmail, banData);
        return { email: lEmail, role: 'student', firstName: lEmail.split('@')[0], lastName: '', _banned: true, _banReason: banData.reason || '' };
      }
      throw new Error('Access denied.');
    }
    if (res.status === 404) throw new Error('No account found with this email. Please register first.');
  } catch (err) {
    if (err.message.includes('Incorrect') || err.message.includes('No account')) throw err;
    // Backend offline — fall through to "not found"
  }

  // 4. Not found anywhere — reject
  throw new Error('No account found with this email. Please register first.');
}

function getLocalBan(email) {
  try {
    const bans = JSON.parse(localStorage.getItem('questra_bans') || '[]');
    return bans.find(b => b.email === email && b.status === 'active') || null;
  } catch { return null; }
}

function persistBanLocal(email, banResult) {
  try {
    const bans = JSON.parse(localStorage.getItem('questra_bans') || '[]');
    bans.unshift({
      id: 'BAN_BE_' + Date.now(),
      userId: banResult.userId || email,
      email,
      userName: email.split('@')[0],
      reason: banResult.reason || '',
      bannedAt: banResult.bannedAt || new Date().toISOString(),
      bannedBy: 'System',
      status: 'active',
    });
    localStorage.setItem('questra_bans', JSON.stringify(bans));
  } catch { /* ignore */ }
}

// ─── Google Login with JWT Token ──────────────────────────────────────────────
// Google is a LOGIN method only — it never creates accounts. The email must
// already exist in the local register (created via the registration form) or be
// a demo account. Unknown Google emails are rejected and told to register first.
export async function loginWithGoogleToken(googleToken) {
  await new Promise((r) => setTimeout(r, 500));
  if (!googleToken) throw new Error('Google token is required');

  const decoded = decodeJWT(googleToken);
  const email = (decoded?.email || '').toLowerCase();
  if (!email) throw new Error('Could not read your Google account email. Please try again.');

  // Banned emails are blocked regardless of how they sign in
  const localBan = getLocalBan(email);

  // Gate: only emails registered through the form (or demo accounts) may sign in
  const registered = getRegistered();
  const found = registered.find((u) => u.email === email);
  const demo = DEMO_USERS.find((u) => u.email === email);

  if (!found && !demo) {
    throw new Error('No QuesGen account is registered with this Google email. Please create an account first.');
  }

  const source = found || demo;
  const { password: _omit, ...base } = source;
  const user = ensureUID({ ...base, role: (base.role || 'student').toLowerCase(), loginMethod: 'google' });

  if (localBan) return { ...user, _banned: true, _banReason: localBan.reason || '' };
  return user;
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
export async function register({ email, password, firstName, lastName, role = 'student', schoolName, phone, subject, registrationNumber, className }) {
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
    uid: generateUID(),
    email: lEmail,
    password,
    firstName,
    lastName: lastName || '',
    role,
    schoolName: schoolName || '',
    phone: phone || '',
    subject: subject || '',
    registrationNumber: registrationNumber || '',
    className: className || '',
    createdAt: new Date().toISOString(),
  };

  // Save locally first so login always works
  saveRegistered([...registered, user]);
  logRegistration(user);

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

// ─── UID backfill ─────────────────────────────────────────────────────────────
// Guarantees every session has a stable 10-digit UID. Older accounts (created
// before the UID feature) and demo / Google logins arrive without one, so we
// generate it here and persist it to questra_registered so it stays put and
// schools can look the user up by UID.
export function ensureUID(user) {
  if (!user || user.uid) return user;
  const uid = generateUID();
  try {
    const registered = getRegistered();
    const email = (user.email || '').toLowerCase();
    const idx = registered.findIndex((u) => (u.email || '').toLowerCase() === email);
    if (idx >= 0) {
      registered[idx] = { ...registered[idx], uid };
      saveRegistered(registered);
    } else if (email) {
      // Demo / Google account not in the registered list yet — add a light record
      registered.push({
        id: user.id || 'user_' + Date.now(), email, uid,
        role: user.role || 'student', firstName: user.firstName || '', lastName: user.lastName || '',
      });
      saveRegistered(registered);
    }
  } catch { /* ignore — still return the uid below */ }
  return { ...user, uid };
}

// ─── Session helpers ──────────────────────────────────────────────────────────
export function saveSession(user) {
  const u = ensureUID(user);
  localStorage.setItem('questra_user', JSON.stringify(u));
  localStorage.setItem('questra_token', 'local_session_' + u.id);
}

export function getSession() {
  try {
    const u = JSON.parse(localStorage.getItem('questra_user'));
    if (u && !u.uid) {
      const fixed = ensureUID(u);
      localStorage.setItem('questra_user', JSON.stringify(fixed));
      return fixed;
    }
    return u;
  } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem('questra_user');
  localStorage.removeItem('questra_token');
}

// ─── Forgot / reset password ──────────────────────────────────────────────────
// 'demo' | true | false
export function accountExists(email) {
  const lEmail = (email || '').trim().toLowerCase();
  if (!lEmail) return false;
  if (DEMO_USERS.some((u) => u.email === lEmail)) return 'demo';
  return getRegistered().some((u) => u.email === lEmail);
}

/**
 * Step 1 of reset: confirm the account exists and email a real OTP.
 * Throws if the account is unknown or the email could not be sent — no demo code.
 */
export async function requestPasswordResetOTP(email) {
  const lEmail = (email || '').trim().toLowerCase();
  const exists = accountExists(lEmail);
  if (exists === 'demo') throw new Error('Demo accounts use a fixed password and cannot be reset.');
  if (!exists) throw new Error('No account found with this email. Please check the address or register.');

  await sendOTP(lEmail); // sends a real email or throws
  return { sent: true };
}

/** Step 2 of reset: verify the emailed OTP (backend) and set the new password. */
export async function confirmPasswordResetOTP(email, enteredOtp, newPassword) {
  const lEmail = (email || '').trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) throw new Error('Password must be at least 6 characters.');

  await verifyOTP(lEmail, enteredOtp); // throws on mismatch / expiry
  await resetPassword(lEmail, newPassword);
  return true;
}

/** Persist a new password for an account (index + per-UID store + best-effort backend). */
export async function resetPassword(email, newPassword) {
  await new Promise((r) => setTimeout(r, 300));
  const lEmail = (email || '').trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) throw new Error('Password must be at least 6 characters.');
  if (DEMO_USERS.some((u) => u.email === lEmail)) throw new Error('Demo accounts use a fixed password and cannot be reset.');

  const registered = getRegistered();
  const idx = registered.findIndex((u) => u.email === lEmail);
  if (idx < 0) throw new Error('No account found with this email.');

  registered[idx] = { ...registered[idx], password: newPassword };
  saveRegistered(registered); // also mirrors into the per-UID store

  try {
    if (BACKEND_URL) {
      await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lEmail, password: newPassword }),
        signal: AbortSignal.timeout(3000),
      });
    }
  } catch { /* backend offline — local update is the source of truth */ }

  return true;
}

// Reconcile legacy accounts into the per-UID store on load.
migrateAccountsToUidStore();
