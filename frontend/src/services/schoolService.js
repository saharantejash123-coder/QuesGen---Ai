// School data service — localStorage-based storage for classes, assignments, and papers

const KEYS = {
  CLASSES: 'questra_school_classes',
  TEACHER_ASSIGNMENTS: 'questra_teacher_assignments',
  PAPERS: 'questra_papers',
  REGISTERED: 'questra_registered',
};

function get(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

function set(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const norm = (s) => (s || '').toLowerCase().trim();

// ── Registered Users ──────────────────────────────────────────────────────────

export function getRegisteredStudents() {
  return get(KEYS.REGISTERED).filter(u => u.role === 'student');
}

export function getRegisteredTeachers() {
  return get(KEYS.REGISTERED).filter(u => u.role === 'teacher');
}

export function getStudentsBySchool(schoolName, className = null) {
  return getRegisteredStudents().filter(u => {
    if (schoolName && norm(u.schoolName) !== norm(schoolName)) return false;
    if (className && u.className !== className) return false;
    return true;
  });
}

export function getTeachersBySchool(schoolName) {
  return getRegisteredTeachers().filter(u => norm(u.schoolName) === norm(schoolName));
}

// Returns school name from a school-role user object
export function resolveSchoolName(user) {
  if (!user) return '';
  if (user.role === 'school') {
    if (user.schoolName) return user.schoolName;
    // Combine first+last for school role (e.g. firstName:'Demo', lastName:'School' → 'Demo School')
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.name || '';
  }
  return user.schoolName || '';
}

// ── School-Defined Classes ────────────────────────────────────────────────────

export function getSchoolClasses(schoolName) {
  return get(KEYS.CLASSES).filter(c => norm(c.schoolName) === norm(schoolName));
}

export function addSchoolClass(cls) {
  const all = get(KEYS.CLASSES);
  const id = cls.id || 'cls_' + Date.now();
  const rec = { ...cls, id };
  if (!all.find(c => c.id === id)) all.push(rec);
  set(KEYS.CLASSES, all);
  return id;
}

export function updateSchoolClass(classId, updates) {
  const all = get(KEYS.CLASSES);
  const idx = all.findIndex(c => c.id === classId);
  if (idx >= 0) all[idx] = { ...all[idx], ...updates };
  set(KEYS.CLASSES, all);
}

export function deleteSchoolClass(classId) {
  set(KEYS.CLASSES, get(KEYS.CLASSES).filter(c => c.id !== classId));
}

// ── Teacher-Class Assignments ─────────────────────────────────────────────────

export function getTeacherAssignments(schoolName) {
  return get(KEYS.TEACHER_ASSIGNMENTS).filter(a => norm(a.schoolName) === norm(schoolName));
}

export function getTeacherClassAssignment(teacherEmail) {
  return get(KEYS.TEACHER_ASSIGNMENTS).find(
    a => norm(a.teacherEmail) === norm(teacherEmail)
  ) || null;
}

export function assignTeacherToClasses(teacherEmail, schoolName, classNames) {
  const all = get(KEYS.TEACHER_ASSIGNMENTS);
  const idx = all.findIndex(a => norm(a.teacherEmail) === norm(teacherEmail));
  const rec = {
    teacherEmail: norm(teacherEmail),
    schoolName,
    classNames: Array.isArray(classNames) ? classNames : [],
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) all[idx] = rec; else all.push(rec);
  set(KEYS.TEACHER_ASSIGNMENTS, all);
}

export function removeTeacherAssignment(teacherEmail) {
  set(
    KEYS.TEACHER_ASSIGNMENTS,
    get(KEYS.TEACHER_ASSIGNMENTS).filter(a => norm(a.teacherEmail) !== norm(teacherEmail))
  );
}

// ── Papers ────────────────────────────────────────────────────────────────────

export function savePaper(paper) {
  const all = get(KEYS.PAPERS);
  const idx = all.findIndex(p => p.id === paper.id);
  const rec = { ...paper, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = rec; else all.unshift(rec);
  set(KEYS.PAPERS, all);
}

export function deletePaper(paperId) {
  set(KEYS.PAPERS, get(KEYS.PAPERS).filter(p => p.id !== paperId));
}

export function getPapersByTeacher(teacherEmail) {
  return get(KEYS.PAPERS).filter(p => norm(p.teacherEmail) === norm(teacherEmail));
}

export function getPapersByClass(className, schoolName) {
  return get(KEYS.PAPERS).filter(
    p =>
      p.assignedClasses?.includes(className) &&
      (!schoolName || norm(p.schoolName) === norm(schoolName))
  );
}

export function getPapersForStudent(studentClassName, studentSchoolName) {
  return get(KEYS.PAPERS).filter(p => {
    if (p.status !== 'assigned') return false;
    if (studentSchoolName && norm(p.schoolName) !== norm(studentSchoolName)) return false;
    // If student has a class, only show papers assigned to that class
    // If no class is set, show all assigned papers for the school
    if (studentClassName && !p.assignedClasses?.includes(studentClassName)) return false;
    return true;
  });
}

export function getPapersBySchool(schoolName) {
  return get(KEYS.PAPERS).filter(p => norm(p.schoolName) === norm(schoolName));
}

export function getAllPapers() {
  return get(KEYS.PAPERS);
}

// ── UIDs ──────────────────────────────────────────────────────────────────────

const UID_POOL_KEY = 'questra_uid_pool';

export function generateUID() {
  try {
    const used = new Set(JSON.parse(localStorage.getItem(UID_POOL_KEY) || '[]'));
    let uid;
    do { uid = String(Math.floor(1000000000 + Math.random() * 9000000000)); }
    while (used.has(uid));
    used.add(uid);
    localStorage.setItem(UID_POOL_KEY, JSON.stringify([...used]));
    return uid;
  } catch {
    return String(Math.floor(1000000000 + Math.random() * 9000000000));
  }
}

export function getUserByUID(uid) {
  return get(KEYS.REGISTERED).find(u => u.uid === uid) || null;
}

export function searchAllUsers(query, role = null) {
  if (!query || query.trim().length < 2) return [];
  const q = norm(query);
  return get(KEYS.REGISTERED).filter(u => {
    if (role && u.role !== role) return false;
    const name = norm([u.firstName, u.lastName].filter(Boolean).join(' '));
    return name.includes(q) || (u.uid || '').includes(q) || norm(u.email || '').includes(q);
  });
}

// ── School Codes ──────────────────────────────────────────────────────────────

const CODES_KEY = 'questra_school_codes';

function getCodesMap() {
  try { return JSON.parse(localStorage.getItem(CODES_KEY) || '{}'); } catch { return {}; }
}

export function getOrCreateSchoolCode(schoolName) {
  const map = getCodesMap();
  const key = norm(schoolName);
  if (map[key]) return map[key];
  const code = (Math.random().toString(36).slice(2, 5) + Math.random().toString(36).slice(2, 5)).toUpperCase().slice(0, 6);
  map[key] = code;
  try { localStorage.setItem(CODES_KEY, JSON.stringify(map)); } catch {}
  return code;
}

export function validateSchoolCode(code) {
  if (!code) return null;
  const map = getCodesMap();
  const upper = code.trim().toUpperCase();
  const entry = Object.entries(map).find(([, v]) => v === upper);
  if (!entry) return null;
  const [normalizedName] = entry;
  const school = get(KEYS.REGISTERED).find(u => u.role === 'school' && norm(resolveSchoolName(u)) === normalizedName);
  return { normalizedName, schoolName: school ? resolveSchoolName(school) : normalizedName };
}

// ── School Directory (registered school accounts) ──────────────────────────────
// Only real school accounts (role === 'school') are returned, so students/teachers
// can only request to join schools that actually exist on the platform.
export function getAllSchools() {
  return get(KEYS.REGISTERED)
    .filter(u => u.role === 'school')
    .map(u => {
      const name = resolveSchoolName(u);
      return {
        name,
        code: name ? getOrCreateSchoolCode(name) : '',
        email: u.email || '',
        uid: u.uid || '',
        city: u.city || u.location || u.address || '',
        phone: u.phone || '',
        studentCount: name ? getStudentsBySchool(name).length : 0,
        teacherCount: name ? getTeachersBySchool(name).length : 0,
      };
    })
    .filter(s => s.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Search the directory by school name or code (empty query → full list).
export function searchSchools(query) {
  const all = getAllSchools();
  const q = norm(query);
  if (!q) return all;
  return all.filter(s => norm(s.name).includes(q) || (s.code || '').toLowerCase().includes(q));
}

// ── School Join Requests ──────────────────────────────────────────────────────

const REQUESTS_KEY = 'questra_school_requests';

function getRequests() {
  try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch { return []; }
}
function saveRequests(arr) {
  try { localStorage.setItem(REQUESTS_KEY, JSON.stringify(arr)); } catch {}
}

export function getSchoolRequests(schoolName) {
  return getRequests().filter(r => norm(r.schoolName) === norm(schoolName));
}

export function getPendingRequestsByUser(email) {
  return getRequests().filter(r => norm(r.userEmail) === norm(email) && r.status === 'pending');
}

export function createSchoolRequest({ type, userEmail, userName, userUID, schoolName, message }) {
  const all = getRequests();
  const dup = all.find(r =>
    norm(r.userEmail) === norm(userEmail) &&
    norm(r.schoolName) === norm(schoolName) &&
    r.status === 'pending'
  );
  if (dup) return { success: false, error: 'A pending request already exists for this school.' };
  const req = {
    id: 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    type,
    userEmail: norm(userEmail),
    userName: userName || userEmail,
    userUID: userUID || '',
    schoolName,
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  all.unshift(req);
  saveRequests(all);
  return { success: true, request: req };
}

export function approveSchoolRequest(requestId) {
  const all = getRequests();
  const idx = all.findIndex(r => r.id === requestId);
  if (idx < 0) return false;
  all[idx] = { ...all[idx], status: 'approved', updatedAt: new Date().toISOString() };
  saveRequests(all);
  const req = all[idx];
  const registered = get(KEYS.REGISTERED);
  const ui = registered.findIndex(u => norm(u.email) === norm(req.userEmail));
  if (ui >= 0) {
    registered[ui] = { ...registered[ui], schoolName: req.schoolName };
    set(KEYS.REGISTERED, registered);
  }
  if (req.type === 'teacher') {
    const asgns = get(KEYS.TEACHER_ASSIGNMENTS);
    if (!asgns.find(a => norm(a.teacherEmail) === norm(req.userEmail))) {
      asgns.push({ teacherEmail: norm(req.userEmail), schoolName: req.schoolName, classNames: [], updatedAt: new Date().toISOString() });
      set(KEYS.TEACHER_ASSIGNMENTS, asgns);
    }
  }
  return true;
}

export function rejectSchoolRequest(requestId) {
  const all = getRequests();
  const idx = all.findIndex(r => r.id === requestId);
  if (idx < 0) return false;
  all[idx] = { ...all[idx], status: 'rejected', updatedAt: new Date().toISOString() };
  saveRequests(all);
  return true;
}

// Student/teacher cancels their own still-pending join request.
export function cancelSchoolRequest(requestId) {
  const all = getRequests();
  const req = all.find(r => r.id === requestId);
  if (!req || req.status !== 'pending') return false;
  saveRequests(all.filter(r => r.id !== requestId));
  return true;
}

export function removeUserFromSchool(userEmail, schoolName, type) {
  const registered = get(KEYS.REGISTERED);
  const ui = registered.findIndex(u => norm(u.email) === norm(userEmail));
  if (ui >= 0) {
    registered[ui] = { ...registered[ui], schoolName: '' };
    set(KEYS.REGISTERED, registered);
  }
  if (type === 'teacher') removeTeacherAssignment(userEmail);
}

// ── Test Submissions ──────────────────────────────────────────────────────────

const SUBMISSIONS_KEY = 'questra_test_submissions';

// Returns true if the paper has at least one question with selectable options (MCQ)
export function countMCQQuestions(paper) {
  let count = 0;
  (paper?.sections || []).forEach(sec => {
    (sec.questions || []).forEach(q => {
      const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : []);
      if (opts.length >= 2) count++;
    });
  });
  return count;
}

// A paper is "attendable" if it has at least 1 MCQ question
function hasMCQQuestions(paper) {
  return countMCQQuestions(paper) > 0;
}

export function getMCQPapersForStudent(studentClassName, studentSchoolName) {
  return getPapersForStudent(studentClassName, studentSchoolName).filter(hasMCQQuestions);
}

export function getTestSubmissions(paperId) {
  try { return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]').filter(s => s.paperId === paperId); }
  catch { return []; }
}

export function getSubmissionByStudent(paperId, studentEmail) {
  try {
    const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    return all.find(s => s.paperId === paperId && norm(s.studentEmail) === norm(studentEmail)) || null;
  } catch { return null; }
}

export function submitTestAnswers({ paperId, studentEmail, studentName, schoolName, answers, score, total, percentage }) {
  try {
    const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const idx = all.findIndex(s => s.paperId === paperId && norm(s.studentEmail) === norm(studentEmail));
    const rec = { paperId, studentEmail: norm(studentEmail), studentName, schoolName, answers, score, total, percentage, submittedAt: new Date().toISOString(), aiFeedback: null };
    if (idx >= 0) all[idx] = { ...all[idx], ...rec };
    else all.push(rec);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));

    // Record in student's adaptive/performance history so charts pick it up
    const paper = get(KEYS.PAPERS).find(p => p.id === paperId);
    if (paper) {
      const histKey = `q_adaptive_history_${norm(studentEmail)}`;
      const hist = JSON.parse(localStorage.getItem(histKey) || '[]');
      hist.push({
        subject: paper.subject || '',
        board: paper.board || '',
        cls: paper.class || '',
        timestamp: new Date().toISOString(),
        score, total, percentage,
        type: 'assigned_test',
        paperId,
      });
      localStorage.setItem(histKey, JSON.stringify(hist));
    }
  } catch {}
}

export function updateSubmissionFeedback(paperId, studentEmail, aiFeedback) {
  try {
    const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    const idx = all.findIndex(s => s.paperId === paperId && norm(s.studentEmail) === norm(studentEmail));
    if (idx >= 0) {
      all[idx] = { ...all[idx], aiFeedback };
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
    }
  } catch {}
}

export function getTestSubmissionsBySchool(schoolName) {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]').filter(s => norm(s.schoolName) === norm(schoolName));
  } catch { return []; }
}

export function unassignPaper(paperId) {
  const all = get(KEYS.PAPERS);
  const idx = all.findIndex(p => p.id === paperId);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status: 'draft', assignedClasses: [] };
    set(KEYS.PAPERS, all);
  }
}

