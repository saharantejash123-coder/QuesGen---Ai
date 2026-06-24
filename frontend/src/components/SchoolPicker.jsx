import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, Users, GraduationCap, Check, X } from 'lucide-react';
import { searchSchools } from '../services/schoolService';

/**
 * Search-and-select for real, registered schools.
 * Students/teachers can only pick a school that actually exists on the platform.
 *
 * props:
 *   selected   — currently chosen school object (or null)
 *   onSelect   — (school|null) => void
 *   dark       — use the dark auth palette (default light/token palette)
 *   placeholder
 */
export default function SchoolPicker({ selected, onSelect, dark = false, placeholder = 'Search your school by name or code…' }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => { setResults(searchSchools(q)); }, [q, open]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const c = dark ? darkTheme : lightTheme;

  const pick = (school) => { onSelect?.(school); setOpen(false); setQ(''); };

  // ── Selected state ──
  if (selected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.85rem 1rem', borderRadius: 12, border: `1px solid ${c.selBorder}`, background: c.selBg }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Building2 size={18} color={c.accent} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.name}</div>
          <div style={{ fontSize: '0.72rem', color: c.text3, marginTop: 1 }}>
            Code {selected.code}{selected.city ? ` · ${selected.city}` : ''}
          </div>
        </div>
        <button type="button" onClick={() => onSelect?.(null)} aria-label="Change school"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text3, display: 'flex', padding: 4 }}>
          <X size={16} />
        </button>
      </div>
    );
  }

  // ── Search state ──
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: c.text3, pointerEvents: 'none' }} />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.3rem', borderRadius: 12, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text, fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50, maxHeight: 260, overflowY: 'auto', borderRadius: 12, border: `1px solid ${c.border}`, background: c.menuBg, boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}>
          {results.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: c.text3 }}>
              {q.trim() ? `No school matches "${q.trim()}".` : 'No schools are registered yet.'}
              <div style={{ fontSize: '0.72rem', color: c.text3, marginTop: 4, opacity: 0.8 }}>You can only join a school that exists on QuesGen.</div>
            </div>
          ) : (
            results.map((s) => (
              <button
                type="button" key={s.email || s.name} onClick={() => pick(s)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', background: 'none', border: 'none', borderBottom: `1px solid ${c.divider}`, cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => e.currentTarget.style.background = c.hover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={16} color={c.accent} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: '0.7rem', marginTop: 2, fontSize: '0.7rem', color: c.text3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Code {s.code}</span>
                    {s.city && <span>· {s.city}</span>}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><GraduationCap size={11} /> {s.studentCount}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Users size={11} /> {s.teacherCount}</span>
                  </div>
                </div>
                <Check size={15} color={c.accent} style={{ opacity: 0, flexShrink: 0 }} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const lightTheme = {
  accent: '#2354F4', text: 'var(--text)', text3: 'var(--text3)',
  border: 'var(--border)', inputBg: 'var(--bg2)', menuBg: 'var(--card-bg)',
  divider: 'var(--border)', hover: 'var(--bg3)', iconBg: 'rgba(35,84,244,0.1)',
  selBg: 'rgba(5,150,105,0.06)', selBorder: 'rgba(5,150,105,0.3)',
};
const darkTheme = {
  accent: '#818cf8', text: '#fff', text3: 'rgba(255,255,255,0.45)',
  border: 'rgba(255,255,255,0.1)', inputBg: 'rgba(255,255,255,0.04)', menuBg: '#0d1326',
  divider: 'rgba(255,255,255,0.06)', hover: 'rgba(255,255,255,0.05)', iconBg: 'rgba(129,140,248,0.14)',
  selBg: 'rgba(129,140,248,0.08)', selBorder: 'rgba(129,140,248,0.35)',
};
