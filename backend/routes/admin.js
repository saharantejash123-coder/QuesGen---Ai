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
  return (data.users || []).map(u => ({
    id: u.id,
    email: u.email,
    name: [u.user_metadata?.firstName, u.user_metadata?.lastName].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'Unknown',
    firstName: u.user_metadata?.firstName || '',
    lastName: u.user_metadata?.lastName || '',
    role: (u.user_metadata?.role || 'student').toLowerCase(),
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
  const { banned } = req.body;
  const supabase = getClient();
  if (!supabase) return errorResponse(res, 'Supabase not configured', 503);
  const { error } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: banned ? '876000h' : 'none',
  });
  if (error) return errorResponse(res, error.message, 500);
  successResponse(res, { success: true });
}));

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
  const supabase = getClient();
  if (!supabase) return errorResponse(res, 'Supabase not configured', 503);
  const { error } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { role },
  });
  if (error) return errorResponse(res, error.message, 500);
  successResponse(res, { success: true });
}));

module.exports = router;