// ── Demo Account Initialization ───────────────────────────────────────────────

const DEMO_INIT_KEY = 'questra_demo_v5'; // bump version to re-run on existing browsers

export function initializeDemoAccounts() {
  if (localStorage.getItem(DEMO_INIT_KEY)) return;
  const SCHOOL   = 'Demo School';
  const SC_EMAIL = 'school@questra.com';
  const T_EMAIL  = 'teacher@questra.com';
  const S_EMAIL  = 'student@questra.com';

  getOrCreateSchoolCode(SCHOOL);

  let reg = get(KEYS.REGISTERED);

  // Helper: upsert a demo account in questra_registered
  function upsert(email, defaults) {
    const i = reg.findIndex(u => u.email === email);
    if (i >= 0) {
      reg[i] = { ...defaults, ...reg[i], uid: reg[i].uid || generateUID() };
    } else {
      reg.push({ ...defaults, uid: generateUID(), createdAt: new Date().toISOString() });
    }
  }

  // Demo School account (school@questra.com)
  upsert(SC_EMAIL, {
    id: 'school_demo', email: SC_EMAIL, password: 'school123',
    firstName: 'Demo', lastName: 'School', role: 'school',
    schoolName: SCHOOL,
  });

  // Demo Teacher account (teacher@questra.com)
  upsert(T_EMAIL, {
    id: 'teacher_demo', email: T_EMAIL, password: 'teacher123',
    firstName: 'Demo', lastName: 'Teacher', role: 'teacher',
    schoolName: SCHOOL, subject: 'Mathematics',
  });

  // Demo Student account (student@questra.com)
  upsert(S_EMAIL, {
    id: 'student_demo', email: S_EMAIL, password: 'demo_password_123',
    firstName: 'Demo', lastName: 'Student', role: 'student',
    schoolName: SCHOOL, className: '10-A',
  });

  // InnovateChuruTejash student — find by name pattern
  const iti = reg.findIndex(u => u.role === 'student' && (
    norm([u.firstName, u.lastName].join(' ')).includes('tejash') ||
    norm([u.firstName, u.lastName].join(' ')).includes('churur') ||
    norm([u.firstName, u.lastName].join(' ')).includes('innovate')
  ));
  if (iti >= 0) {
    reg[iti] = { ...reg[iti], schoolName: SCHOOL, uid: reg[iti].uid || generateUID() };
  } else {
    reg.push({
      id: 'innovate_churur', email: 'innovate.churur@questra.com', password: 'student123',
      firstName: 'Innovate', lastName: 'Churur Tejash', role: 'student',
      schoolName: SCHOOL, className: '10-A', uid: generateUID(), createdAt: new Date().toISOString(),
    });
  }

  // Ensure every user has a UID
  reg = reg.map(u => u.uid ? u : { ...u, uid: generateUID() });
  set(KEYS.REGISTERED, reg);

  // Ensure Demo Teacher has an assignment record
  const asgns = get(KEYS.TEACHER_ASSIGNMENTS);
  if (!asgns.find(a => norm(a.teacherEmail) === T_EMAIL)) {
    asgns.push({ teacherEmail: T_EMAIL, schoolName: SCHOOL, classNames: [], updatedAt: new Date().toISOString() });
    set(KEYS.TEACHER_ASSIGNMENTS, asgns);
  }

  localStorage.setItem(DEMO_INIT_KEY, '1');
}
