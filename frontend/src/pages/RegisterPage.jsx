import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, GraduationCap, Users, Building2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../context/LanguageContext';
import { loginWithGoogleToken, saveSession } from '../services/authService';

const roleConfig = {
  student: { icon: <GraduationCap size={18} />, label: 'Student', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)' },
  teacher: { icon: <Users size={18} />, label: 'Teacher', color: '#2354F4', bg: 'rgba(35,84,244,0.12)', border: 'rgba(35,84,244,0.35)' },
  school:  { icon: <Building2 size={18} />, label: 'School / Institution', color: '#059669', bg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.35)' },
};

const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
  color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s',
};
const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.45)', marginBottom: '0.45rem',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

export default function RegisterPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', schoolName: '', phone: '', registrationNumber: '', subject: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const cfg = roleConfig[role];
  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));

  const focusStyle = (e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; };
  const blurStyle  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const nameParts = (formData.name || '').trim().split(/\s+/).filter(Boolean);
    const payload = {
      email: formData.email, password: formData.password, role,
      firstName: role === 'school' ? formData.schoolName : (nameParts[0] || ''),
      lastName:  role === 'school' ? '' : (nameParts.slice(1).join(' ') || ''),
    };
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backend}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('questra_user', JSON.stringify(data.user));
        localStorage.setItem('questra_token', data.token);
        if (data.user.role === 'school') navigate('/school');
        else if (data.user.role === 'teacher') navigate('/teacher');
        else navigate('/student');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch { setError('Unable to connect to server.'); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogleToken(credentialResponse.credential);
      setFormData(p => ({ ...p, email: user.email, name: user.firstName || '' }));
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#000' }}>

      {/* ── Left brand panel ── */}
      <div className="auth-brand-panel" style={{
        flex: '0 0 42%',
        background: 'linear-gradient(145deg, #0d0d1a 0%, #0a0f2e 40%, #060b20 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(35,84,244,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '3rem', zIndex: 1 }}>
          <img src="/logo.png" alt="QuesGen" style={{ width: 38, height: 38, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(124,58,237,0.5))' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>QuesGen</span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Join 50,000+<br />
            <em style={{ color: '#a78bfa' }}>students & teachers.</em>
          </h2>
          <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 320 }}>
            Create your free account and get instant access to AI-powered exam preparation, PYQ archives, and adaptive testing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { emoji: '🎓', text: 'Students', sub: 'Exam prep & practice' },
              { emoji: '👩‍🏫', text: 'Teachers', sub: 'Paper generation & grading' },
              { emoji: '🏫', text: 'Schools', sub: 'Class management & analytics' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.2rem', width: 36, textAlign: 'center' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{item.text}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem 1.5rem', overflowY: 'auto' }}>

        {/* Mobile logo */}
        <div className="auth-mobile-logo" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <img src="/logo.png" alt="QuesGen" style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(35,84,244,0.5))' }} />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>QuesGen</span>
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 420, paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.3px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>

          {/* Google sign-up */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google auth failed.')} theme="filled_black" shape="rectangular" size="large" width="100%" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>or fill in manually</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Role selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>I am a</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {Object.entries(roleConfig).map(([key, rc]) => (
                <button
                  key={key} type="button" onClick={() => setRole(key)}
                  style={{
                    padding: '0.65rem 0.5rem', borderRadius: 12, border: `1px solid ${role === key ? rc.border : 'rgba(255,255,255,0.08)'}`,
                    background: role === key ? rc.bg : 'rgba(255,255,255,0.02)', color: role === key ? rc.color : 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{ color: role === key ? rc.color : 'rgba(255,255,255,0.3)' }}>{rc.icon}</span>
                  {key === 'school' ? 'School' : rc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {role !== 'school' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" required value={formData.name} onChange={set('name')} placeholder="John Doe" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            {role === 'school' && (
              <div>
                <label style={labelStyle}>Institution Name</label>
                <input type="text" required value={formData.schoolName} onChange={set('schoolName')} placeholder="e.g. Springfield High" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>{role === 'school' ? 'Official Admin Email' : 'Email Address'}</label>
              <input type="email" required value={formData.email} onChange={set('email')} placeholder="you@example.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" required value={formData.password} onChange={set('password')} placeholder="••••••••" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            {role !== 'school' && (
              <div>
                <label style={labelStyle}>School Name <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" value={formData.schoolName} onChange={set('schoolName')} placeholder="e.g. DPS Jaipur" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            {(role === 'teacher' || role === 'school') && (
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" required value={formData.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            {role === 'teacher' && (
              <div>
                <label style={labelStyle}>Primary Subject</label>
                <input type="text" required value={formData.subject} onChange={set('subject')} placeholder="e.g. Mathematics" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            {role === 'school' && (
              <div>
                <label style={labelStyle}>Registration Number / UDISE</label>
                <input type="text" required value={formData.registrationNumber} onChange={set('registrationNumber')} placeholder="e.g. SCH-992381" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.2rem 0' }}>
              <input type="checkbox" required id="tos" style={{ marginTop: '2px', accentColor: cfg.color, flexShrink: 0 }} />
              <label htmlFor="tos" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link to="/terms" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms</Link>{' '}and{' '}
                <Link to="/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit" disabled={isLoading}
              style={{ width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', background: isLoading ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${cfg.color}, #2354F4)`, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s' }}
            >
              {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
