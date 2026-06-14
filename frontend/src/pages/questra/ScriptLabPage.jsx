import { useState, useRef, useCallback } from 'react';
import { GEMINI_API_KEY } from '../../data/oracleData';

/* ── Gemini Vision API call ── */
const analyzeHandwriting = async (apiKey, base64Image, mimeType, sessionHistory = []) => {
  const prevFixes = sessionHistory.map((s, i) => `Session ${i + 1}: ${s.fix}`).join('\n');

  const prompt = `You are a friendly, encouraging handwriting coach for school students (Class 9–12).

Look at this image carefully.

STEP 1 — Is this a handwriting/writing image?
Check if the image contains handwritten text (letters, words, sentences, notes, answers).
If it does NOT contain any handwriting (e.g. it's a blank page, a photo of a person, a landscape, a diagram without text, a printed document, etc.) — respond with exactly:
{"isWriting": false}

STEP 2 — If it IS a handwriting image, analyze it and give ONE tiny, kind improvement.
Rules:
- Give ONLY ONE improvement per session — the single most impactful thing to fix
- Make it extremely easy and achievable (a student should be able to do it in their next 3 lines of writing)
- Be gentle, warm, and encouraging — NEVER discouraging
- The fix must be a specific, actionable micro-habit (not vague like "write better")
- Avoid repeating these already given fixes: ${prevFixes || 'none yet'}
- Score the handwriting honestly across 4 dimensions (0-100)

Return as raw JSON (NO markdown):
{
  "isWriting": true,
  "overallMessage": "One warm sentence of encouragement about their handwriting (find something genuinely good)",
  "scores": {
    "legibility": 72,
    "consistency": 58,
    "spacing": 65,
    "pressure": 80
  },
  "fix": {
    "area": "Letter Spacing",
    "priority": "Easy Win",
    "issue": "One sentence describing exactly what was noticed (specific, not vague)",
    "action": "One sentence: the exact tiny habit to practise in the next writing session",
    "encouragement": "One warm closing sentence reminding them that small steps add up"
  }
}`;

  const MODELS = ['gemini-2.5-flash', 'gemini-flash-lite-latest'];
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await sleep(1500);
    try {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Image } }] }],
          generationConfig: { temperature: 0.4 },
        }),
      });

      clearTimeout(timeout);
      const data = await response.json();
      if (data.error) continue;

      let s = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!s) continue;
      if (s.startsWith('```json')) s = s.slice(7).replace(/```\s*$/, '').trim();
      else if (s.startsWith('```')) s = s.slice(3).replace(/```\s*$/, '').trim();
      return JSON.parse(s.trim());
    } catch {
      // try next model
    }
  }

  throw new Error('AI is temporarily overloaded. Please wait a moment and try again.');
};

/* ── localStorage helpers ── */
const STORE_KEY = 'scriptlab_history';
const loadHistory = () => {
  try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : []; } catch (e) { console.error('History load failed', e); return []; }
};
const saveHistory = (h) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(h)); } catch (e) { console.error('Failed to save history', e); }
};

