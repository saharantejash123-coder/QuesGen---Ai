import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, BookOpen, Brain, Target, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../context/LanguageContext';
import { login, loginWithGoogleToken, saveSession, getSession } from '../services/authService';
import { getActiveBan, syncBanFromBackend } from '../services/adminService';
import { LOGIN_NOTICE_KEY } from '../hooks/useRequireAuth';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const LOGIN_ERROR_KEY = 'questra_login_error';

const highlights = [
  { icon: <Brain size={18} />, text: 'AI-generated exam papers in seconds' },
  { icon: <Target size={18} />, text: '4,28,500+ PYQs across 7+ boards' },
  { icon: <TrendingUp size={18} />, text: 'Adaptive tests that target your weak areas' },
  { icon: <BookOpen size={18} />, text: 'Full Hindi & English support' },
];

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const navigate = useNavigate();

  const redirect = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'admin') navigate('/admin');
    else if (r === 'school') navigate('/school');
    else if (r === 'teacher') navigate('/teacher');
    else navigate('/student');
  };

  useEffect(() => {
    const session = getSession();
    if (session?.role) redirect(session.role);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      const msg = sessionStorage.getItem(LOGIN_NOTICE_KEY);
      if (msg) { setNotice(msg); sessionStorage.removeItem(LOGIN_NOTICE_KEY); }
      const errMsg = sessionStorage.getItem(LOGIN_ERROR_KEY);
      if (errMsg) { setError(errMsg); sessionStorage.removeItem(LOGIN_ERROR_KEY); }
    } catch { /* ignore */ }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      saveSession(user);
      await syncBanFromBackend(user);
      if (user._banned || getActiveBan(user.email)) return navigate('/banned');
      redirect(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError('');
    try {
      const user = await loginWithGoogleToken(credentialResponse.credential);
      saveSession(user);
      await syncBanFromBackend(user);
      if (user._banned || getActiveBan(user.email)) return navigate('/banned');
      redirect(user.role);
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#000' }}>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} initialEmail={email} />

      {/* ── Left brand panel (desktop only) ── */}
      <div className="auth-brand-panel" style={{
        flex: '0 0 45%',
        background: 'linear-gradient(145deg, #0d0d1a 0%, #0a0f2e 40%, #060b20 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(35,84,244,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', zIndex: 1 }}>
          <img src="/logo.png" alt="QuesGen" style={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(35,84,244,0.6))' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', fontFamily: "'DM Sans', sans-serif" }}>QuesGen</span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.75rem', borderRadius: 100, border: '1px solid rgba(35,84,244,0.35)', background: 'rgba(35,84,244,0.08)', marginBottom: '1.5rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>India's #1 AI Exam Prep</span>
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            The smarter way<br />
            <em style={{ color: '#818cf8' }}>to crack any exam.</em>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 340 }}>
            AI-powered paper generation, adaptive testing, and 15 years of PYQ data — all in one platform.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(35,84,244,0.12)', border: '1px solid rgba(35,84,244,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
                  {h.icon}
                </div>
                <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {[['50K+', 'Students'], ['7+', 'Boards'], ['4.28L+', 'PYQs']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'Instrument Serif', serif" }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflowY: 'auto' }}>
        {/* Mobile logo */}
        <div className="auth-mobile-logo" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/logo.png" alt="QuesGen" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(35,84,244,0.5))' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>QuesGen</span>
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.3px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
                Create account →
              </Link>
            </p>
          </div>

          {/* Login-required notice */}
          {notice && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(35,84,244,0.1)', border: '1px solid rgba(129,140,248,0.35)', color: '#a5b4fc', fontSize: '0.83rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Brain size={16} style={{ flexShrink: 0 }} />
              {notice}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.83rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <button type="button" onClick={() => setForgotOpen(true)} style={{ fontSize: '0.75rem', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif" }}>Forgot?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.85rem 2.75rem 0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              style={{ width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', background: isLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #2354F4, #7C3AED)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s', marginTop: '0.25rem' }}
            >
              {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google Sign-In — official button (iframe-rendered, never popup-blocked) */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', opacity: googleLoading ? 0.6 : 1, pointerEvents: googleLoading ? 'none' : 'auto' }}>
            {googleLoading ? (
              <div style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: '#fff', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed. Please try again.')}
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="380"
              />
            )}
          </div>

          <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ color: 'rgba(129,140,248,0.7)', textDecoration: 'none' }}>Terms</Link>{' '}and{' '}
            <Link to="/privacy" style={{ color: 'rgba(129,140,248,0.7)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
