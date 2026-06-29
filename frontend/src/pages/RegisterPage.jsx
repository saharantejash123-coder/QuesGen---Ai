import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, GraduationCap, Users, Mail, RefreshCw, ShieldCheck, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { saveSession, register, sendOTP, verifyOTP, accountExists } from '../services/authService';
import { validateSchoolCode, createSchoolRequest } from '../services/schoolService';
import SchoolPicker from '../components/SchoolPicker';

const roleConfig = {
  student: { icon: <GraduationCap size={18} />, label: 'Student',  color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)' },
  teacher: { icon: <Users size={18} />,          label: 'Teacher',  color: '#2354F4', bg: 'rgba(35,84,244,0.12)',  border: 'rgba(35,84,244,0.35)'  },
  school:  { icon: <Building2 size={18} />,      label: 'School',   color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' },
};

const BOARDS = ['CBSE', 'ICSE', 'Maharashtra Board', 'UP Board', 'Rajasthan Board', 'MP Board', 'Bihar Board', 'Other'];

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
const focusStyle = (e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; };
const blurStyle  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

// ─── Step 1: Registration Form ─────────────────────────────────────────────────
function RegistrationForm({ role, setRole, formData, setFormData, onSendOTP, isLoading, error }) {
  const cfg = roleConfig[role];
  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));

  return (
    <>
      {/* Role selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>I am a</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {Object.entries(roleConfig).map(([key, rc]) => (
            <button
              key={key} type="button" onClick={() => setRole(key)}
              style={{
                padding: '0.65rem 0.5rem', borderRadius: 12,
                border: `1px solid ${role === key ? rc.border : 'rgba(255,255,255,0.08)'}`,
                background: role === key ? rc.bg : 'rgba(255,255,255,0.02)',
                color: role === key ? rc.color : 'rgba(255,255,255,0.35)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ color: role === key ? rc.color : 'rgba(255,255,255,0.3)' }}>{rc.icon}</span>
              {rc.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

        {/* ── Common fields ── */}
        <div>
          <label style={labelStyle}>{role === 'school' ? 'Principal / Admin Name' : 'Full Name'}</label>
          <input type="text" required value={formData.name} onChange={set('name')} placeholder="John Doe" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input type="email" required value={formData.email} onChange={set('email')} placeholder="you@example.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input type="password" required minLength={6} value={formData.password} onChange={set('password')} placeholder="Min. 6 characters" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={labelStyle}>Confirm Password</label>
          <input type="password" required minLength={6} value={formData.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        {/* ── School-specific fields ── */}
        {role === 'school' && (
          <>
            <div>
              <label style={labelStyle}>School Name</label>
              <input type="text" required value={formData.schoolFullName} onChange={set('schoolFullName')} placeholder="e.g. Delhi Public School, Noida" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" required value={formData.city} onChange={set('city')} placeholder="Mumbai" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" required value={formData.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={labelStyle}>Board</label>
                <select required value={formData.board} onChange={set('board')} style={inputStyle}>
                  <option value="">Select board</option>
                  {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Affiliation No. <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input type="text" value={formData.affiliationNumber} onChange={set('affiliationNumber')} placeholder="e.g. 2730102" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
          </>
        )}

        {/* ── Student-specific fields ── */}
        {role === 'student' && (
          <>
            <div>
              <label style={labelStyle}>School Code <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(recommended)</span></label>
              <input type="text" value={formData.schoolCode} onChange={set('schoolCode')} placeholder="e.g. AB3XY7" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }} onFocus={focusStyle} onBlur={blurStyle} />
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.35rem' }}>Get this code from your school admin.</div>
            </div>
            <div>
              <label style={labelStyle}>Find Your School <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(if no code)</span></label>
              <SchoolPicker dark selected={formData.selectedSchool} onSelect={(s) => setFormData(p => ({ ...p, selectedSchool: s }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={labelStyle}>Grade / Class</label>
                <select value={formData.grade} onChange={set('grade')} style={inputStyle}>
                  <option value="">Select grade</option>
                  {['10', '12'].map(g => <option key={g} value={g}>Class {g}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Section</label>
                <select value={formData.section} onChange={set('section')} style={inputStyle}>
                  <option value="">Select section</option>
                  {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
          </>
        )}

        {/* ── Teacher-specific fields ── */}
        {role === 'teacher' && (
          <>
            <div>
              <label style={labelStyle}>School Code <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(recommended)</span></label>
              <input type="text" value={formData.schoolCode} onChange={set('schoolCode')} placeholder="e.g. AB3XY7" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }} onFocus={focusStyle} onBlur={blurStyle} />
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.35rem' }}>Get this code from your school admin.</div>
            </div>
            <div>
              <label style={labelStyle}>Find Your School <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(if no code)</span></label>
              <SchoolPicker dark selected={formData.selectedSchool} onSelect={(s) => setFormData(p => ({ ...p, selectedSchool: s }))} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Primary Subject</label>
              <input type="text" required value={formData.subject} onChange={set('subject')} placeholder="e.g. Mathematics" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.2rem 0' }}>
          <input type="checkbox" required id="tos" style={{ marginTop: '3px', accentColor: cfg.color, flexShrink: 0 }} />
          <label htmlFor="tos" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
            I agree to the{' '}
            <Link to="/terms"   style={{ color: '#818cf8', textDecoration: 'none' }}>Terms</Link>{' '}and{' '}
            <Link to="/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>.
          </label>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={isLoading}
          style={{ width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', background: isLoading ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${cfg.color}, #2354F4)`, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s' }}
        >
          {isLoading
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP… (may take ~20s)</>
            : <><Mail size={16} /> Send OTP to Email</>}
        </button>
      </form>
    </>
  );
}

// ─── Step 2: OTP Verification ──────────────────────────────────────────────────
function OTPVerification({ email, onVerify, onResend, onBack, isLoading, error }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = React.useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'Enter') { const code = otp.join(''); if (code.length === 6) onVerify(code); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); inputs.current[5]?.focus(); }
  };

  const code = otp.join('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(35,84,244,0.12)', border: '1px solid rgba(35,84,244,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <ShieldCheck size={30} color="#818cf8" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: "'DM Sans', sans-serif", marginBottom: '0.4rem' }}>Verify your email</h2>
        <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          We sent a 6-digit OTP to<br />
          <span style={{ color: '#818cf8', fontWeight: 600 }}>{email}</span>
        </p>
      </div>

      <div>
        <label style={{ ...labelStyle, textAlign: 'center', display: 'block', marginBottom: '0.75rem' }}>Enter 6-digit OTP</label>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i} ref={el => inputs.current[i] = el}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
                borderRadius: 12, border: `1.5px solid ${digit ? 'rgba(129,140,248,0.7)' : 'rgba(255,255,255,0.12)'}`,
                background: digit ? 'rgba(129,140,248,0.08)' : 'rgba(255,255,255,0.04)',
                color: '#fff', outline: 'none', fontFamily: 'monospace', transition: 'all 0.15s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.8)'}
              onBlur={e => e.target.style.borderColor = digit ? 'rgba(129,140,248,0.7)' : 'rgba(255,255,255,0.12)'}
            />
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <button
        type="button" disabled={isLoading || code.length < 6} onClick={() => onVerify(code)}
        style={{ width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', background: isLoading || code.length < 6 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #2354F4, #7C3AED)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: isLoading || code.length < 6 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
      >
        {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>Verify & Create Account <ArrowRight size={16} /></>}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
          ← Back
        </button>
        <button type="button" onClick={onResend} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}>
          <RefreshCw size={13} /> Resend OTP
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
        OTP is valid for 10 minutes. Check your spam folder if not received.
      </p>
    </div>
  );
}

// ─── Main RegisterPage ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep]   = useState('form');
  const [role, setRole]   = useState('student');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    schoolCode: '', selectedSchool: null,
    phone: '', subject: '', grade: '', section: '',
    // school-role fields
    schoolFullName: '', city: '', board: '', affiliationNumber: '',
  });
  const [error, setError]           = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  const cfg = roleConfig[role];

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (role === 'school' && !formData.schoolFullName.trim()) { setError('Please enter the school name.'); return; }
    if (accountExists(formData.email)) { setError('An account already exists for this email. Please sign in instead.'); return; }

    setIsLoading(true);
    try {
      await sendOTP(formData.email);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (enteredOtp) => {
    setError('');
    setIsLoading(true);
    try {
      await verifyOTP(formData.email, enteredOtp);

      const nameParts = (formData.name || '').trim().split(/\s+/).filter(Boolean);
      const className = (formData.grade && formData.section) ? `${formData.grade}-${formData.section}` : formData.grade || '';

      let targetSchool = '';
      if (role !== 'school') {
        if (formData.schoolCode?.trim()) {
          const codeResult = validateSchoolCode(formData.schoolCode.trim());
          if (!codeResult) { setError('Invalid school code. Please check and try again.'); setIsLoading(false); return; }
          targetSchool = codeResult.schoolName;
        } else if (formData.selectedSchool?.name) {
          targetSchool = formData.selectedSchool.name;
        }
      }

      const user = await register({
        email: formData.email,
        password: formData.password,
        role,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        schoolName: role === 'school' ? formData.schoolFullName.trim() : '',
        phone: formData.phone,
        subject: formData.subject,
        registrationNumber: formData.affiliationNumber || '',
        className: role === 'student' ? className : '',
      });

      if (targetSchool) {
        createSchoolRequest({
          type: role,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`.trim(),
          userUID: user.uid || '',
          schoolName: targetSchool,
          message: formData.schoolCode?.trim() ? 'Registered with school code' : 'Registered via school search',
        });
      }

      saveSession(user);
      if (role === 'school') navigate('/school');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try { await sendOTP(formData.email); }
    catch (err) { setError(err.message || 'Failed to resend OTP.'); }
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
              { emoji: '🎓', text: 'Students',  sub: 'Exam prep & adaptive testing' },
              { emoji: '👩‍🏫', text: 'Teachers', sub: 'Paper generation & grading' },
              { emoji: '🏫', text: 'Schools',   sub: 'Manage students & teachers' },
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

        <div style={{ width: '100%', maxWidth: 420, paddingTop: '0.5rem' }}>

          {step === 'form' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.3px' }}>
                  Create your account
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
                </p>
              </div>

              <RegistrationForm
                role={role} setRole={setRole}
                formData={formData} setFormData={setFormData}
                onSendOTP={handleSendOTP}
                isLoading={isLoading}
                error={error}
              />
            </>
          )}

          {step === 'otp' && (
            <OTPVerification
              email={formData.email}
              onVerify={handleVerifyOTP}
              onResend={handleResend}
              onBack={() => { setStep('form'); setError(''); }}
              isLoading={isLoading}
              error={error}
            />
          )}

        </div>
      </div>
    </div>
  );
}
