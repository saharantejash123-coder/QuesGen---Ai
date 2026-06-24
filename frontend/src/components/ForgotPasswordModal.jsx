import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Loader2, ShieldCheck, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { requestPasswordResetOTP, confirmPasswordResetOTP } from '../services/authService';
import { toast } from './Toast';

const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
  color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s',
};
const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', marginBottom: '0.45rem',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};
const focus = (e) => { e.target.style.borderColor = 'rgba(129,140,248,0.6)'; };
const blur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

export default function ForgotPasswordModal({ open, onClose, initialEmail = '' }) {
  const [step, setStep] = useState('email');   // email | reset | done
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setStep('email'); setOtp(''); setPw(''); setPw2(''); setError(''); setLoading(false);
  };
  const close = () => { reset(); onClose(); };

  const sendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordResetOTP(email);
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Could not send the reset code.');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (e) => {
    e?.preventDefault();
    setError('');
    if (pw !== pw2) { setError('Passwords do not match.'); return; }
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await confirmPasswordResetOTP(email, otp, pw);
      setStep('done');
      toast('Password updated — you can sign in now');
    } catch (err) {
      setError(err.message || 'Could not reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="fp-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 11000,
          background: 'rgba(2,4,12,0.72)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem',
        }}
      >
        <motion.div
          key="fp-card"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 420, borderRadius: 20, padding: '1.75rem',
            background: 'linear-gradient(155deg, #0d0d1a 0%, #0a0f2e 55%, #060b20 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)', position: 'relative',
          }}
        >
          <button
            type="button" onClick={close} aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(35,84,244,0.12)', border: '1px solid rgba(35,84,244,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            {step === 'done' ? <CheckCircle2 size={28} color="#34d399" /> : step === 'reset' ? <ShieldCheck size={28} color="#818cf8" /> : <KeyRound size={26} color="#818cf8" />}
          </div>

          {/* ── Step: email ── */}
          {step === 'email' && (
            <form onSubmit={sendOtp}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>Reset your password</h2>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                Enter the email for your QuesGen account and we'll send a 6-digit verification code.
              </p>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} autoFocus />

              {error && <div style={errBox}>{error}</div>}

              <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                {loading ? <><Loader2 size={18} style={spin} /> Sending…</> : <><Mail size={16} /> Send reset code</>}
              </button>
            </form>
          )}

          {/* ── Step: reset ── */}
          {step === 'reset' && (
            <form onSubmit={confirm}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>Enter code & new password</h2>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                We emailed a 6-digit code to <span style={{ color: '#818cf8', fontWeight: 600 }}>{email}</span>. Check your inbox (and spam).
              </p>

              <label style={labelStyle}>6-digit code</label>
              <input inputMode="numeric" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="••••••" style={{ ...inputStyle, letterSpacing: '0.4rem', textAlign: 'center', fontFamily: 'monospace', marginBottom: '0.9rem' }} onFocus={focus} onBlur={blur} autoFocus />

              <label style={labelStyle}>New password</label>
              <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min. 6 characters" style={{ ...inputStyle, marginBottom: '0.9rem' }} onFocus={focus} onBlur={blur} />

              <label style={labelStyle}>Confirm new password</label>
              <input type="password" required minLength={6} value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Re-enter password" style={inputStyle} onFocus={focus} onBlur={blur} />

              {error && <div style={errBox}>{error}</div>}

              <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                {loading ? <><Loader2 size={18} style={spin} /> Updating…</> : <>Reset password <ArrowRight size={16} /></>}
              </button>
              <button type="button" onClick={() => { setStep('email'); setError(''); }} style={linkBtn}>← Use a different email</button>
            </form>
          )}

          {/* ── Step: done ── */}
          {step === 'done' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>Password updated</h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                Your password has been changed. You can now sign in with your new password.
              </p>
              <button type="button" onClick={close} style={primaryBtn(false)}>
                Back to sign in <ArrowRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

const spin = { animation: 'spin 1s linear infinite' };
const errBox = { marginTop: '1rem', padding: '0.7rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.82rem', textAlign: 'center' };
const primaryBtn = (loading) => ({
  width: '100%', marginTop: '1.4rem', padding: '0.9rem', borderRadius: 12, border: 'none',
  background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #2354F4, #7C3AED)',
  color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif",
});
const linkBtn = { width: '100%', marginTop: '0.9rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" };
