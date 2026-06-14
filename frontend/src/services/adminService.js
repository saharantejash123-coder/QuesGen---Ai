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
