import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, BookOpen, Shield, AlertTriangle,
  Settings, GraduationCap, CheckCircle, Save, Trash2,
  Lock, Globe, Sun, Moon, Bell, BellOff, Award,
  Target, Clock, TrendingUp, Edit3, ChevronRight,
  Key, Layers, Sparkles, BarChart3, Zap, X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/* ─── constants ─── */
const BOARDS    = ['CBSE','RBSE','ICSE','UP Board','Maharashtra','Bihar','MP Board','Karnataka'];
const CLASSES   = ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];
const SUBJECTS  = ['Physics','Chemistry','Mathematics','Biology','English','Hindi','Social Science','Accountancy','Economics','Business Studies'];
const GOALS     = ['Just exploring','Regular practice (1-2h/day)','Serious prep (3-4h/day)','Exam warrior (5h+/day)'];

const roleGrad  = {
  student: 'linear-gradient(135deg,#7c3aed,#a855f7)',
  teacher: 'linear-gradient(135deg,#2354F4,#60a5fa)',
  admin:   'linear-gradient(135deg,#DC2626,#f97316)',
  school:  'linear-gradient(135deg,#059669,#34d399)',
};
const roleColor = {
  student: { bg:'rgba(124,58,237,0.12)', text:'#7c3aed' },
  teacher: { bg:'rgba(35,84,244,0.10)',  text:'#2354F4' },
  admin:   { bg:'rgba(220,38,38,0.10)',  text:'#DC2626' },
  school:  { bg:'rgba(5,150,105,0.10)',  text:'#059669' },
};

const fs  = (sz,fw=400,col='var(--text)') => ({ fontSize:sz, fontWeight:fw, color:col });
const row = { display:'flex', alignItems:'center', gap:'0.6rem' };
const col = { display:'flex', flexDirection:'column' };

/* ─── sub-components ─── */
function Field({ label, value, onChange, type='text', disabled, hint, textarea }) {
  const base = {
    width:'100%', padding:'0.7rem 1rem', borderRadius:12,
    border:'1px solid var(--border)', background: disabled ? 'var(--bg3)' : 'var(--bg2)',
    color: disabled ? 'var(--text3)' : 'var(--text)', fontSize:'0.9rem',
    fontFamily:"'DM Sans',sans-serif", outline:'none', transition:'border-color 0.2s',
    resize: textarea ? 'vertical' : undefined,
    minHeight: textarea ? 96 : undefined,
  };
  return (
    <div style={{ ...col, gap:'0.4rem' }}>
      <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>
      {hint && <span style={fs('0.72rem',400,'var(--text3)')}>{hint}</span>}
      {textarea
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} rows={3} style={base} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={base}
            onFocus={e=>{ if(!disabled) e.target.style.borderColor='#2354F4'; }}
            onBlur={e=>{ e.target.style.borderColor='var(--border)'; }} />
      }
    </div>
  );
}

function SectionBtn({ id, label, icon: Icon, active, accent, onClick }) {
  return (
    <button onClick={()=>onClick(id)} style={{
      display:'flex', alignItems:'center', gap:'0.7rem',
      width:'100%', padding:'0.7rem 0.9rem', borderRadius:12, border:'none',
      background: active ? (accent+'18') : 'transparent',
      color: active ? accent : 'var(--text2)',
      cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
      fontSize:'0.85rem', fontWeight: active ? 700 : 500,
      transition:'all 0.18s', textAlign:'left',
    }}
      onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='var(--bg3)'; e.currentTarget.style.color='var(--text)'; }}}
      onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)'; }}}
    >
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background: active ? (accent+'22') : 'var(--bg3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: active ? accent : 'var(--text3)',
        transition:'all 0.18s',
      }}>
        <Icon size={15} />
      </div>
      <span style={{ flex:1 }}>{label}</span>
      {active && <ChevronRight size={14} style={{ color: accent, opacity:0.7 }} />}
    </button>
  );
}

