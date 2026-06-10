import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Target, CheckCircle, AlertCircle, RefreshCw, BarChart3, XCircle,
  Trophy, BookOpen, Clock, ChevronLeft, ChevronRight, Zap, Award,
  TrendingUp, Flag, Sparkles, Plus, Brain, AlertTriangle
} from 'lucide-react';
import { generateAdaptiveQuestionsWithLLM } from '../../services/llmService';
import { GEMINI_API_KEY } from '../../data/oracleData';

/* ── CONFIG ── */
const boards   = ['CBSE','RBSE','ICSE','UP Board','Maharashtra','Bihar','MP Board','Karnataka'];
const allClasses = ['Class 9','Class 10','Class 11','Class 12'];
const subjects = ['Physics','Chemistry','Mathematics','Biology','English','Hindi','Social Science'];
const chaptersMap = {
  English:         ['Tenses','Vocabulary','Literature','Grammar','Comprehension'],
  Mathematics:     ['Algebra','Geometry','Trigonometry','Statistics','Number Systems','Coordinate Geometry'],
  Physics:         ['Mechanics','Optics','Thermodynamics','Electromagnetism','Sound','Light'],
  Chemistry:       ['Organic Chemistry','Inorganic Chemistry','Physical Chemistry','Acids & Bases','Metals & Non-metals'],
  Biology:         ['Genetics','Ecology','Human Physiology','Cell Biology','Plant Biology'],
  Hindi:           ['व्याकरण','कविता','कहानी','पत्र लेखन','अपठित गद्यांश'],
  'Social Science':['History','Geography','Civics','Economics'],
};

