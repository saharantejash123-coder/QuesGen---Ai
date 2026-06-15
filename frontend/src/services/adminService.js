const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? ''
const LOG_KEY     = 'questra_activity_log'

const BANS_KEY    = 'questra_bans'
const APPEALS_KEY = 'questra_appeals'
const ROLES_KEY   = 'questra_role_overrides'
const PLANS_KEY   = 'questra_plan_overrides'

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def } catch { return def } }
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// ── Bans ──────────────────────────────────────────────────────
export function getBans() { return load(BANS_KEY, []) }

export function banUser({ id, email, name }, reason, adminName = 'Super Admin') {
  const bans = getBans().filter(b => b.email !== email)
  bans.unshift({ id: 'BAN_' + Date.now(), userId: id, email, userName: name, reason, bannedAt: new Date().toISOString(), bannedBy: adminName, status: 'active' })
  save(BANS_KEY, bans)
}

export function unbanUser(email) {
  save(BANS_KEY, getBans().map(b => b.email === email && b.status === 'active' ? { ...b, status: 'lifted', liftedAt: new Date().toISOString() } : b))
}

export function getActiveBan(email) {
  return getBans().find(b => b.email === email && b.status === 'active') || null
}

// ── Appeals ───────────────────────────────────────────────────
export function getAppeals() { return load(APPEALS_KEY, []) }

export function submitAppeal(ban, appealText) {
  const existing = getAppeals().find(a => a.banId === ban.id && a.status === 'pending')
  if (existing) return { error: 'You already have a pending appeal.' }
  const appeals = getAppeals()
  appeals.unshift({ id: 'APL_' + Date.now(), banId: ban.id, userId: ban.userId, email: ban.email, userName: ban.userName, banReason: ban.reason, appealText, submittedAt: new Date().toISOString(), status: 'pending', adminNote: null, reviewedAt: null })
  save(APPEALS_KEY, appeals)
  return { success: true }
}

export function getAppealForBan(banId) {
  return getAppeals().find(a => a.banId === banId) || null
}

export function approveAppeal(appealId) {
  const appeals = getAppeals()
  const appeal = appeals.find(a => a.id === appealId)
  if (!appeal) return
  save(APPEALS_KEY, appeals.map(a => a.id === appealId ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() } : a))
  unbanUser(appeal.email)
}

export function rejectAppeal(appealId, adminNote) {
  save(APPEALS_KEY, getAppeals().map(a => a.id === appealId ? { ...a, status: 'rejected', adminNote, reviewedAt: new Date().toISOString() } : a))
}

// ── Roles ─────────────────────────────────────────────────────
export function getRoleOverrides() { return load(ROLES_KEY, {}) }
export function promoteUser(email, newRole) {
  const roles = getRoleOverrides()
  roles[email] = newRole.toLowerCase()
  save(ROLES_KEY, roles)
}
export function getUserRole(email, defaultRole) {
  return getRoleOverrides()[email] || defaultRole
}

// ── Plans ─────────────────────────────────────────────────────
export function getPlanOverrides() { return load(PLANS_KEY, {}) }
export function changeUserPlan(email, newPlan) {
  const plans = getPlanOverrides()
  plans[email] = newPlan
  save(PLANS_KEY, plans)
}
export function getUserPlan(email, defaultPlan) {
  return getPlanOverrides()[email] || defaultPlan
}

// ── Activity log ──────────────────────────────────────────────
export function getLogs() {
  return load(LOG_KEY, [])
}

export function logAction({ action, actor, target, targetRole = '', detail = '', severity = 'info', school = 'Platform' }) {
  const logs = getLogs()
  logs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    action,
    actor: actor || 'Admin',
    target: target || '',
    targetRole,
    detail,
    severity,
    ip: 'local',
    school,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString(),
  })
  save(LOG_KEY, logs.slice(0, 200))
}

export function logRegistration(user) {
  logAction({
    action: 'USER_REGISTERED',
    actor: 'System',
    target: user.email,
    targetRole: user.role || 'student',
    detail: `New ${user.role || 'student'} account registered`,
    severity: 'info',
  })
}

// ── Backend API helpers ────────────────────────────────────────
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'questra_admin_2026'

function secretHeaders() {
  return { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET }
}

