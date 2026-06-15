const express = require('express');
const router = express.Router();
const { getClient } = require('../services/supabaseClient');
const db = require('../db/database');
const { authMiddleware, roleMiddleware } = require('../middleware');
const { successResponse, errorResponse, asyncHandler } = require('../errors');

// ── Admin-secret middleware (no JWT needed) ────────────────────────────────────
// Routes defined BEFORE router.use(authMiddleware) use this instead.
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'questra_admin_2026';

function requireSecret(req, res, next) {
  const secret = req.headers['x-admin-secret'] || req.query.adminSecret;
  if (secret === ADMIN_SECRET) return next();
  return res.status(403).json({ success: false, error: 'Invalid admin secret' });
}

// ── Shared helpers ─────────────────────────────────────────────────────────────
async function listSupabaseUsers() {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(error.message);

  // Load persisted plans/roles from SQLite
  const plans = {};
  const roles = {};
  await new Promise((resolve) => {
    db.all('SELECT user_id, plan FROM user_plans', [], (err, rows) => {
      if (!err) (rows || []).forEach(r => { plans[r.user_id] = r.plan; });
      resolve();
    });
  });
  await new Promise((resolve) => {
    db.all('SELECT user_id, role FROM user_roles', [], (err, rows) => {
      if (!err) (rows || []).forEach(r => { roles[r.user_id] = r.role; });
      resolve();
    });
  });

  return (data.users || []).map(u => ({
    id: u.id,
    email: u.email,
    name: [u.user_metadata?.firstName, u.user_metadata?.lastName].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'Unknown',
    firstName: u.user_metadata?.firstName || '',
    lastName: u.user_metadata?.lastName || '',
    role: roles[u.id] || (u.user_metadata?.role || 'student').toLowerCase(),
    plan: plans[u.id] || u.user_metadata?.plan || 'Free',
    status: u.banned_until && new Date(u.banned_until) > new Date() ? 'Banned' : 'Active',
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at,
    registrationMethod: u.user_metadata?.registrationMethod || 'email',
    schoolName: u.user_metadata?.schoolName || '',
    phone: u.user_metadata?.phone || '',
    subject: u.user_metadata?.subject || '',
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  OPEN ROUTES — admin-secret auth only (no JWT)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/admin/users  (works with X-Admin-Secret header)
router.get('/users', requireSecret, asyncHandler(async (req, res) => {
  try {
    const users = await listSupabaseUsers();
    if (users.length > 0) return successResponse(res, { users, total: users.length });
  } catch (e) { /* fall through to SQLite */ }

  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return errorResponse(res, 'Database error', 500);
    successResponse(res, { users: rows || [], total: (rows || []).length });
  });
}));

// GET /api/admin/stats
router.get('/stats', requireSecret, asyncHandler(async (req, res) => {
  const stats = { totalUsers: 0, students: 0, teachers: 0, schools: 0, admins: 0, totalQuestions: 0 };
  try {
    const users = await listSupabaseUsers();
    stats.totalUsers = users.length;
    users.forEach(u => {
      const r = u.role;
      if (r === 'student') stats.students++;
      else if (r === 'teacher') stats.teachers++;
      else if (r === 'school') stats.schools++;
      else if (r === 'admin') stats.admins++;
    });
  } catch { /* supabase unavailable */ }

  db.get('SELECT COUNT(*) as count FROM questions', [], (err, row) => {
    stats.totalQuestions = row?.count || 0;
    successResponse(res, stats);
  });
}));

// GET /api/admin/logs
router.get('/logs', requireSecret, (req, res) => {
  db.all('SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 200', [], (err, rows) => {
    if (err) return errorResponse(res, 'Database error', 500);
    successResponse(res, { logs: rows || [] });
  });
});

// POST /api/admin/logs
router.post('/logs', requireSecret, (req, res) => {
  const { action, actor, target, targetRole, detail, severity, ip, school } = req.body;
  db.run(
    'INSERT INTO admin_logs (action, actor, target, target_role, detail, severity, ip, school, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
    [action, actor || 'Admin', target || '', targetRole || '', detail || '', severity || 'info', ip || 'system', school || 'Platform', new Date().toISOString()],
    function (err) {
      if (err) return errorResponse(res, 'Database error', 500);
      successResponse(res, { id: this.lastID });
    }
  );
});

// PATCH /api/admin/users/:id/ban
router.patch('/users/:id/ban', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { banned, reason, email } = req.body;

  // Try Supabase first
  const supabase = getClient();
  if (supabase) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: banned ? '876000h' : 'none',
    });
    if (!error) {
      // Also persist to SQLite
      persistBanToSQLite(id, email || '', banned, reason || '');
      return successResponse(res, { success: true, source: 'supabase' });
    }
    // Fall through to SQLite
  }

  // SQLite fallback
  persistBanToSQLite(id, email || '', banned, reason || '');
  successResponse(res, { success: true, source: 'sqlite' });
}));

