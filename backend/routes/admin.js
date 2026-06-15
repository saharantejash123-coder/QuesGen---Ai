const express = require('express');
const router = express.Router();
const { getClient } = require('../services/supabaseClient');
const db = require('../db/database');
const { authMiddleware, roleMiddleware } = require('../middleware');
const { successResponse, errorResponse, asyncHandler } = require('../errors');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(id) { return UUID_RE.test(id); }

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

  // Load persisted plans/roles/bans from SQLite + Supabase table
  const plans = {};
  const roles = {};
  const bannedEmails = new Set();
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
  // Load SQLite bans
  await new Promise((resolve) => {
    db.all('SELECT email FROM banned_users WHERE status = ?', ['active'], (err, rows) => {
      if (!err) (rows || []).forEach(r => { if (r.email) bannedEmails.add(r.email.toLowerCase()); });
      resolve();
    });
  });
  // Load Supabase table bans
  try {
    const { data: sbBans } = await supabase.from('banned_users').select('email').eq('status', 'active');
    if (sbBans) sbBans.forEach(r => { if (r.email) bannedEmails.add(r.email.toLowerCase()); });
  } catch { /* table may not exist */ }

  return (data.users || []).map(u => ({
    id: u.id,
    email: u.email,
    name: [u.user_metadata?.firstName, u.user_metadata?.lastName].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'Unknown',
    firstName: u.user_metadata?.firstName || '',
    lastName: u.user_metadata?.lastName || '',
    role: roles[u.id] || (u.user_metadata?.role || 'student').toLowerCase(),
    plan: plans[u.id] || u.user_metadata?.plan || 'Free',
    status: (u.banned_until && new Date(u.banned_until) > new Date()) || bannedEmails.has((u.email || '').toLowerCase()) ? 'Banned' : 'Active',
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
  const lcEmail = (email || '').toLowerCase().trim();

  const supabase = getClient();

  // 1. Try Supabase Auth ban (UUID users only)
  if (supabase && isUUID(id) && banned) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: '876000h',
    }).catch(() => ({}));
    if (!error) { /* auth ban set */ }
  }
  if (supabase && isUUID(id) && !banned) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: 'none',
    }).catch(() => ({}));
    if (!error) { /* auth ban removed */ }
  }

  // 2. Store in Supabase Data API banned_users table (by email — works for ALL users)
  let supabaseOk = false;
  if (supabase) {
    try {
      if (banned) {
        const { error } = await supabase
          .from('banned_users')
          .upsert({ email: lcEmail, reason: reason || '', banned_at: new Date().toISOString(), status: 'active' }, { onConflict: 'email' });
        if (!error) supabaseOk = true;
      } else {
        const { error } = await supabase
          .from('banned_users')
          .delete()
          .eq('email', lcEmail);
        if (!error) supabaseOk = true;
      }
    } catch { /* Supabase banned_users table may not exist — fall through */ }
  }

  // 3. Always persist to SQLite as fallback
  persistBanToSQLite(id, lcEmail, banned, reason);

  return successResponse(res, { success: true, source: supabaseOk ? 'supabase' : 'sqlite' });
}));

function persistBanToSQLite(userId, email, banned, reason) {
  if (banned) {
    db.run(
      'INSERT OR REPLACE INTO banned_users (user_id, email, reason, banned_at, status) VALUES (?, ?, ?, ?, ?)',
      [userId, email, reason || '', new Date().toISOString(), 'active']
    );
  } else {
    if (userId) db.run('DELETE FROM banned_users WHERE user_id = ?', [userId]);
    if (email)  db.run('DELETE FROM banned_users WHERE email = ?', [email]);
  }
}

// POST /api/admin/unban — email-based unban (works for ALL users regardless of ID)
router.post('/unban', requireSecret, asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return errorResponse(res, 'Email required', 400);
  const lcEmail = email.toLowerCase().trim();

  // 1. Clear SQLite by email
  db.run('DELETE FROM banned_users WHERE email = ?', [lcEmail]);

  // 2. Clear Supabase banned_users table by email
  const supabase = getClient();
  if (supabase) {
    try { await supabase.from('banned_users').delete().eq('email', lcEmail); } catch { /* table may not exist */ }
  }

  // 3. Find user in Supabase Auth and lift ban_duration
  if (supabase) {
    try {
      const { data } = await supabase.auth.admin.listUsers();
      if (data?.users) {
        const u = data.users.find(x => x.email?.toLowerCase() === lcEmail);
        if (u && u.banned_until && new Date(u.banned_until) > new Date()) {
          await supabase.auth.admin.updateUserById(u.id, { ban_duration: 'none' }).catch(() => {});
        }
      }
    } catch { /* ignore */ }
  }

  successResponse(res, { success: true, message: `Ban lifted for ${lcEmail}` });
}));

// POST /api/admin/unban-all — clear every ban from every storage layer
router.post('/unban-all', requireSecret, asyncHandler(async (req, res) => {
  // 1. Clear SQLite banned_users
  db.run('DELETE FROM banned_users', []);

  // 2. Clear Supabase banned_users table
  const supabase = getClient();
  if (supabase) {
    try { await supabase.from('banned_users').delete().neq('id', 0); } catch { /* table may not exist */ }
  }

  // 3. Also list all Supabase Auth users and lift their ban_duration
  if (supabase) {
    try {
      const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (data?.users) {
        for (const u of data.users) {
          if (u.banned_until && new Date(u.banned_until) > new Date()) {
            await supabase.auth.admin.updateUserById(u.id, { ban_duration: 'none' }).catch(() => {});
          }
        }
      }
    } catch { /* ignore */ }
  }

  successResponse(res, { success: true, message: 'All bans lifted from all storage layers' });
}));

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const supabase = getClient();
  if (!supabase) return errorResponse(res, 'Supabase not configured', 503);
  if (!isUUID(id)) return errorResponse(res, 'Cannot delete demo/local users from Supabase', 400);
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return errorResponse(res, error.message, 500);
  successResponse(res, { success: true });
}));

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', requireSecret, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Try Supabase first (only for UUIDs)
  const supabase = getClient();
  if (supabase && isUUID(id)) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (!error) return successResponse(res, { success: true });
    // Fall through to SQLite
  }

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

  // Try Supabase first (only for UUIDs)
  const supabase = getClient();
  if (supabase && isUUID(id)) {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { plan },
    });
    if (!error) return successResponse(res, { success: true });
    // Fall through to SQLite
  }

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

  // Try Supabase first – update user_metadata with profile fields (only for UUIDs)
  const supabase = getClient();
  if (supabase && isUUID(id)) {
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