/* ── Score Ring SVG ── */
const ScoreRing = ({ pct, size = 140 }) => {
  const r = size / 2 - 10, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
  const col = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#F87171';
  return (
    <svg width={size} height={size} style={{ margin: '0 auto', display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.5s ease' }}/>
      <text x="50%" y="46%" textAnchor="middle"
        style={{ fontSize: '2rem', fontWeight: 800, fill: col, fontFamily: "'Instrument Serif',serif" }}>
        {Math.round(pct)}%
      </text>
      <text x="50%" y="62%" textAnchor="middle"
        style={{ fontSize: '.7rem', fontWeight: 600, fill: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Score
      </text>
    </svg>
  );
};

/* ── AI Loading Screen ── */
const AILoadingScreen = ({ stage }) => {
  const stages = [
    { label: 'Connecting to QuesGen AI…',        done: stage > 0 },
    { label: 'Analysing your weak areas…',       done: stage > 1 },
    { label: 'Generating fresh questions…',      done: stage > 2 },
    { label: 'Validating answer accuracy…',      done: stage > 3 },
  ];
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',padding:'4rem 2rem',textAlign:'center' }}>
      <div style={{ position:'relative',width:80,height:80,marginBottom:'2rem' }}>
        <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:'4px solid rgba(124,58,237,.2)' }}/>
        <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:'4px solid #7C3AED',
          borderTopColor:'transparent',animation:'spin 1s linear infinite' }}/>
        <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Brain style={{ width:32,height:32,color:'#7C3AED',animation:'pulse 2s infinite' }}/>
        </div>
      </div>
      <h2 style={{ fontSize:'1.3rem',fontWeight:700,color:'var(--text)',marginBottom:'.5rem' }}>
        Generating Your AI Test
      </h2>
      <p style={{ fontSize:'.85rem',color:'var(--text3)',marginBottom:'2rem' }}>
        QuesGen AI is crafting unique questions just for you…
      </p>
      <div style={{ display:'flex',flexDirection:'column',gap:'.6rem',width:'100%',maxWidth:300 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
            fontSize:'.8rem',color: s.done ? 'var(--text2)' : i === stage ? 'var(--text)' : 'var(--text3)',
            fontWeight: i === stage ? 600 : 400 }}>
            <span>{s.label}</span>
            {s.done
              ? <CheckCircle style={{ width:14,height:14,color:'#10B981' }}/>
              : i === stage
                ? <RefreshCw style={{ width:14,height:14,color:'#7C3AED',animation:'spin 1s linear infinite' }}/>
                : <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid var(--border)' }}/>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Helpers ── */
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const uid = () => Math.random().toString(36).slice(2,8);
const pill = { fontSize:'.62rem',fontWeight:700,padding:'.2rem .5rem',borderRadius:100 };
const labelStyle = {
  fontSize:'.65rem',fontWeight:700,color:'var(--text3)',letterSpacing:'.5px',
  display:'block',marginBottom:'.3rem',textTransform:'uppercase'
};
const filterStyle = {
  width:'100%',padding:'.65rem .9rem',borderRadius:10,
  border:'1px solid var(--border)',background:'var(--bg3)',
  color:'var(--text)',fontSize:'.85rem',cursor:'pointer'
};

/* ── localStorage helpers ── */
const getStorageKey = suffix => {
  try {
    const user = JSON.parse(localStorage.getItem('questra_user'));
    return user?.email ? `q_adaptive_${suffix}_${user.email}` : `q_adaptive_${suffix}`;
  } catch { return `q_adaptive_${suffix}`; }
};
const loadData = key => {
  try { const v = localStorage.getItem(getStorageKey(key)); return v ? JSON.parse(v) : null; }
  catch { return null; }
};
const saveData = (key, val) => {
  try { localStorage.setItem(getStorageKey(key), JSON.stringify(val)); } catch {}
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const AdaptiveTesting = () => {
  const [board, setBoard]   = useState('CBSE');
  const [cls, setCls]       = useState('Class 10');
  const [subj, setSubj]     = useState('Physics');
  const [chapter, setChapter] = useState('All Chapters');
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit]       = useState(10);

  const [phase, setPhase]   = useState('setup');   // setup | loading | test | results
  const [loadStage, setLoadStage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});
  const [flagged, setFlagged]     = useState(new Set());
  const [qi, setQi]     = useState(0);
  const [timer, setTimer] = useState(600);
  const [results, setResults]   = useState(null);
  const [weakAreas, setWeakAreas] = useState({});
  const [history, setHistory]   = useState([]);
  const [error, setError]       = useState('');
  const [showReview, setShowReview] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const timerRef = useRef(null);

  /* ── Load persisted data ── */
  useEffect(() => {
    const wa = loadData('stats'); if (wa) setWeakAreas(wa);
    const h  = loadData('history'); if (h) setHistory(h);
  }, []);

  /* ── Timer ── */
  useEffect(() => {
    if (phase === 'test') {
      timerRef.current = setInterval(() => setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      }), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  /* ─────────────────────────────────────────────────
     GENERATE TEST via Gemini API
  ───────────────────────────────────────────────── */
  const generateTest = useCallback(async () => {
    setError('');
    setPhase('loading');
    setLoadStage(0);

    const targetChapter = chapter === 'All Chapters'
      ? (chaptersMap[subj] || ['General'])[Math.floor(Math.random() * (chaptersMap[subj]?.length || 1))]
      : chapter;

    try {
      // Animate loading stages
      await new Promise(r => setTimeout(r, 600));  setLoadStage(1);
      await new Promise(r => setTimeout(r, 500));  setLoadStage(2);

      const qs = await generateAdaptiveQuestionsWithLLM(GEMINI_API_KEY, {
        board,
        cls,
        subject: subj,
        chapter: targetChapter,
        count:   numQuestions,
        weakAreas,
        sessionSeed: uid(),           // ensures every run is unique
      });

      setLoadStage(3);
      await new Promise(r => setTimeout(r, 400));  setLoadStage(4);

      setQuestions(qs);
      setAnswers({});
      setFlagged(new Set());
      setQi(0);
      setTimer(timeLimit * 60);
      setResults(null);
      setShowReview(false);
      setPhase('test');
    } catch (e) {
      setError(`❌ AI Error: ${e.message}`);
      setPhase('setup');
    }
  }, [board, cls, subj, chapter, numQuestions, timeLimit, weakAreas]);

  /* ─────────────────────────────────────────────────
     LOAD MORE questions on the same topic (mid-test)
  ───────────────────────────────────────────────── */
  const loadMoreQuestions = useCallback(async () => {
    setLoadingMore(true);
    try {
      const currentChapter = questions[0]?.chapter || (chaptersMap[subj]?.[0] || subj);
      const extra = await generateAdaptiveQuestionsWithLLM(GEMINI_API_KEY, {
        board, cls, subject: subj,
        chapter: currentChapter,
        count: 5,
        weakAreas,
        sessionSeed: uid(),
      });
      setQuestions(prev => [...prev, ...extra]);
    } catch (e) {
      // silently ignore — user can try again
    }
    setLoadingMore(false);
  }, [board, cls, subj, questions, weakAreas]);

  /* ─────────────────────────────────────────────────
     SUBMIT TEST
  ───────────────────────────────────────────────── */
  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    let score = 0;
    const chapRes = {};

    questions.forEach(q => {
      const ok = answers[q.id] === q.answer;
      if (ok) score++;
      if (!chapRes[q.chapter]) chapRes[q.chapter] = { total: 0, correct: 0 };
      chapRes[q.chapter].total++;
      if (ok) chapRes[q.chapter].correct++;
    });

    const pct = questions.length ? (score / questions.length) * 100 : 0;
    const r = {
      score, total: questions.length, percentage: pct,
      chapterBreakdown: chapRes,
      timestamp: new Date().toISOString(),
      subject: subj, board, cls,
      timeSpent: (timeLimit * 60) - timer,
      aiGenerated: true,
    };

    // Update weak areas with weighted rolling average
    const wa = { ...weakAreas };
    Object.entries(chapRes).forEach(([ch, { correct, total }]) => {
      const cs = (correct / total) * 100;
      wa[ch] = wa[ch] !== undefined ? Math.round(wa[ch] * 0.4 + cs * 0.6) : Math.round(cs);
    });
    setWeakAreas(wa);
    saveData('stats', wa);

    const nh = [...history, r].slice(-30);
    setHistory(nh);
    saveData('history', nh);

    setResults(r);
    setPhase('results');
  }, [answers, questions, weakAreas, history, subj, board, cls, timer, timeLimit]);

  const toggleFlag = id => setFlagged(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const q            = questions[qi];
  const answered     = Object.keys(answers).length;
  const timerDanger  = timer < 60;

  /* ──────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────── */
  return (
    <div className="fade-in" style={{ padding: '5rem 5% 2rem', maxWidth: 960, margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div className="tag tag-v">🎯 ADAPTIVE TESTING ENGINE · Powered by QuesGen AI</div>
        <h1 className="st">Adaptive Testing</h1>
        <p className="ss" style={{ margin: '.8rem auto 0', maxWidth: 640 }}>
          QuesGen AI generates fresh, unique MCQ questions every time — no hard-coded banks.
          Questions adapt to your weak areas and never repeat.
        </p>
      </div>

      {/* ══ SETUP ══ */}
      {phase === 'setup' && (
        <div>
          <div className="card" style={{ padding: '2.5rem', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:4,
              background:'linear-gradient(90deg,#7C3AED,#2354F4,#0891B2)' }}/>

            <div style={{ display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'2rem' }}>
              <div style={{ width:44,height:44,borderRadius:12,
                background:'linear-gradient(135deg,rgba(124,58,237,.15),rgba(35,84,244,.1))',
                display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Sparkles style={{ width:22,height:22,color:'#7C3AED' }}/>
              </div>
              <div>
                <h2 style={{ fontSize:'1.1rem',fontWeight:700,color:'var(--text)',margin:0 }}>Configure Your AI Test</h2>
                <p style={{ fontSize:'.75rem',color:'var(--text3)',margin:0 }}>
                  QuesGen will generate unique questions each time — never the same paper twice
                </p>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem' }}>
              {[
                { l:'Board',        v:board,        fn:setBoard,                       opts:boards },
                { l:'Class',        v:cls,          fn:setCls,                         opts:allClasses },
                { l:'Subject',      v:subj,         fn:v=>{ setSubj(v); setChapter('All Chapters'); }, opts:subjects },
                { l:'Chapter',      v:chapter,      fn:setChapter,                     opts:['All Chapters',...(chaptersMap[subj]||[])] },
                { l:'Questions',    v:numQuestions, fn:v=>setNumQuestions(Number(v)),  opts:[5,10,15,20] },
                { l:'Time (min)',   v:timeLimit,    fn:v=>setTimeLimit(Number(v)),     opts:[5,10,15,20,30,60] },
              ].map(f => (
                <div key={f.l}>
                  <label style={labelStyle}>{f.l}</label>
                  <select value={f.v} onChange={e=>f.fn(e.target.value)} style={filterStyle}>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Info chips */}
            <div style={{ display:'flex',gap:'.8rem',flexWrap:'wrap',marginBottom:'2rem' }}>
              {[
                { icon:<Brain style={{width:14,height:14}}/>,       t:'QuesGen AI Generated' },
                { icon:<RefreshCw style={{width:14,height:14}}/>,   t:'Unique Every Run' },
                { icon:<Zap style={{width:14,height:14}}/>,         t:'Adapts to Weak Areas' },
                { icon:<TrendingUp style={{width:14,height:14}}/>,  t:'Performance Tracked' },
              ].map((b,i) => (
                <div key={i} style={{ display:'flex',alignItems:'center',gap:'.4rem',padding:'.4rem .75rem',
                  borderRadius:8,background:'var(--bg3)',border:'1px solid var(--border)',
                  fontSize:'.72rem',fontWeight:600,color:'var(--text3)' }}>
                  {b.icon}{b.t}
                </div>
              ))}
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ marginBottom:'1.5rem',padding:'.9rem 1.2rem',borderRadius:10,
                background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',
                color:'#EF4444',fontSize:'.85rem',display:'flex',alignItems:'center',gap:'.6rem' }}>
                <AlertTriangle style={{width:16,height:16,flexShrink:0}}/>
                {error}
              </div>
            )}

            <button onClick={generateTest} className="btn-p" style={{
              width:'100%',padding:'1rem',fontSize:'1rem',justifyContent:'center',
              background:'linear-gradient(135deg,#7C3AED,#2354F4)',
              boxShadow:'0 4px 20px rgba(124,58,237,.3)'
            }}>
              <Sparkles style={{width:18,height:18}}/> Generate AI Adaptive Test →
            </button>
          </div>

          {/* Performance Map */}
          {Object.keys(weakAreas).length > 0 && (
            <div className="card" style={{ padding:'1.5rem',marginTop:'1.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem' }}>
                <BarChart3 style={{ width:18,height:18,color:'var(--accent)' }}/>
                <span style={{ fontWeight:700,fontSize:'.9rem',color:'var(--text)' }}>Your Performance Map</span>
                <span style={{ marginLeft:'auto',fontSize:'.65rem',color:'var(--text3)' }}>
                  AI uses this to weight questions toward weak areas
                </span>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'.8rem' }}>
                {Object.entries(weakAreas).map(([ch, sc]) => (
                  <div key={ch} style={{ background:'var(--bg3)',padding:'.8rem',borderRadius:12,border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'.65rem',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'.3rem' }}>{ch}</div>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <span style={{ fontWeight:700,color:sc<50?'#F87171':sc<70?'#F59E0B':'#10B981' }}>{Math.round(sc)}%</span>
                      {sc < 50  && <span style={{...pill,background:'rgba(248,113,113,.1)',color:'#F87171'}}>Weak</span>}
                      {sc>=50&&sc<70&&<span style={{...pill,background:'rgba(245,158,11,.1)',color:'#F59E0B'}}>Fair</span>}
                      {sc >= 70 && <span style={{...pill,background:'rgba(16,185,129,.1)',color:'#10B981'}}>Strong</span>}
                    </div>
                    <div style={{ height:3,width:'100%',background:'var(--border)',borderRadius:10,marginTop:'.5rem',overflow:'hidden' }}>
                      <div style={{ width:`${sc}%`,height:'100%',borderRadius:10,
                        background:sc<50?'#F87171':sc<70?'#F59E0B':'#10B981',transition:'width .5s' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card" style={{ padding:'1.5rem',marginTop:'1.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem' }}>
                <Trophy style={{ width:18,height:18,color:'#F59E0B' }}/>
                <span style={{ fontWeight:700,fontSize:'.9rem',color:'var(--text)' }}>Recent Tests</span>
                <span style={{ marginLeft:'auto',fontSize:'.65rem',color:'var(--text3)' }}>{history.length} tests taken</span>
              </div>
              <div style={{ display:'flex',gap:'.7rem',overflowX:'auto',paddingBottom:'.5rem' }}>
                {history.slice(-8).reverse().map((h, i) => (
                  <div key={i} style={{ minWidth:120,background:'var(--bg3)',padding:'.8rem',borderRadius:12,
                    border:'1px solid var(--border)',textAlign:'center',flexShrink:0 }}>
                    <div style={{ fontSize:'1.3rem',fontWeight:800,fontFamily:"'Instrument Serif',serif",
                      color:h.percentage>=80?'#10B981':h.percentage>=50?'#F59E0B':'#F87171' }}>
                      {h.score}/{h.total}
                    </div>
                    <div style={{ fontSize:'.6rem',color:'var(--text3)',marginTop:'.2rem',fontWeight:600 }}>{h.subject}</div>
                    <div style={{ fontSize:'.55rem',color:'var(--text3)',marginTop:'.1rem' }}>
                      {new Date(h.timestamp).toLocaleDateString()}
                    </div>
                    {h.aiGenerated && (
                      <div style={{ fontSize:'.52rem',color:'#7C3AED',marginTop:'.2rem',fontWeight:700 }}>✦ AI</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ LOADING ══ */}
      {phase === 'loading' && (
        <div className="card fade-in" style={{ padding:'1rem' }}>
          <AILoadingScreen stage={loadStage}/>
        </div>
      )}

      {/* ══ TEST ══ */}
      {phase === 'test' && q && (
        <div className="fade-in">
          {/* Sticky Top Bar */}
          <div className="card" style={{ padding:'1rem 1.5rem',marginBottom:'1.5rem',display:'flex',
            alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',
            position:'sticky',top:70,zIndex:50 }}>
            <div style={{ display:'flex',alignItems:'center',gap:'.6rem' }}>
              <Clock style={{ width:18,height:18,color:timerDanger?'#F87171':'var(--accent)' }}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:'1.1rem',
                color:timerDanger?'#F87171':'var(--text)',animation:timerDanger?'pulse 1s infinite':'' }}>
                {fmt(timer)}
              </span>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'.8rem' }}>
              <span style={{ fontSize:'.78rem',fontWeight:600,color:'var(--text3)' }}>
                {answered}/{questions.length} answered
              </span>
              <div style={{ height:6,width:120,background:'var(--border)',borderRadius:10,overflow:'hidden' }}>
                <div style={{ width:`${(answered/questions.length)*100}%`,height:'100%',
                  background:'var(--accent)',transition:'width .3s',borderRadius:10 }}/>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-p" style={{
              padding:'.5rem 1.2rem',fontSize:'.78rem',
              background:answered===questions.length?'linear-gradient(135deg,#10B981,#059669)':'rgba(124,58,237,.2)',
              color:answered===questions.length?'#fff':'var(--text3)'
            }}>Submit Test</button>
          </div>

          {/* Question Dots */}
          <div style={{ display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1.5rem',justifyContent:'center' }}>
            {questions.map((_, i) => {
              const isAns = !!answers[questions[i].id];
              const isCur = i === qi;
              const isFlg = flagged.has(questions[i].id);
              return (
                <button key={i} onClick={() => setQi(i)} style={{
                  width:36,height:36,borderRadius:10,cursor:'pointer',position:'relative',
                  border:isCur?'2px solid var(--accent)':'1px solid var(--border)',
                  background:isAns?'rgba(16,185,129,.12)':isCur?'rgba(35,84,244,.08)':'var(--bg3)',
                  color:isAns?'#10B981':isCur?'var(--accent)':'var(--text3)',
                  fontSize:'.78rem',fontWeight:700,transition:'all .2s'
                }}>
                  {i+1}
                  {isFlg && <div style={{ position:'absolute',top:-2,right:-2,width:8,height:8,
                    borderRadius:'50%',background:'#F59E0B' }}/>}
                </button>
              );
            })}
            {/* Load More button */}
            <button onClick={loadMoreQuestions} disabled={loadingMore} style={{
              width:36,height:36,borderRadius:10,border:'1px dashed var(--accent)',
              background:'transparent',color:'var(--accent)',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',
              opacity:loadingMore?.5:1,transition:'all .2s'
            }} title="Load 5 more questions">
              {loadingMore
                ? <RefreshCw style={{width:14,height:14,animation:'spin 1s linear infinite'}}/>
                : <Plus style={{width:14,height:14}}/>}
            </button>
          </div>

          {/* Current Question */}
          <div className="card" style={{ padding:'2rem',marginBottom:'1.5rem' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'.8rem' }}>
                <span style={{ width:36,height:36,background:'linear-gradient(135deg,rgba(124,58,237,.15),rgba(35,84,244,.1))',
                  borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:'.95rem',fontWeight:800,color:'#7C3AED' }}>{qi+1}</span>
                <div>
                  <div style={{ fontSize:'.62rem',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.5px' }}>
                    {q.chapter}
                  </div>
                  <div style={{ display:'flex',gap:'.3rem',marginTop:'.15rem' }}>
                    {[1,2,3].map(d => (
                      <div key={d} style={{ width:16,height:3,borderRadius:2,
                        background:d<=q.difficulty?'#7C3AED':'var(--border)' }}/>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:'.6rem' }}>
                <span style={{ fontSize:'.65rem',fontWeight:600,color:'var(--text3)',
                  padding:'.2rem .5rem',borderRadius:6,background:'rgba(124,58,237,.08)',color:'#7C3AED' }}>
                  ✦ AI Generated
                </span>
                <button onClick={() => toggleFlag(q.id)} style={{ background:'none',border:'none',cursor:'pointer',padding:'.3rem' }}>
                  <Flag style={{ width:18,height:18,color:flagged.has(q.id)?'#F59E0B':'var(--text3)',
                    fill:flagged.has(q.id)?'#F59E0B':'none' }}/>
                </button>
              </div>
            </div>

            <p style={{ fontSize:'1.1rem',color:'var(--text)',marginBottom:'2rem',fontWeight:500,lineHeight:1.6 }}>
              {q.text}
            </p>

            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem' }}>
              {q.options.map((opt, oi) => {
                const sel = answers[q.id] === opt;
                const letter = String.fromCharCode(65+oi);
                return (
                  <button key={opt} onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))} style={{
                    padding:'1rem',borderRadius:14,cursor:'pointer',textAlign:'left',transition:'all .2s',
                    border:sel?'2px solid var(--accent)':'1px solid var(--border)',
                    background:sel?'rgba(35,84,244,.06)':'var(--bg3)',
                    display:'flex',alignItems:'center',gap:'.8rem'
                  }}>
                    <span style={{ width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',
                      justifyContent:'center',fontSize:'.75rem',fontWeight:700,flexShrink:0,
                      background:sel?'var(--accent)':'var(--border)',
                      color:sel?'#fff':'var(--text3)',transition:'all .2s' }}>{letter}</span>
                    <span style={{ fontSize:'.88rem',fontWeight:sel?600:400,color:sel?'var(--text)':'var(--text2)' }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Buttons */}
          <div style={{ display:'flex',justifyContent:'space-between',gap:'1rem' }}>
            <button onClick={() => setQi(i => Math.max(0,i-1))} disabled={qi===0} className="btn-g"
              style={{ padding:'.8rem 1.5rem',display:'flex',alignItems:'center',gap:'.4rem',opacity:qi===0?.4:1 }}>
              <ChevronLeft style={{width:18,height:18}}/> Previous
            </button>
            {qi < questions.length-1 ? (
              <button onClick={() => setQi(i => i+1)} className="btn-p"
                style={{ padding:'.8rem 1.5rem',display:'flex',alignItems:'center',gap:'.4rem' }}>
                Next <ChevronRight style={{width:18,height:18}}/>
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-p"
                style={{ padding:'.8rem 1.5rem',background:'linear-gradient(135deg,#10B981,#059669)',
                  boxShadow:'0 4px 16px rgba(16,185,129,.3)' }}>
                ✓ Submit Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase === 'results' && results && (
        <div className="fade-in">
          <div className="card" style={{ padding:'3rem 2rem',textAlign:'center',
            background:'linear-gradient(135deg,rgba(124,58,237,.04),rgba(35,84,244,.04))',
            marginBottom:'2rem',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:4,
              background:results.percentage>=80?'linear-gradient(90deg,#10B981,#059669)'
                :results.percentage>=50?'linear-gradient(90deg,#F59E0B,#D97706)'
                :'linear-gradient(90deg,#F87171,#EF4444)' }}/>

            <div style={{ marginBottom:'1.5rem' }}>
              {results.percentage>=80
                ? <Award style={{width:56,height:56,color:'#10B981',margin:'0 auto .5rem'}}/>
                : results.percentage>=50
                  ? <AlertCircle style={{width:56,height:56,color:'#F59E0B',margin:'0 auto .5rem'}}/>
                  : <XCircle style={{width:56,height:56,color:'#F87171',margin:'0 auto .5rem'}}/>}
            </div>

            <ScoreRing pct={results.percentage}/>

            <h2 style={{ fontSize:'1.3rem',fontWeight:700,color:'var(--text)',margin:'1.5rem 0 .5rem' }}>
              {results.score} out of {results.total} correct
            </h2>
            <p style={{ fontSize:'.9rem',color:'var(--text2)',marginBottom:'.5rem' }}>
              {results.percentage>=80
                ? '🎉 Outstanding! You\'ve mastered this area.'
                : results.percentage>=50
                  ? '👍 Good effort! A few more rounds will sharpen you.'
                  : '💪 Keep going! QuesGen will focus on your weak areas next time.'}
            </p>

            <div style={{ display:'flex',gap:'.6rem',justifyContent:'center',flexWrap:'wrap',marginBottom:'2rem',marginTop:'1rem' }}>
              <span style={{...pill,background:'rgba(124,58,237,.08)',color:'#7C3AED'}}>⏱ {fmt(results.timeSpent)} spent</span>
              <span style={{...pill,background:'rgba(35,84,244,.08)',color:'#2354F4'}}>{subj}</span>
              <span style={{...pill,background:'rgba(8,145,178,.08)',color:'#0891B2'}}>{results.total} Questions</span>
              <span style={{...pill,background:'rgba(124,58,237,.08)',color:'#7C3AED'}}>✦ AI Generated</span>
            </div>

            {/* Chapter Breakdown */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'1rem',marginBottom:'2rem',textAlign:'left' }}>
              {Object.entries(results.chapterBreakdown).map(([ch, { correct, total }]) => {
                const p = Math.round((correct/total)*100);
                return (
                  <div key={ch} style={{ background:'var(--bg3)',padding:'1rem',borderRadius:14,border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'.62rem',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'.4rem' }}>{ch}</div>
                    <div style={{ fontWeight:800,fontSize:'1.1rem',color:p<50?'#F87171':p<70?'#F59E0B':'#10B981' }}>{correct}/{total}</div>
                    <div style={{ height:3,width:'100%',background:'var(--border)',borderRadius:10,marginTop:'.5rem',overflow:'hidden' }}>
                      <div style={{ width:`${p}%`,height:'100%',borderRadius:10,
                        background:p<50?'#F87171':p<70?'#F59E0B':'#10B981',transition:'width .8s' }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display:'flex',gap:'.8rem',justifyContent:'center',flexWrap:'wrap' }}>
              <button onClick={generateTest} className="btn-p" style={{ padding:'.8rem 1.8rem' }}>
                <Sparkles style={{width:16,height:16}}/> New AI Test
              </button>
              <button onClick={() => setShowReview(!showReview)} className="btn-g"
                style={{ padding:'.8rem 1.8rem',display:'flex',alignItems:'center',gap:'.4rem' }}>
                <BookOpen style={{width:16,height:16}}/> {showReview?'Hide':'Review'} Answers
              </button>
              <button onClick={() => { setPhase('setup'); setResults(null); setShowReview(false); }} className="btn-g"
                style={{ padding:'.8rem 1.8rem' }}>
                Setup
              </button>
            </div>
          </div>

          {/* Answer Review with AI Explanations */}
          {showReview && (
            <div className="fade-in" style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
              <h3 style={{ fontSize:'1rem',fontWeight:700,color:'var(--text)',display:'flex',alignItems:'center',gap:'.5rem' }}>
                <BookOpen style={{width:20,height:20,color:'var(--accent)'}}/> Detailed Answer Review
                <span style={{ fontSize:'.7rem',fontWeight:600,color:'#7C3AED',padding:'.2rem .5rem',
                  borderRadius:6,background:'rgba(124,58,237,.08)',marginLeft:'.5rem' }}>✦ AI Explanations</span>
              </h3>
              {questions.map((q, idx) => {
                const ua = answers[q.id];
                const ok = ua === q.answer;
                return (
                  <div key={q.id} className="card"
                    style={{ padding:'1.5rem',borderLeft:`4px solid ${ok?'#10B981':'#F87171'}` }}>
                    <div style={{ display:'flex',gap:'.8rem',alignItems:'flex-start' }}>
                      <span style={{ width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',
                        justifyContent:'center',fontSize:'.85rem',fontWeight:700,flexShrink:0,
                        background:ok?'rgba(16,185,129,.1)':'rgba(248,113,113,.1)',
                        color:ok?'#10B981':'#F87171' }}>{ok?'✓':'✗'}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'.65rem',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'.3rem' }}>
                          {q.chapter} · Q{idx+1}
                        </div>
                        <p style={{ fontSize:'.92rem',color:'var(--text)',marginBottom:'1rem',fontWeight:500 }}>{q.text}</p>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',marginBottom:q.explanation?'1rem':0 }}>
                          {q.options.map(opt => {
                            const isAns = opt === q.answer;
                            const isWrong = opt === ua && !ok;
                            return (
                              <div key={opt} style={{ padding:'.6rem .8rem',borderRadius:10,fontSize:'.82rem',
                                fontWeight:isAns||isWrong?600:400,
                                border:isAns?'2px solid #10B981':isWrong?'2px solid #F87171':'1px solid var(--border)',
                                background:isAns?'rgba(16,185,129,.06)':isWrong?'rgba(248,113,113,.06)':'var(--bg3)',
                                color:isAns?'#10B981':isWrong?'#F87171':'var(--text2)' }}>
                                {isAns&&'✓ '}{isWrong&&'✗ '}{opt}
                              </div>
                            );
                          })}
                        </div>
                        {/* AI Explanation */}
                        {q.explanation && (
                          <div style={{ padding:'.75rem 1rem',borderRadius:10,
                            background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.15)' }}>
                            <div style={{ fontSize:'.62rem',fontWeight:700,color:'#7C3AED',
                              textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'.3rem' }}>
                              ✦ AI Explanation
                            </div>
                            <p style={{ fontSize:'.82rem',color:'var(--text2)',margin:0,lineHeight:1.5 }}>
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdaptiveTesting;