function persistBanToSQLite(userId, email, banned, reason) {
  if (banned) {
    db.run(
      'INSERT OR REPLACE INTO banned_users (user_id, email, reason, banned_at, status) VALUES (?, ?, ?, ?, ?)',
      [userId, email, reason || '', new Date().toISOString(), 'active']
    );
  } else {
    db.run('DELETE FROM banned_users WHERE user_id = ?', [userId]);
  }
}

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const supabase = getClient();
  if (!supabase) return errorResponse(res, 'Supabase not configured', 503);
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return errorResponse(res, error.message, 500);
  successResponse(res, { success: true });
}));

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Try Supabase first
  const supabase = getClient();
  if (supabase) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (!error) return successResponse(res, { success: true });
    // Fall through to SQLite
  }

  // SQLite fallback
  db.run(
    'INSERT OR REPLACE INTO user_roles (user_id, role, updated_at) VALUES (?, ?, ?)',
    [id, role.toLowerCase(), new Date().toISOString()],
    function (err) {
      if (err) return errorResponse(res, 'Database error', 500);
      successResponse(res, { success: true, source: 'sqlite' });
    }
  );
}));

// PATCH /api/admin/users/:id/plan
router.patch('/users/:id/plan', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  // Try Supabase first
  const supabase = getClient();
  if (supabase) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { plan },
    });
    if (!error) return successResponse(res, { success: true });
    // Fall through to SQLite
  }

  // SQLite fallback
  db.run(
    'INSERT OR REPLACE INTO user_plans (user_id, plan, updated_at) VALUES (?, ?, ?)',
    [id, plan, new Date().toISOString()],
    function (err) {
      if (err) return errorResponse(res, 'Database error', 500);
      successResponse(res, { success: true, source: 'sqlite' });
    }
  );
}));

// PATCH /api/admin/users/:id/profile
router.patch('/users/:id/profile', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const profile = req.body;

  // Try Supabase first – update user_metadata with profile fields
  const supabase = getClient();
  if (supabase) {
    const metaFields = {};
    if (profile.firstName !== undefined) metaFields.firstName = profile.firstName;
    if (profile.lastName !== undefined) metaFields.lastName = profile.lastName;
    if (profile.phone !== undefined) metaFields.phone = profile.phone;
    if (profile.schoolName !== undefined) metaFields.schoolName = profile.schoolName;
    if (profile.subject !== undefined) metaFields.subject = profile.subject;
    if (profile.displayName !== undefined) metaFields.displayName = profile.displayName;
    if (Object.keys(metaFields).length > 0) {
      const { error } = await supabase.auth.admin.updateUserById(id, { user_metadata: metaFields });
      if (!error) {
        // Also persist full profile to SQLite
        db.run(
          'INSERT OR REPLACE INTO user_profiles (user_id, data, updated_at) VALUES (?, ?, ?)',
          [id, JSON.stringify(profile), new Date().toISOString()],
          function (err) {
            if (err) return errorResponse(res, 'Database error', 500);
            successResponse(res, { success: true, source: 'supabase' });
          }
        );
        return;
      }
    }
  }

  // SQLite fallback
  db.run(
    'INSERT OR REPLACE INTO user_profiles (user_id, data, updated_at) VALUES (?, ?, ?)',
    [id, JSON.stringify(profile), new Date().toISOString()],
    function (err) {
      if (err) return errorResponse(res, 'Database error', 500);
      successResponse(res, { success: true, source: 'sqlite' });
    }
  );
}));

module.exports = router;
