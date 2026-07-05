// ─────────────────────────────────────────────────────────────────────────────
// QuesGen AI — End-to-end automation pipeline
//
//   student submits test ──▶ performance analysis ──▶ adaptive difficulty map
//                                     │
//                                     └──▶ Bridge-Report auto-generated for
//                                          parents (zero-touch) and surfaced
//                                          in the teacher + Pilot dashboards
//
// All records live in the same localStorage data layer as schoolService so
// every module (student, teacher, school, admin) reads a single source of
// truth without manual steps.
// ─────────────────────────────────────────────────────────────────────────────

import { deliverReport } from './notificationService.js';

const SUBMISSIONS_KEY = 'questra_test_submissions';
const REPORTS_KEY = 'questra_bridge_reports';

const norm = (e) => (e || '').trim().toLowerCase();

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function writeJson(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota — non-fatal */ }
}

// Adaptive history is written under both raw and normalised email keys by
// different modules — merge both so no result is missed.
function readAdaptiveHistory(studentEmail) {
  const a = readJson(`q_adaptive_history_${studentEmail}`, []);
  const b = studentEmail === norm(studentEmail) ? [] : readJson(`q_adaptive_history_${norm(studentEmail)}`, []);
  return [...a, ...b].sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp));
}

function readWeakAreaStats(studentEmail) {
  return readJson(`q_adaptive_stats_${studentEmail}`, null)
    || readJson(`q_adaptive_stats_${norm(studentEmail)}`, null)
    || {};
}

// ─── Adaptive difficulty mapping ────────────────────────────────────────────
// Converts a student's rolling performance into the easy/medium/hard mix the
// question generator uses. Strong students get pushed harder; struggling
// students get more confidence-building questions.

const DIFFICULTY_BANDS = [
  { min: 80, mix: { easy: 15, medium: 40, hard: 45 }, level: 'advanced' },
  { min: 60, mix: { easy: 25, medium: 50, hard: 25 }, level: 'proficient' },
  { min: 40, mix: { easy: 35, medium: 50, hard: 15 }, level: 'developing' },
  { min: 0,  mix: { easy: 50, medium: 40, hard: 10 }, level: 'foundation' },
];

export function getDifficultyProfile(studentEmail, subject) {
  const history = readAdaptiveHistory(studentEmail)
    .filter(h => !subject || !h.subject || h.subject === subject)
    .slice(-5);

  if (history.length === 0) {
    return { ...{ easy: 30, medium: 50, hard: 20 }, level: 'balanced', avg: null, samples: 0 };
  }

  // Weighted rolling average — recent tests count more
  let weightSum = 0, acc = 0;
  history.forEach((h, i) => {
    const w = i + 1;
    acc += (h.percentage ?? 0) * w;
    weightSum += w;
  });
  const avg = Math.round(acc / weightSum);

  const band = DIFFICULTY_BANDS.find(b => avg >= b.min) || DIFFICULTY_BANDS[DIFFICULTY_BANDS.length - 1];
  return { ...band.mix, level: band.level, avg, samples: history.length };
}

// ─── Performance analysis ───────────────────────────────────────────────────

export function analyzeStudentPerformance(studentEmail, schoolName) {
  const email = norm(studentEmail);
  const submissions = readJson(SUBMISSIONS_KEY, [])
    .filter(s => norm(s.studentEmail) === email && (!schoolName || norm(s.schoolName) === norm(schoolName)))
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

  const adaptiveHistory = readAdaptiveHistory(studentEmail);
  const weakStats = readWeakAreaStats(studentEmail);

  const allScores = [
    ...submissions.map(s => s.percentage ?? 0),
    ...adaptiveHistory.map(h => h.percentage ?? 0),
  ];
  const avgPercentage = allScores.length
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : null;

  // Trend: compare the mean of the last 3 scores to the 3 before them
  let trend = 'stable';
  if (allScores.length >= 4) {
    const recent = allScores.slice(-3);
    const before = allScores.slice(-6, -3);
    const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
    const delta = mean(recent) - mean(before);
    trend = delta > 5 ? 'improving' : delta < -5 ? 'declining' : 'stable';
  }

  const weakTopics = Object.entries(weakStats)
    .filter(([, score]) => score < 60)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 4)
    .map(([topic, score]) => ({ topic, score }));

  const strongTopics = Object.entries(weakStats)
    .filter(([, score]) => score >= 80)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic, score]) => ({ topic, score }));

  const lastSubmission = submissions[submissions.length - 1] || null;

  return {
    testsTaken: submissions.length + adaptiveHistory.length,
    assignedTestsTaken: submissions.length,
    avgPercentage,
    trend,
    weakTopics,
    strongTopics,
    lastSubmission,
  };
}

// ─── Bridge-Reports ─────────────────────────────────────────────────────────

export function getBridgeReports({ schoolName, classNames = null } = {}) {
  let reports = readJson(REPORTS_KEY, []);
  if (schoolName) reports = reports.filter(r => norm(r.schoolName) === norm(schoolName));
  if (classNames && classNames.length) reports = reports.filter(r => !r.className || classNames.includes(r.className));
  return reports.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
}