function mapBackendUser(u) {
  const ban  = getActiveBan(u.email)
  const plan = getUserPlan(u.email, u.plan || 'Free')
  const role = getUserRole(u.email, u.role || 'student')
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.name || u.email?.split('@')[0] || 'Unknown'
  return {
    id: u.id, name, email: u.email,
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    type: role.charAt(0).toUpperCase() + role.slice(1),
    school: u.schoolName || '—', subject: u.subject || '—',
    phone: u.phone || '—', board: '—', class: '—',
    status: ban ? 'Banned' : (u.status || 'Active'),
    plan,
    joinDate: u.createdAt ? u.createdAt.slice(0, 10) : '—',
    lastActive: u.lastSignIn
      ? new Date(u.lastSignIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Never',
    registrationMethod: u.registrationMethod || 'email',
    banReason: ban?.reason || null,
    testsAttempted: 0, avgScore: 0, papersCreated: 0, studentsReached: 0, weakTopics: [],
  }
}

// Fetch all users — always tries backend first (using admin secret, no JWT needed)
export async function fetchAllUsers() {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: secretHeaders(),
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        const data = await res.json()
        const backendUsers = (data.data?.users || []).map(mapBackendUser)
        if (backendUsers.length > 0) {
          // Merge: also add any local-only users not in Supabase
          const backendEmails = new Set(backendUsers.map(u => u.email))
          const localOnly = getAllRealUsers().filter(u => !backendEmails.has(u.email))
          return [...backendUsers, ...localOnly]
        }
      }
    } catch { /* backend offline or not running */ }
  }
  return getAllRealUsers()
}

// Fetch platform stats
export async function fetchStats() {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: secretHeaders(),
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch { /* offline */ }
  }
  // Compute from localStorage
  const registered = load('questra_registered', [])
  return {
    totalUsers:     registered.length + 3,
    students:       registered.filter(u => (u.role || 'student') === 'student').length + 1,
    teachers:       registered.filter(u => u.role === 'teacher').length + 1,
    schools:        registered.filter(u => u.role === 'school').length,
    admins:         registered.filter(u => u.role === 'admin').length + 1,
    totalQuestions: 0,
  }
}

// Ban/unban via backend (also persists locally)
export async function apiBanUser(id, banned, reason = '', email = '') {
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}/ban`, {
        method: 'PATCH',
        headers: secretHeaders(),
        body: JSON.stringify({ banned, reason, email }),
      })
    } catch { /* ignore */ }
  }
}

// Delete via backend (also removes from localStorage)
export async function apiDeleteUser(id) {
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: secretHeaders(),
      })
    } catch { /* ignore */ }
  }
  const registered = load('questra_registered', [])
  save('questra_registered', registered.filter(u => u.id !== id))
}

// Promote role via backend
export async function apiPromoteUser(id, role) {
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: secretHeaders(),
        body: JSON.stringify({ role }),
      })
    } catch { /* ignore */ }
  }
}

// Change plan via backend
export async function apiChangeUserPlan(id, plan) {
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}/plan`, {
        method: 'PATCH',
        headers: secretHeaders(),
        body: JSON.stringify({ plan }),
      })
    } catch { /* ignore */ }
  }
}

// Update user profile via backend
export async function apiUpdateProfile(id, data) {
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}/profile`, {
        method: 'PATCH',
        headers: secretHeaders(),
        body: JSON.stringify(data),
      })
    } catch { /* ignore */ }
  }
}

// ── Real registered users ─────────────────────────────────────
export function getAllRealUsers() {
  const registered = load('questra_registered', [])
  const DEMO = [
    { id: 'student_demo', email: 'student@questra.com', firstName: 'Demo', lastName: 'Student', role: 'student' },
    { id: 'teacher_demo', email: 'teacher@questra.com', firstName: 'Demo', lastName: 'Teacher', role: 'teacher' },
    { id: 'admin_demo',   email: 'admin@questra.com',   firstName: 'Demo', lastName: 'Admin',   role: 'admin'   },
  ]
  return [...registered, ...DEMO].map(u => {
    const ban  = getActiveBan(u.email)
    const role = getUserRole(u.email, u.role || 'student')
    const plan = getUserPlan(u.email, 'Free')
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email.split('@')[0]
    return {
      id:           u.id,
      name,
      email:        u.email,
      avatar:       name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      type:         role.charAt(0).toUpperCase() + role.slice(1),
      school:       u.schoolName || '—',
      subject:      u.subject || '—',
      class:        u.class || '—',
      board:        '—',
      status:       ban ? 'Banned' : 'Active',
      plan,
      joinDate:     u.createdAt?.slice(0, 10) || 'N/A',
      lastActive:   'Recent',
      testsAttempted: 0,
      avgScore:     0,
      papersCreated: 0,
      studentsReached: 0,
      weakTopics:   [],
      phone:        u.phone || '—',
      banReason:    ban?.reason || null,
      isRealUser:   true,
    }
  })
}