/* ── Score bar ── */
const ScoreBar = ({ label, value, color }) => (
  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '.75rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
      <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</span>
      <span style={{ fontSize: '.8rem', fontWeight: 800, color }}>{value}%</span>
    </div>
    <div style={{ height: 5, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', borderRadius: 10, background: color, transition: 'width 1.2s ease' }} />
    </div>
  </div>
);

/* ── Priority badge colors ── */
const priorityColor = p => {
  if (p === 'Easy Win') return { bg: 'rgba(16,185,129,.12)', color: '#10B981' };
  if (p === 'Medium') return { bg: 'rgba(245,158,11,.12)', color: '#F59E0B' };
  return { bg: 'rgba(124,58,237,.12)', color: '#7C3AED' };
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function ScriptLabPage() {
  const [phase, setPhase] = useState('upload');   // upload | analyzing | result | not-writing
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const [sessionNum, setSessionNum] = useState(() => loadHistory().length + 1);
  const fileRef = useRef();

  // state is initialized lazily in useState, no need for effect

  /* ── Convert file to base64 ── */
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  /* ── Handle image upload and analyze ── */
  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setError('');

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setPhase('analyzing');

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await analyzeHandwriting(GEMINI_API_KEY, base64, mimeType, history);

      if (!res.isWriting) {
        setPhase('not-writing');
        return;
      }

      setResult(res);
      setPhase('result');
    } catch (e) {
      setError(`❌ ${e.message}`);
      setPhase('upload');
    }
  }, [history]);

  /* ── Mark done and move to next session ── */
  const markDone = () => {
    if (!result) return;
    const entry = {
      session: sessionNum,
      fix: result.fix.area,
      scores: result.scores,
      timestamp: new Date().toISOString(),
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    saveHistory(newHistory);
    setSessionNum(s => s + 1);
    setResult(null);
    setImagePreview(null);
    setPhase('upload');
  };

  /* ── Delete all history ── */
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to delete all session history? This cannot be undone.')) {
      setHistory([]);
      saveHistory([]);
      setSessionNum(1);
      setResult(null);
      setImagePreview(null);
      setPhase('upload');
    }
  };

  /* ── Score color ── */
  const scoreColor = v => v >= 75 ? '#10B981' : v >= 55 ? '#F59E0B' : '#F87171';

  /* ── Avg overall score ── */
  const avgScore = result
    ? Math.round(Object.values(result.scores).reduce((a, b) => a + b, 0) / 4)
    : 0;

  return (
    <div className="page-enter" style={{ paddingTop: 80 }}>

      {/* ── HERO ── */}
      <section style={{ padding: '3.5rem 5% 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div className="tag tag-a">✍️ Script-Lab — AI Handwriting Coach</div>
        <div className="scriptlab-hero-grid">
          <div>
            <h1 className="st" style={{ marginBottom: '.8rem' }}>
              One tiny fix.<br /><em>Every session.</em>
            </h1>
            <p className="ss">
              Upload a photo of your handwriting — QuesGen AI reads it and gives you
              <strong style={{ color: '#FCD34D' }}> the single smallest change</strong> that makes the biggest difference.
              No overwhelming lists. Just one easy habit at a time.
            </p>
            <div style={{
              marginTop: '1.2rem', padding: '.9rem 1.1rem', background: 'rgba(217,119,6,.06)',
              border: '1px solid rgba(217,119,6,.15)', borderRadius: 12
            }}>
              <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#FCD34D', letterSpacing: '1px', marginBottom: '.3rem' }}>
                💡 WHY ONE FIX AT A TIME?
              </div>
              <p style={{ fontSize: '.82rem', color: 'var(--text3)', lineHeight: 1.65, margin: 0 }}>
                One focused micro-habit leads to 87% retention after 30 days. Trying to fix everything at once leads to 0%.
              </p>
            </div>
          </div>

          {/* Session counter */}
          <div style={{
            textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '1.5rem 2rem', minWidth: 140
          }}>
            <div style={{
              fontSize: '3rem', fontWeight: 800, fontFamily: "'Instrument Serif',serif",
              color: '#FCD34D', lineHeight: 1
            }}>
              {sessionNum}
            </div>
            <div style={{
              fontSize: '.7rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.5px', marginTop: '.3rem'
            }}>
              Session
            </div>
            {history.length > 0 && (
              <div style={{ marginTop: '.8rem', fontSize: '.72rem', color: '#10B981', fontWeight: 700 }}>
                {history.length} done ✓
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN PANEL ── */}
      <section style={{ padding: '0 5% 5rem', maxWidth: 1100, margin: '0 auto' }}>

        {/* Tab bar */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid var(--border)', padding: '0 1.5rem', display: 'flex', gap: '1.5rem' }}>
            {['upload', 'progress'].map(t => (
              <button key={t} onClick={() => setPhase(t)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '.9rem 0',
                  fontSize: '.82rem', fontWeight: 600,
                  color: (phase === t || (phase === 'result' && t === 'upload') || (phase === 'analyzing' && t === 'upload') || (phase === 'not-writing' && t === 'upload')) ? 'var(--text)' : 'var(--text3)',
                  borderBottom: (phase === t || (phase === 'result' && t === 'upload') || (phase === 'analyzing' && t === 'upload') || (phase === 'not-writing' && t === 'upload')) ? '2px solid #D97706' : '2px solid transparent',
                  transition: 'color .2s', fontFamily: "'DM Sans',sans-serif"
                }}>
                {t === 'upload' ? '📷 Upload & Analyse' : '📈 My Progress'}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>

            {/* ══ UPLOAD ══ */}
            {(phase === 'upload' || phase === 'not-writing') && (
              <div className="fade-in">
                {/* NOT a writing image warning */}
                {phase === 'not-writing' && (
                  <div style={{
                    marginBottom: '1.5rem', padding: '1.2rem 1.5rem', borderRadius: 14,
                    background: 'rgba(245,158,11,.08)', border: '2px dashed rgba(245,158,11,.4)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>📝</div>
                    <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '1rem', marginBottom: '.4rem' }}>
                      Please upload a handwriting page
                    </div>
                    <p style={{ fontSize: '.85rem', color: 'var(--text3)', margin: 0 }}>
                      The image you uploaded doesn't appear to contain handwritten text.<br />
                      Try a photo of your notebook, answer sheet, or any page where you've written by hand.
                    </p>
                  </div>
                )}

                <div className="scriptlab-upload-grid">
                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? '#D97706' : 'rgba(255,255,255,.12)'}`,
                      borderRadius: 16, padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer',
                      transition: 'all .2s', background: dragOver ? 'rgba(217,119,6,.05)' : 'transparent',
                      minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: '.8rem'
                    }}>
                    <div style={{ fontSize: '3rem' }}>📷</div>
                    <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: '.95rem' }}>
                      Drop your handwriting photo here
                    </div>
                    <div style={{ fontSize: '.78rem', color: 'var(--text3)' }}>
                      JPG · PNG · HEIC · phone camera is perfectly fine
                    </div>
                    <div style={{
                      background: 'rgba(217,119,6,.12)', border: '1px solid rgba(217,119,6,.3)',
                      borderRadius: 8, padding: '.5rem 1.2rem', fontSize: '.8rem', color: '#FCD34D', fontWeight: 600
                    }}>
                      Choose File
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => handleFile(e.target.files[0])} />
                  </div>

                  {/* Tips panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
                    <div style={{
                      fontSize: '.7rem', fontWeight: 700, color: 'var(--text3)',
                      textTransform: 'uppercase', letterSpacing: '.5px'
                    }}>
                      Tips for best results
                    </div>
                    {[
                      { emoji: '☀️', tip: 'Good lighting — natural daylight works best' },
                      { emoji: '📐', tip: 'Keep the page flat, not at an angle' },
                      { emoji: '✍️', tip: 'A full line or two of writing is enough' },
                      { emoji: '🔍', tip: 'Make sure the text is clearly visible' },
                    ].map((t, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '.8rem',
                        padding: '.75rem', background: 'var(--bg3)', border: '1px solid var(--border)',
                        borderRadius: 12
                      }}>
                        <span style={{ fontSize: '1.3rem' }}>{t.emoji}</span>
                        <span style={{ fontSize: '.83rem', color: 'var(--text2)' }}>{t.tip}</span>
                      </div>
                    ))}

                    {error && (
                      <div style={{
                        padding: '.8rem', borderRadius: 10, background: 'rgba(239,68,68,.08)',
                        border: '1px solid rgba(239,68,68,.2)', color: '#F87171', fontSize: '.82rem'
                      }}>
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══ ANALYZING ══ */}
            {phase === 'analyzing' && (
              <div className="fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 2rem' }}>
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(217,119,6,.2)', borderRadius: '50%' }} />
                  <div style={{
                    position: 'absolute', inset: 0, border: '3px solid transparent',
                    borderTopColor: '#D97706', borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  <div style={{
                    position: 'absolute', inset: '10px', border: '2px solid transparent',
                    borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1.5s linear infinite reverse'
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '2rem'
                  }}>✍️</div>
                </div>
                <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.4rem', color: 'var(--text)', marginBottom: '.5rem' }}>
                  QuesGen is reading your handwriting…
                </h3>
                <p style={{ color: 'var(--text3)', fontSize: '.87rem', marginBottom: '2rem' }}>
                  Checking spacing, baseline, letter size, and pressure
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', maxWidth: 280, margin: '0 auto' }}>
                  {['Detecting handwriting…', 'Measuring consistency…', 'Finding your one fix…'].map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '.6rem',
                      fontSize: '.78rem', color: 'var(--text3)'
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', background: '#D97706',
                        animation: `pulse ${1 + i * 0.3}s infinite`
                      }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ RESULT ══ */}
            {phase === 'result' && result && (
              <div className="fade-in">
                <div className="scriptlab-result-grid">

                  {/* Left: image + scores */}
                  <div>
                    <div style={{
                      fontSize: '.7rem', fontWeight: 700, color: 'var(--text3)',
                      textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.7rem'
                    }}>
                      Your Writing · Session {sessionNum}
                    </div>

                    {/* Image preview */}
                    {imagePreview && (
                      <div style={{
                        borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(217,119,6,.3)',
                        marginBottom: '1rem', maxHeight: 220, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', background: 'var(--bg3)'
                      }}>
                        <img src={imagePreview} alt="Your handwriting" style={{
                          width: '100%', maxHeight: 220,
                          objectFit: 'contain'
                        }} />
                      </div>
                    )}

                    {/* Overall score pill */}
                    <div style={{
                      textAlign: 'center', padding: '1rem', marginBottom: '1rem',
                      background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14
                    }}>
                      <div style={{
                        fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Instrument Serif',serif",
                        color: scoreColor(avgScore)
                      }}>
                        {avgScore}%
                      </div>
                      <div style={{
                        fontSize: '.7rem', color: 'var(--text3)', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '.5px'
                      }}>
                        Overall Score
                      </div>
                      <p style={{ fontSize: '.8rem', color: 'var(--text2)', marginTop: '.5rem', lineHeight: 1.5 }}>
                        {result.overallMessage}
                      </p>
                    </div>

                    {/* Scores */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
                      {Object.entries(result.scores).map(([k, v]) => (
                        <ScoreBar key={k} label={k} value={v} color={scoreColor(v)} />
                      ))}
                    </div>
                  </div>

                  {/* Right: the ONE fix */}
                  <div>
                    <div style={{
                      fontSize: '.7rem', fontWeight: 700, color: 'var(--text3)',
                      textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.7rem'
                    }}>
                      Your One Fix — Session {sessionNum}
                    </div>

                    <div style={{
                      background: 'rgba(217,119,6,.05)', border: '1px solid rgba(217,119,6,.25)',
                      borderRadius: 16, padding: '1.5rem', marginBottom: '1rem'
                    }}>

                      {/* Area header */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        marginBottom: '1.2rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FCD34D' }}>
                            {result.fix.area}
                          </div>
                          <div style={{ marginTop: '.4rem' }}>
                            <span style={{
                              fontSize: '.65rem', fontWeight: 700, padding: '.2rem .6rem',
                              borderRadius: 100, ...priorityColor(result.fix.priority)
                            }}>
                              {result.fix.priority}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: '2rem' }}>🎯</span>
                      </div>

                      {/* What was noticed */}
                      <div style={{
                        background: 'var(--bg3)', borderRadius: 10, padding: '.9rem',
                        marginBottom: '.9rem'
                      }}>
                        <div style={{
                          fontSize: '.65rem', fontWeight: 700, color: 'var(--text3)',
                          textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.35rem'
                        }}>
                          📍 What I noticed
                        </div>
                        <p style={{ fontSize: '.85rem', color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>
                          {result.fix.issue}
                        </p>
                      </div>

                      {/* The action */}
                      <div style={{
                        background: 'rgba(217,119,6,.1)', border: '1px solid rgba(217,119,6,.25)',
                        borderRadius: 10, padding: '.9rem', marginBottom: '.9rem'
                      }}>
                        <div style={{
                          fontSize: '.65rem', fontWeight: 700, color: '#FCD34D',
                          textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.35rem'
                        }}>
                          ✅ Your action today
                        </div>
                        <p style={{
                          fontSize: '.88rem', color: 'var(--text)', margin: 0, lineHeight: 1.65,
                          fontWeight: 500
                        }}>
                          {result.fix.action}
                        </p>
                      </div>

                      {/* Encouragement */}
                      <p style={{
                        fontSize: '.82rem', color: 'var(--text3)', margin: 0, lineHeight: 1.6,
                        fontStyle: 'italic'
                      }}>
                        💬 {result.fix.encouragement}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                      <button onClick={markDone}
                        style={{
                          padding: '1rem', borderRadius: 12, border: 'none', cursor: 'pointer',
                          background: 'linear-gradient(135deg,#D97706,#FCD34D)', color: '#1a0a00',
                          fontWeight: 700, fontSize: '.92rem', fontFamily: "'DM Sans',sans-serif",
                          boxShadow: '0 4px 16px rgba(217,119,6,.3)', transition: 'all .2s'
                        }}>
                        ✓ Got it — Mark Done & Next Session →
                      </button>
                      <button onClick={() => { setImagePreview(null); setPhase('upload'); }}
                        style={{
                          padding: '.75rem', borderRadius: 12, border: '1px solid var(--border)',
                          background: 'var(--bg3)', cursor: 'pointer', color: 'var(--text3)',
                          fontWeight: 600, fontSize: '.85rem', fontFamily: "'DM Sans',sans-serif"
                        }}>
                        Upload a different photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PROGRESS ══ */}
            {phase === 'progress' && (
              <div className="fade-in">
                {history.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    border: '1px dashed var(--border)', borderRadius: 14
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                    <h3 style={{ color: 'var(--text)', fontWeight: 700, marginBottom: '.5rem' }}>
                      No sessions yet
                    </h3>
                    <p style={{ color: 'var(--text3)', fontSize: '.88rem' }}>
                      Upload your first handwriting photo to start your improvement journey.
                    </p>
                    <button onClick={() => setPhase('upload')}
                      style={{
                        marginTop: '1rem', padding: '.75rem 1.5rem', borderRadius: 10,
                        border: 'none', background: '#D97706', color: '#fff', fontWeight: 700,
                        cursor: 'pointer', fontSize: '.85rem'
                      }}>
                      Upload Now →
                    </button>
                  </div>
                ) : (
                  <div className="scriptlab-hist-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                      {history.map((h, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: '.9rem', alignItems: 'center',
                          padding: '1rem', background: 'var(--bg3)',
                          border: '1px solid var(--border)', borderRadius: 12
                        }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '.75rem', fontWeight: 800, color: '#10B981', flexShrink: 0
                          }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', marginBottom: '.3rem'
                            }}>
                              <span style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--text)' }}>
                                {h.fix}
                              </span>
                              <span style={{ fontSize: '.7rem', color: 'var(--text3)' }}>
                                {new Date(h.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {h.scores && (
                              <div style={{ height: 4, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{
                                  width: `${Math.round(Object.values(h.scores).reduce((a, b) => a + b, 0) / 4)}%`,
                                  height: '100%', background: 'linear-gradient(90deg,#D97706,#FCD34D)',
                                  borderRadius: 10, transition: 'width 1s'
                                }} />
                              </div>
                            )}
                          </div>
                          <span style={{
                            fontSize: '.75rem', fontWeight: 700, color: '#10B981',
                            padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(16,185,129,.1)'
                          }}>
                            ✓ Done
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary card */}
                    <div style={{
                      background: 'rgba(217,119,6,.06)', border: '1px solid rgba(217,119,6,.2)',
                      borderRadius: 18, padding: '1.5rem', textAlign: 'center', minWidth: 160
                    }}>
                      <div style={{
                        fontSize: '3rem', fontWeight: 800, fontFamily: "'Instrument Serif',serif",
                        color: '#FCD34D', lineHeight: 1
                      }}>
                        {history.length}
                      </div>
                      <div style={{
                        fontSize: '.72rem', color: 'var(--text3)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '.5px', marginTop: '.3rem'
                      }}>
                        Sessions Done
                      </div>
                      <div style={{ margin: '1rem 0', height: 1, background: 'var(--border)' }} />
                      <p style={{ fontSize: '.8rem', color: 'var(--text3)', lineHeight: 1.6, margin: 0 }}>
                        {history.length >= 5
                          ? '🌟 Amazing consistency! Your writing is visibly improving.'
                          : `Keep going! ${5 - history.length} more sessions to build your first habit.`}
                      </p>
                      <button onClick={() => setPhase('upload')}
                        style={{
                          marginTop: '1rem', width: '100%', padding: '.65rem', borderRadius: 10,
                          border: 'none', background: '#D97706', color: '#fff', fontWeight: 700,
                          cursor: 'pointer', fontSize: '.8rem', fontFamily: "'DM Sans',sans-serif"
                        }}>
                        Next Session →
                      </button>
                      <button onClick={clearHistory}
                        style={{
                          marginTop: '.6rem', width: '100%', padding: '.65rem', borderRadius: 10,
                          border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.05)',
                          color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '.75rem',
                          fontFamily: "'DM Sans',sans-serif", transition: 'all .2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,.05)'}>
                        🗑️ Delete All Sessions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
