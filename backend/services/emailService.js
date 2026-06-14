const https = require('https');

// ─── In-memory OTP store  { email → { otp, expires } } ───────────────────────
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Store OTP (10-min TTL) ───────────────────────────────────────────────────
function storeOTP(email) {
  const otp = generateOTP();
  const key = email.trim().toLowerCase();
  otpStore.set(key, { otp, expires: Date.now() + 10 * 60 * 1000 });
  setTimeout(() => otpStore.delete(key), 11 * 60 * 1000);
  return otp;
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
function checkOTP(email, enteredOtp) {
  const key = email.trim().toLowerCase();
  const record = otpStore.get(key);
  if (!record)                         return { ok: false, message: 'OTP not found. Please request a new one.' };
  if (Date.now() > record.expires) {   otpStore.delete(key); return { ok: false, message: 'OTP has expired. Please request a new one.' }; }
  if (record.otp !== enteredOtp.trim()) return { ok: false, message: 'Incorrect OTP. Please try again.' };
  otpStore.delete(key);
  return { ok: true };
}

// ─── Brevo REST call via https module (works on all Node versions) ────────────
function brevoRequest(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'api.brevo.com',
        path:     '/v3/smtp/email',
        method:   'POST',
        headers: {
          'accept':         'application/json',
          'api-key':        apiKey,
          'content-type':   'application/json',
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { resolve({ status: res.statusCode, body: data }); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── OTP Email HTML ───────────────────────────────────────────────────────────
function buildEmailHTML(otp) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0f2e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f2e;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#111827;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#2354F4,#7C3AED);padding:28px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">QuesGen AI</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">India's #1 AI Exam Prep Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="color:rgba(255,255,255,0.55);font-size:15px;margin:0 0 6px;">Verify your email address</p>
            <h2 style="color:#fff;font-size:20px;margin:0 0 28px;font-weight:700;">Your One-Time Password</h2>
            <div style="background:rgba(35,84,244,0.1);border:1.5px solid rgba(35,84,244,0.4);
                        border-radius:14px;padding:26px;text-align:center;margin-bottom:28px;">
              <p style="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:2px;
                         text-transform:uppercase;margin:0 0 12px;">One-Time Password</p>
              <span style="font-size:46px;font-weight:900;letter-spacing:12px;
                           color:#fff;font-family:monospace;">${otp}</span>
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:12px 0 0;">
                Valid for <strong style="color:#818cf8;">10 minutes</strong> only
              </p>
            </div>
            <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.7;margin:0 0 14px;">
              Enter this code on the QuesGen registration page to verify your email and complete your account setup.
            </p>
            <p style="color:rgba(255,255,255,0.25);font-size:12px;line-height:1.6;margin:0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="color:rgba(255,255,255,0.18);font-size:11px;margin:0;">
              © 2025 QuesGen AI · Jaipur, Rajasthan
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Send via Brevo ───────────────────────────────────────────────────────────
async function sendOTPEmail(toEmail, otp) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey === 'your-brevo-api-key-here') {
    console.warn('[OTP] BREVO_API_KEY not set — returning demo OTP');
    return { sent: false, demoOtp: otp };
  }

  const senderEmail = process.env.SMTP_FROM || 'ai.quesgen@gmail.com';

  try {
    const result = await brevoRequest(
      {
        sender:      { name: 'QuesGen AI', email: senderEmail },
        to:          [{ email: toEmail }],
        subject:     `${otp} is your QuesGen verification code`,
        htmlContent: buildEmailHTML(otp),
        textContent: `Your QuesGen OTP is: ${otp}\n\nThis code expires in 10 minutes.\nIf you didn't request this, ignore this email.`,
      },
      apiKey
    );

    if (result.status >= 200 && result.status < 300) {
      console.log(`[OTP] Email sent to ${toEmail} via Brevo`);
      return { sent: true };
    }

    // Brevo returned an error (e.g. sender not verified)
    const errMsg = result.body?.message || JSON.stringify(result.body);
    console.error(`[OTP] Brevo error ${result.status}: ${errMsg}`);
    // Still return demoOtp so registration isn't blocked
    return { sent: false, demoOtp: otp, brevoError: errMsg };

  } catch (err) {
    console.error('[OTP] Brevo request failed:', err.message);
    return { sent: false, demoOtp: otp };
  }
}

module.exports = { storeOTP, checkOTP, sendOTPEmail };
