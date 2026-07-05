// ─────────────────────────────────────────────────────────────────────────────
// Mock delivery gateway for Bridge-Reports.
//
// Simulates the WhatsApp Business / SMS / email delivery APIs with realistic
// per-channel latency so the whole notification UI flow can be exercised
// end-to-end before the real gateways are integrated.
//
// To go live, replace `deliverViaChannel` with real API calls (Meta WhatsApp
// Cloud API, MSG91/Twilio for SMS, Brevo for email) — the rest of the
// pipeline and UI stay unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const LOG_KEY = 'questra_delivery_log';

const CHANNEL_LATENCY_MS = {
  whatsapp: [350, 900],
  sms: [250, 700],
  email: [500, 1200],
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const randBetween = ([min, max]) => Math.floor(min + Math.random() * (max - min));

function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) ?? []; }
  catch { return []; }
}

function appendLog(entry) {
  const log = readLog();
  log.push(entry);
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-500))); } catch { /* quota — non-fatal */ }
}

/** MOCK: pretend to hand the payload to a channel gateway. */
async function deliverViaChannel(channel, payload) {
  const latencyMs = randBetween(CHANNEL_LATENCY_MS[channel] || [300, 800]);
  await sleep(latencyMs);
  return {
    channel,
    status: 'delivered',
    mock: true,
    latencyMs,
    deliveredAt: new Date().toISOString(),
    messageId: `mock_${channel}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    preview: payload.summary?.slice(0, 120) || '',
  };
}

/**
 * Deliver one report through every enabled channel (in parallel).
 * Returns the per-channel delivery results and records them in the log.
 */
export async function deliverReport(report, channels) {
  const active = Object.entries(channels || {})
    .filter(([, on]) => on)
    .map(([ch]) => ch);
  if (active.length === 0) return [];

  const results = await Promise.all(
    active.map(ch => deliverViaChannel(ch, report))
  );

  appendLog({
    reportId: report.id,
    studentName: report.studentName,
    schoolName: report.schoolName,
    results,
    at: new Date().toISOString(),
  });
  return results;
}

/**
 * Mock API trigger: fire a sample Bridge-Report through the gateway so the
 * notification flow (latency, statuses, log) can be tested from the UI
 * without needing a real student submission.
 */
export async function sendTestNotification(channels) {
  const sample = {
    id: `test_${Date.now().toString(36)}`,
    studentName: 'Test Student',
    schoolName: 'Gateway Test',
    summary: 'This is a test Bridge-Report notification from QuesGen AI. If you can read this, the delivery pipeline is working.',
  };
  return deliverReport(sample, channels);
}

/** Most recent delivery attempts, newest first. */
export function getDeliveryLog(limit = 50) {
  return readLog().slice(-limit).reverse();
}