function SubjectChip({ label, active, onChange }) {
  return (
    <button onClick={()=>onChange(!active)} style={{
      padding:'0.4rem 0.85rem', borderRadius:100, border:'none',
      background: active ? 'rgba(35,84,244,0.14)' : 'var(--bg3)',
      color: active ? '#2354F4' : 'var(--text3)',
      fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem',
      fontWeight: active ? 700 : 500, cursor:'pointer',
      border: active ? '1.5px solid rgba(35,84,244,0.3)' : '1.5px solid var(--border)',
      transition:'all 0.18s',
    }}>
      {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{
      background:'var(--card-bg)', border:'1px solid var(--border)',
      borderRadius:14, padding:'1rem 1.2rem',
      display:'flex', alignItems:'center', gap:'0.9rem', flex:1,
    }}>
      <div style={{
        width:40, height:40, borderRadius:11, flexShrink:0,
        background: accent+'18', display:'flex', alignItems:'center', justifyContent:'center',
        color: accent,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={fs('1.3rem',800,'var(--text)')}>{value}</div>
        <div style={fs('0.72rem',500,'var(--text3)')}>{label}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ProfilePage({ user: userProp, onUpdate, role = 'student', setActiveTab }) {
  const { dark, setDark } = useTheme();
  const { language, changeLanguage } = useLanguage();

  /* ─ derive initial form data from user ─ */
  const init = () => {
    const u = userProp || {};
    const name = u.name || '';
    const parts = name.split(' ');
    return {
      firstName:    u.firstName || parts[0] || '',
      lastName:     u.lastName  || parts.slice(1).join(' ') || '',
      displayName:  u.displayName || name,
      phone:        u.phone || '',
      bio:          u.bio || '',
      institution:  u.institution || '',
      location:     u.location || '',
      board:        u.board || 'CBSE',
      className:    u.className || 'Class 10',
      subjects:     u.subjects || [],
      goal:         u.goal || GOALS[1],
      teachSubjects:u.teachSubjects || [],
      teachLevels:  u.teachLevels || [],
      notifTests:   u.notifTests !== false,
      notifUpdates: u.notifUpdates !== false,
      watermark:    u.watermark || name || 'QuesGen AI',
    };
  };

  const [section, setSection] = useState('personal');
  const [form, setForm] = useState(init);
  const [saved, setSaved] = useState(false);
  const [dangerAction, setDangerAction] = useState(null);
  const [dangerInput, setDangerInput] = useState('');
  const [stats, setStats] = useState({ tests: 0, questions: 0, streak: 0, avgScore: 0 });

  /* reload form when userProp changes */
  useEffect(() => { setForm(init()); }, [userProp]);

  /* load stats from localStorage */
  useEffect(() => {
    try {
      const email = userProp?.email;
      const key   = email ? `q_adaptive_history_${email}` : 'q_adaptive_history';
      const hist  = JSON.parse(localStorage.getItem(key) || '[]');
      const tests = hist.length;
      const questions = hist.reduce((a, h) => a + (h.total || 0), 0);
      const scores    = hist.map(h => h.score || 0);
      const avg       = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
      setStats({ tests, questions, streak: Math.min(tests, 7), avgScore: avg });
    } catch { /* ignore */ }
  }, [userProp]);

  const accent = roleColor[role]?.text || '#2354F4';

  const setF = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSubject = (key, sub) => {
    setForm(f => {
      const arr = f[key] || [];
      return { ...f, [key]: arr.includes(sub) ? arr.filter(s=>s!==sub) : [...arr, sub] };
    });
  };

  const handleSave = () => {
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ') || userProp?.name || '';
    const initials = ((form.firstName?.[0] || '') + (form.lastName?.[0] || '')).toUpperCase() || userProp?.initials || '??';
    const updated  = {
      ...userProp,
      ...form,
      name: fullName,
      initials,
      displayName: form.displayName || fullName,
    };
    localStorage.setItem('questra_user', JSON.stringify(updated));
    onUpdate?.(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDanger = (action) => {
    if (action === 'clearHistory') {
      const email = userProp?.email;
      const suffix = email ? `_${email}` : '';
      ['history','stats'].forEach(k => localStorage.removeItem(`q_adaptive_${k}${suffix}`));
      setDangerAction(null);
      setDangerInput('');
    } else if (action === 'clearAll') {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const sidebarSections = [
    { id:'personal',    label:'Personal Info',     icon: User           },
    { id:'academic',    label:'Academic Settings', icon: GraduationCap  },
    { id:'preferences', label:'Preferences',       icon: Settings       },
    { id:'security',    label:'Security & Privacy',icon: Shield         },
    { id:'danger',      label:'Danger Zone',       icon: AlertTriangle  },
  ];

  const joinDate = (() => {
    try {
      const d = new Date(userProp?.createdAt || Date.now() - 1000*60*60*24*30);
      return d.toLocaleDateString('en-US', { month:'long', year:'numeric' });
    } catch { return 'Recently'; }
  })();

  /* ══════════════════
     SECTION RENDERERS
  ══════════════════ */
  const renderPersonal = () => (
    <div style={{ ...col, gap:'1.4rem' }}>
      <div>
        <h3 style={fs('1.05rem',700,'var(--text)')}>Personal Information</h3>
        <p style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
          Update your personal details and public profile.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <Field label="First Name" value={form.firstName} onChange={setF('firstName')} />
        <Field label="Last Name"  value={form.lastName}  onChange={setF('lastName')}  />
      </div>
      <Field label="Display Name" value={form.displayName} onChange={setF('displayName')}
        hint="This is shown in your papers and reports." />
      <Field label="Email Address" value={userProp?.email || ''} onChange={()=>{}} disabled
        hint="Email cannot be changed. Contact support to update." />
      <Field label="Phone Number" value={form.phone} onChange={setF('phone')} type="tel" />
      <Field label="Bio / About You" value={form.bio} onChange={setF('bio')} textarea
        hint="A short intro about yourself (shown on your profile)." />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <Field label="Institution / School" value={form.institution} onChange={setF('institution')} />
        <Field label="City / Location"      value={form.location}    onChange={setF('location')}    />
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div style={{ ...col, gap:'1.4rem' }}>
      <div>
        <h3 style={fs('1.05rem',700,'var(--text)')}>Academic Settings</h3>
        <p style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
          Personalise your board, class, and subject preferences.
        </p>
      </div>

      {(role === 'student') && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ ...col, gap:'0.4rem' }}>
              <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Board</label>
              <select value={form.board} onChange={e=>setF('board')(e.target.value)}
                style={{ padding:'0.7rem 1rem', borderRadius:12, border:'1px solid var(--border)',
                  background:'var(--bg2)', color:'var(--text)', fontSize:'0.9rem',
                  fontFamily:"'DM Sans',sans-serif", outline:'none' }}>
                {BOARDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ ...col, gap:'0.4rem' }}>
              <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Class</label>
              <select value={form.className} onChange={e=>setF('className')(e.target.value)}
                style={{ padding:'0.7rem 1rem', borderRadius:12, border:'1px solid var(--border)',
                  background:'var(--bg2)', color:'var(--text)', fontSize:'0.9rem',
                  fontFamily:"'DM Sans',sans-serif", outline:'none' }}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...col, gap:'0.6rem' }}>
            <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Preferred Subjects</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {SUBJECTS.map(s => (
                <SubjectChip key={s} label={s} active={form.subjects.includes(s)}
                  onChange={v => toggleSubject('subjects', s)} />
              ))}
            </div>
          </div>

          <div style={{ ...col, gap:'0.6rem' }}>
            <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Study Goal</label>
            <div style={{ ...col, gap:'0.4rem' }}>
              {GOALS.map(g => (
                <label key={g} style={{
                  ...row, padding:'0.7rem 1rem', borderRadius:12, cursor:'pointer',
                  border:`1.5px solid ${form.goal===g ? 'rgba(35,84,244,0.4)' : 'var(--border)'}`,
                  background: form.goal===g ? 'rgba(35,84,244,0.06)' : 'var(--bg2)',
                  transition:'all 0.18s',
                }}>
                  <input type="radio" name="goal" value={g} checked={form.goal===g}
                    onChange={()=>setF('goal')(g)} style={{ accentColor:'#2354F4' }} />
                  <span style={fs('0.88rem', form.goal===g?700:400, form.goal===g?'#2354F4':'var(--text2)')}>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {(role === 'teacher') && (
        <>
          <div style={{ ...col, gap:'0.6rem' }}>
            <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Subjects You Teach</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {SUBJECTS.map(s => (
                <SubjectChip key={s} label={s} active={form.teachSubjects.includes(s)}
                  onChange={()=>toggleSubject('teachSubjects', s)} />
              ))}
            </div>
          </div>
          <div style={{ ...col, gap:'0.6rem' }}>
            <label style={{ ...fs('0.75rem',700,'var(--text3)'), textTransform:'uppercase', letterSpacing:'0.5px' }}>Grade Levels</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {CLASSES.slice(-4).map(c => (
                <SubjectChip key={c} label={c} active={form.teachLevels.includes(c)}
                  onChange={()=>toggleSubject('teachLevels', c)} />
              ))}
            </div>
          </div>
        </>
      )}

      {(role === 'admin' || role === 'school') && (
        <Field label="Organisation / School Name" value={form.institution} onChange={setF('institution')} />
      )}
    </div>
  );

  const renderPreferences = () => (
    <div style={{ ...col, gap:'1.4rem' }}>
      <div>
        <h3 style={fs('1.05rem',700,'var(--text)')}>App Preferences</h3>
        <p style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
          Control how QuesGen looks and behaves for you.
        </p>
      </div>

      {/* Theme */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem' }}>
        <div style={{ ...row, justifyContent:'space-between' }}>
          <div style={{ ...row }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(35,84,244,0.1)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#2354F4' }}>
              {dark ? <Moon size={17}/> : <Sun size={17}/>}
            </div>
            <div>
              <div style={fs('0.9rem',700,'var(--text)')}>Appearance</div>
              <div style={fs('0.75rem',400,'var(--text3)')}>{dark ? 'Dark mode active' : 'Light mode active'}</div>
            </div>
          </div>
          {/* Toggle */}
          <button onClick={()=>setDark(!dark)} style={{
            width:52, height:28, borderRadius:100, border:'none', cursor:'pointer',
            background: dark ? '#2354F4' : 'var(--bg3)',
            border:'2px solid var(--border)',
            position:'relative', transition:'background 0.25s',
          }}>
            <motion.div animate={{ x: dark ? 24 : 2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
              style={{ width:20, height:20, borderRadius:'50%', background:'#fff',
                position:'absolute', top:'50%', marginTop:-10, boxShadow:'0 2px 6px rgba(0,0,0,0.25)' }} />
          </button>
        </div>

        <div style={{ height:1, background:'var(--border)', margin:'1rem 0' }} />

        <div style={{ ...row }}>
          <div style={{ display:'flex', gap:'0.5rem', flex:1 }}>
            {[
              { label:'Light',    value: false, icon: Sun  },
              { label:'Dark',     value: true,  icon: Moon },
            ].map(t => (
              <button key={t.label} onClick={()=>setDark(t.value)} style={{
                flex:1, padding:'0.6rem', borderRadius:10, border:'none', cursor:'pointer',
                background: dark===t.value ? (dark?'rgba(35,84,244,0.15)':'rgba(35,84,244,0.08)') : 'var(--bg3)',
                color: dark===t.value ? '#2354F4' : 'var(--text3)',
                fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', fontWeight: dark===t.value?700:500,
                border: dark===t.value ? '1.5px solid rgba(35,84,244,0.3)' : '1.5px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
                transition:'all 0.18s',
              }}>
                <t.icon size={14}/> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Language */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem' }}>
        <div style={{ ...row, marginBottom:'0.75rem' }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'rgba(124,58,237,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#7C3AED' }}>
            <Globe size={17}/>
          </div>
          <div>
            <div style={fs('0.9rem',700,'var(--text)')}>Language</div>
            <div style={fs('0.75rem',400,'var(--text3)')}>App interface language</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {[{ code:'en', flag:'🇺🇸', label:'English'}, { code:'hi', flag:'🇮🇳', label:'हिंदी'}].map(l => (
            <button key={l.code} onClick={()=>changeLanguage(l.code)} style={{
              flex:1, padding:'0.65rem', borderRadius:10, border:'none', cursor:'pointer',
              background: language===l.code ? 'rgba(124,58,237,0.1)' : 'var(--bg3)',
              color: language===l.code ? '#7C3AED' : 'var(--text3)',
              fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight: language===l.code?700:500,
              border: language===l.code ? '1.5px solid rgba(124,58,237,0.3)' : '1.5px solid var(--border)',
              transition:'all 0.18s',
            }}>
              {l.flag} {l.label} {language===l.code && '✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', ...col, gap:'0.85rem' }}>
        <div style={{ ...row }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'rgba(16,185,129,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#10B981' }}>
            <Bell size={17}/>
          </div>
          <div>
            <div style={fs('0.9rem',700,'var(--text)')}>Notifications</div>
            <div style={fs('0.75rem',400,'var(--text3)')}>Manage what you receive</div>
          </div>
        </div>
        {[
          { key:'notifTests',   label:'Test reminders & results',  desc:'Get notified when your adaptive test is ready' },
          { key:'notifUpdates', label:'Platform updates & tips',   desc:'New features, tips, and improvements' },
        ].map(n => (
          <label key={n.key} style={{
            ...row, justifyContent:'space-between', padding:'0.75rem', borderRadius:12,
            background:'var(--bg3)', cursor:'pointer',
          }}>
            <div>
              <div style={fs('0.85rem',600,'var(--text)')}>{n.label}</div>
              <div style={fs('0.72rem',400,'var(--text3)')}>{n.desc}</div>
            </div>
            <button onClick={()=>setF(n.key)(!form[n.key])} style={{
              width:44, height:24, borderRadius:100, border:'none', cursor:'pointer', flexShrink:0,
              background: form[n.key] ? '#10B981' : 'var(--bg3)',
              border:`2px solid ${form[n.key] ? '#10B981' : 'var(--border)'}`,
              position:'relative', transition:'background 0.25s',
            }}>
              <motion.div animate={{ x: form[n.key] ? 20 : 2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
                style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:'50%', marginTop:-8, boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
          </label>
        ))}
      </div>

      {/* Paper watermark */}
      <Field label="Paper Watermark / Author Name"
        value={form.watermark} onChange={setF('watermark')}
        hint="This name appears on printed and downloaded exam papers." />
    </div>
  );

  const renderSecurity = () => (
    <div style={{ ...col, gap:'1.4rem' }}>
      <div>
        <h3 style={fs('1.05rem',700,'var(--text)')}>Security & Privacy</h3>
        <p style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
          Your account security and connected services.
        </p>
      </div>

      {/* Email */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem' }}>
        <div style={{ ...row, marginBottom:'0.6rem' }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'rgba(35,84,244,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#2354F4' }}>
            <Mail size={17}/>
          </div>
          <div>
            <div style={fs('0.9rem',700,'var(--text)')}>Email Address</div>
            <div style={fs('0.75rem',400,'var(--text3)')}>Your login identifier</div>
          </div>
          <div style={{ marginLeft:'auto', ...row, gap:'0.4rem' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#10B981' }} />
            <span style={fs('0.72rem',700,'#10B981')}>Verified</span>
          </div>
        </div>
        <div style={{
          padding:'0.7rem 1rem', borderRadius:10, background:'var(--bg3)',
          border:'1px solid var(--border)', ...row, gap:'0.5rem',
        }}>
          <Lock size={14} style={{ color:'var(--text3)', flexShrink:0 }} />
          <span style={fs('0.9rem',500,'var(--text)')}>{userProp?.email || 'Not set'}</span>
        </div>
      </div>

      {/* Connected Accounts */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', ...col, gap:'0.9rem' }}>
        <div style={{ ...row }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'rgba(234,67,53,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#EA4335' }}>
            <Key size={17}/>
          </div>
          <div>
            <div style={fs('0.9rem',700,'var(--text)')}>Connected Accounts</div>
            <div style={fs('0.75rem',400,'var(--text3)')}>Third-party login services</div>
          </div>
        </div>
        <div style={{
          ...row, justifyContent:'space-between', padding:'0.75rem 1rem',
          background:'var(--bg3)', borderRadius:12, border:'1px solid var(--border)',
        }}>
          <div style={{ ...row, gap:'0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <div>
              <div style={fs('0.88rem',700,'var(--text)')}>Google</div>
              <div style={fs('0.72rem',400,'var(--text3)')}>
                {userProp?.googleConnected || userProp?.sub ? 'Connected' : 'Sign in with Google enabled'}
              </div>
            </div>
          </div>
          <div style={{
            padding:'0.25rem 0.7rem', borderRadius:8,
            background:'rgba(16,185,129,0.1)', color:'#10B981',
            fontSize:'0.72rem', fontWeight:800, letterSpacing:'0.5px',
          }}>ACTIVE</div>
        </div>
      </div>

      {/* Session */}
      <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', ...col, gap:'0.6rem' }}>
        <div style={{ ...row }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'rgba(245,158,11,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#F59E0B' }}>
            <Clock size={17}/>
          </div>
          <div>
            <div style={fs('0.9rem',700,'var(--text)')}>Current Session</div>
            <div style={fs('0.75rem',400,'var(--text3)')}>Active login information</div>
          </div>
        </div>
        <div style={{ ...col, gap:'0.5rem' }}>
          {[
            { label:'Role',       value: role?.charAt(0).toUpperCase()+role?.slice(1) },
            { label:'Member since', value: joinDate },
            { label:'Last active', value: 'Just now' },
          ].map(r => (
            <div key={r.label} style={{ ...row, justifyContent:'space-between',
              padding:'0.5rem 0', borderBottom:'1px solid var(--border)' }}>
              <span style={fs('0.82rem',500,'var(--text3)')}>{r.label}</span>
              <span style={fs('0.82rem',600,'var(--text)')}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDanger = () => (
    <div style={{ ...col, gap:'1.4rem' }}>
      <div>
        <h3 style={{ ...fs('1.05rem',700,'#ef4444') }}>Danger Zone</h3>
        <p style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
          Irreversible actions. Proceed with caution.
        </p>
      </div>

      {[
        {
          id:'clearHistory',
          title:'Clear Test History',
          desc:'Remove all your adaptive test history, scores, and weak-area analytics. Your account and settings remain intact.',
          btnLabel:'Clear History',
          color:'#F59E0B',
          confirm: 'CLEAR',
        },
        {
          id:'clearAll',
          title:'Delete All Data & Sign Out',
          desc:'Wipes all locally stored data, preferences, and signs you out. This cannot be undone.',
          btnLabel:'Delete Everything',
          color:'#EF4444',
          confirm: 'DELETE',
        },
      ].map(a => (
        <div key={a.id} style={{
          background:'var(--card-bg)', border:`1px solid ${a.color}28`,
          borderRadius:16, padding:'1.2rem', ...col, gap:'0.85rem',
        }}>
          <div style={{ ...row, gap:'0.75rem' }}>
            <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
              background:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center',
              color: a.color }}>
              <AlertTriangle size={17}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={fs('0.9rem',700,'var(--text)')}>{a.title}</div>
              <div style={{ ...fs('0.78rem',400,'var(--text3)'), marginTop:'0.2rem', lineHeight:1.5 }}>{a.desc}</div>
            </div>
          </div>

          {dangerAction === a.id ? (
            <div style={{ ...col, gap:'0.6rem' }}>
              <p style={fs('0.8rem',600,'var(--text2)')}>
                Type <strong style={{ color:a.color }}>{a.confirm}</strong> to confirm:
              </p>
              <div style={{ ...row }}>
                <input
                  value={dangerInput}
                  onChange={e => setDangerInput(e.target.value)}
                  placeholder={a.confirm}
                  style={{
                    flex:1, padding:'0.6rem 0.85rem', borderRadius:10,
                    border:`1.5px solid ${dangerInput===a.confirm ? a.color : 'var(--border)'}`,
                    background:'var(--bg2)', color:'var(--text)',
                    fontSize:'0.88rem', fontFamily:"'DM Sans',sans-serif", outline:'none',
                  }}
                />
                <button onClick={()=>{ setDangerAction(null); setDangerInput(''); }}
                  style={{ padding:'0.6rem 0.9rem', borderRadius:10, border:'1px solid var(--border)',
                    background:'var(--bg3)', color:'var(--text3)', cursor:'pointer',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem' }}>
                  Cancel
                </button>
                <button
                  disabled={dangerInput !== a.confirm}
                  onClick={()=>handleDanger(a.id)}
                  style={{
                    padding:'0.6rem 1rem', borderRadius:10, border:'none', cursor: dangerInput===a.confirm ? 'pointer' : 'not-allowed',
                    background: dangerInput===a.confirm ? a.color : 'var(--bg3)',
                    color: dangerInput===a.confirm ? '#fff' : 'var(--text3)',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem', fontWeight:700,
                    transition:'all 0.18s',
                  }}>
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <button onClick={()=>{ setDangerAction(a.id); setDangerInput(''); }} style={{
              alignSelf:'flex-start', padding:'0.55rem 1.1rem', borderRadius:10, border:`1.5px solid ${a.color}40`,
              background:`${a.color}0d`, color: a.color,
              fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem', fontWeight:700, cursor:'pointer',
              transition:'all 0.18s',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${a.color}20`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=`${a.color}0d`; }}
            >
              {a.btnLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderSection = () => {
    switch(section) {
      case 'personal':    return renderPersonal();
      case 'academic':    return renderAcademic();
      case 'preferences': return renderPreferences();
      case 'security':    return renderSecurity();
      case 'danger':      return renderDanger();
      default:            return renderPersonal();
    }
  };

  const showSave = section !== 'security' && section !== 'danger';

  /* ═══ RENDER ═══ */
  return (
    <div className="fade-in" style={{ ...col, gap:'2rem', paddingBottom:'3rem' }}>

      {/* ── Profile Hero Card ── */}
      <div style={{
        background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:20,
        overflow:'hidden', position:'relative',
      }}>
        {/* gradient banner */}
        <div style={{
          height:110,
          background: roleGrad[role] || 'linear-gradient(135deg,#2354F4,#7c3aed)',
          opacity:0.18, position:'absolute', top:0, left:0, right:0,
        }} />
        <div style={{
          height:110,
          background:`linear-gradient(135deg, ${accent}22, transparent)`,
          position:'absolute', top:0, left:0, right:0,
        }} />

        <div style={{ padding:'1.5rem 2rem 1.8rem', position:'relative' }}>
          {/* Avatar row */}
          <div style={{ ...row, alignItems:'flex-end', gap:'1.4rem', marginBottom:'1.2rem' }}>
            <div style={{
              width:88, height:88, borderRadius:24, flexShrink:0,
              background: roleGrad[role] || 'linear-gradient(135deg,#2354F4,#7c3aed)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, color:'#fff', fontSize:'1.9rem',
              boxShadow:`0 8px 28px ${accent}55`,
              border:'4px solid var(--card-bg)',
              marginTop:48,
            }}>
              {userProp?.initials || '??'}
            </div>
            <div style={{ flex:1, marginBottom:4 }}>
              <div style={{ ...row, gap:'0.6rem', flexWrap:'wrap', alignItems:'center' }}>
                <h2 style={{ ...fs('1.4rem',800,'var(--text)'), lineHeight:1.2 }}>
                  {userProp?.name || 'Your Name'}
                </h2>
                <span style={{
                  padding:'0.2rem 0.65rem', borderRadius:8,
                  fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.6px',
                  textTransform:'uppercase',
                  background: roleColor[role]?.bg || 'rgba(99,102,241,0.1)',
                  color: roleColor[role]?.text || '#6366f1',
                  border:`1px solid ${(roleColor[role]?.text || '#6366f1')}28`,
                  display:'inline-flex', alignItems:'center', gap:'0.3rem',
                }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', flexShrink:0 }} />
                  {role?.charAt(0).toUpperCase()+role?.slice(1)}
                </span>
              </div>
              <div style={{ ...fs('0.82rem',400,'var(--text3)'), marginTop:'0.25rem' }}>
                {userProp?.email}
              </div>
              {form.bio && (
                <div style={{ ...fs('0.85rem',400,'var(--text2)'), marginTop:'0.4rem', maxWidth:480, lineHeight:1.6 }}>
                  {form.bio}
                </div>
              )}
            </div>
            <button
              onClick={() => setSection('personal')}
              style={{
                ...row, gap:'0.4rem', padding:'0.5rem 1rem', borderRadius:10,
                background:'var(--bg3)', border:'1px solid var(--border)',
                color:'var(--text2)', cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', fontWeight:600,
                transition:'all 0.18s', alignSelf:'flex-start', marginTop:52,
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#2354F4'; e.currentTarget.style.color='#2354F4'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)'; }}
            >
              <Edit3 size={13}/> Edit Profile
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <StatCard icon={Target}    label="Tests Taken"   value={stats.tests}        accent="#2354F4" />
            <StatCard icon={Zap}       label="Questions Done" value={stats.questions}   accent="#7C3AED" />
            <StatCard icon={TrendingUp} label="Avg Score"    value={`${stats.avgScore}%`} accent="#10B981" />
            <StatCard icon={Award}     label="Day Streak"    value={`${stats.streak}d`}  accent="#F59E0B" />
          </div>
        </div>
      </div>

      {/* ── Content Grid: Sidebar + Panel ── */}
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1.5rem', alignItems:'start' }}>

        {/* Sidebar */}
        <div style={{
          background:'var(--card-bg)', border:'1px solid var(--border)',
          borderRadius:18, padding:'0.6rem', ...col, gap:'0.2rem',
          position:'sticky', top:80,
        }}>
          {sidebarSections.map(s => (
            <SectionBtn key={s.id} {...s}
              active={section===s.id}
              accent={s.id==='danger' ? '#ef4444' : accent}
              onClick={setSection}
            />
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:18, padding:'1.8rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0  }}
              exit={{    opacity:0, y:-8  }}
              transition={{ duration:0.2 }}
            >
              {renderSection()}

              {/* Save bar */}
              {showSave && (
                <div style={{
                  ...row, justifyContent:'flex-end', gap:'0.75rem',
                  marginTop:'2rem', paddingTop:'1.5rem',
                  borderTop:'1px solid var(--border)',
                }}>
                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                        style={{ ...row, gap:'0.4rem', color:'#10B981', fontSize:'0.85rem', fontWeight:600 }}
                      >
                        <CheckCircle size={16}/> Saved!
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button onClick={()=>setForm(init())} className="btn-secondary" style={{ padding:'0.6rem 1.3rem', fontSize:'0.85rem' }}>
                    Reset
                  </button>
                  <button onClick={handleSave} className="btn-primary" style={{ padding:'0.6rem 1.4rem', fontSize:'0.85rem', gap:'0.4rem' }}>
                    <Save size={15}/> Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