function buildReportSummary({ studentName, subject, score, total, percentage, analysis }) {
  const lines = [
    `${studentName} scored ${score}/${total} (${percentage}%) in ${subject || 'the assigned test'}.`,
  ];
  if (analysis.avgPercentage !== null) {
    lines.push(`Overall average: ${analysis.avgPercentage}% across ${analysis.testsTaken} tests (${analysis.trend}).`);
  }
  if (analysis.weakTopics.length) {
    lines.push(`Focus areas: ${analysis.weakTopics.map(w => w.topic).join(', ')}.`);
  }
  if (analysis.strongTopics.length) {
    lines.push(`Strengths: ${analysis.strongTopics.map(s => s.topic).join(', ')}.`);
  }
  return lines.join(' ');
}

function upsertReport(report) {
  const all = readJson(REPORTS_KEY, []);
  const idx = all.findIndex(r => r.id === report.id);
  if (idx >= 0) all[idx] = { ...all[idx], ...report };
  else all.push(report);
  // Keep the log bounded
  writeJson(REPORTS_KEY, all.slice(-400));
  return report;
}

/**
 * Zero-touch pipeline entry point. Call once per test submission — it runs the
 * performance analysis and auto-generates the parent Bridge-Report. Never
 * throws: reporting must not break the student's result screen.
 */
export function runPostTestPipeline({ paper, user, score, total, percentage }) {
  try {
    if (!user?.email) return null;
    const analysis = analyzeStudentPerformance(user.email, user.schoolName);
    const studentName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

    const report = {
      id: `br_${paper?.id || 'test'}_${norm(user.email)}`,
      auto: true,
      studentEmail: norm(user.email),
      studentName,
      className: user.className || paper?.class || '',
      schoolName: user.schoolName || '',
      paperId: paper?.id || null,
      subject: paper?.subject || '',
      score, total, percentage,
      summary: buildReportSummary({ studentName, subject: paper?.subject, score, total, percentage, analysis }),
      weakTopics: analysis.weakTopics,
      trend: analysis.trend,
      avgPercentage: analysis.avgPercentage,
      generatedAt: new Date().toISOString(),
      status: 'queued', // delivered by the teacher's active channels
      channels: [],
    };
    return upsertReport(report);
  } catch {
    return null;
  }
}

/**
 * Manual report generation from the teacher's Bridge-Reports screen — builds a
 * report from the student's latest recorded performance even when no new test
 * was just submitted.
 */
export function generateManualReport(student, { schoolName, className }) {
  const analysis = analyzeStudentPerformance(student.email, schoolName);
  const last = analysis.lastSubmission;
  const studentName = student.displayName
    || [student.firstName, student.lastName].filter(Boolean).join(' ')
    || student.email;

  const report = {
    id: `br_manual_${norm(student.email)}_${Date.now()}`,
    auto: false,
    studentEmail: norm(student.email),
    studentName,
    className: className || student.className || '',
    schoolName: schoolName || '',
    paperId: last?.paperId || null,
    subject: last ? '' : null,
    score: last?.score ?? null,
    total: last?.total ?? null,
    percentage: last?.percentage ?? analysis.avgPercentage,
    summary: last
      ? buildReportSummary({ studentName, subject: '', score: last.score, total: last.total, percentage: last.percentage, analysis })
      : `${studentName} has not attempted any test yet. Encourage them to take their first assigned paper.`,
    weakTopics: analysis.weakTopics,
    trend: analysis.trend,
    avgPercentage: analysis.avgPercentage,
    generatedAt: new Date().toISOString(),
    status: 'queued',
    channels: [],
  };
  return upsertReport(report);
}

/**
 * Deliver queued reports through the (mock) channel gateway and mark them
 * sent, recording the per-channel delivery results on each report.
 */
export async function sendReports(reportIds, channels) {
  const activeChannels = Object.entries(channels || {})
    .filter(([, on]) => on)
    .map(([ch]) => ch);
  if (activeChannels.length === 0) return 0;

  const all = readJson(REPORTS_KEY, []);
  const ids = new Set(reportIds);
  const pending = all.filter(r => ids.has(r.id) && r.status !== 'sent');

  // Fan out to the gateway (mock: parallel per report, per channel)
  const deliveryResults = await Promise.all(
    pending.map(r => deliverReport(r, channels))
  );
  const deliveriesById = new Map(pending.map((r, i) => [r.id, deliveryResults[i]]));

  // Re-read: the gateway calls are async and another tab may have written
  const fresh = readJson(REPORTS_KEY, []);
  let sent = 0;
  const updated = fresh.map(r => {
    if (!deliveriesById.has(r.id) || r.status === 'sent') return r;
    sent++;
    return {
      ...r,
      status: 'sent',
      sentAt: new Date().toISOString(),
      channels: activeChannels,
      deliveries: deliveriesById.get(r.id),
    };
  });
  writeJson(REPORTS_KEY, updated);
  return sent;
}
