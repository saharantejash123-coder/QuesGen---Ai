import { useState, useEffect, useRef, useCallback } from "react";

/* ── GLOBAL STYLES ── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;font-size:16px;}
    body{font-family:'DM Sans',sans-serif;background:#08090F;color:#E2E8F0;overflow-x:hidden;line-height:1.6;}
    ::-webkit-scrollbar{width:6px;}
    ::-webkit-scrollbar-track{background:#0F1117;}
    ::-webkit-scrollbar-thumb{background:#2354F4;border-radius:3px;}
    ::selection{background:rgba(35,84,244,0.35);color:#fff;}

    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(35,84,244,.4)}50%{box-shadow:0 0 0 8px rgba(35,84,244,0)}}
    @keyframes scanLine{0%{top:0%}100%{top:100%}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

    .fade-in{animation:fadeIn .5s ease both;}
    .fade-up{animation:fadeUp .6s ease both;}
    .slide-right{animation:slideRight .5s ease both;}

    .page-enter{animation:fadeUp .4s ease both;}

    .nav-link{position:relative;color:#94A3B8;text-decoration:none;font-size:.88rem;font-weight:500;transition:color .2s;padding:.25rem 0;}
    .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:#2354F4;transition:width .25s;}
    .nav-link:hover,.nav-link.active{color:#E2E8F0;}
    .nav-link:hover::after,.nav-link.active::after{width:100%;}

    .btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:#2354F4;color:#fff;padding:.72rem 1.6rem;border-radius:8px;font-weight:600;font-size:.9rem;border:none;cursor:pointer;transition:background .2s,transform .15s,box-shadow .2s;font-family:'DM Sans',sans-serif;text-decoration:none;box-shadow:0 4px 20px rgba(35,84,244,.3);}
    .btn-primary:hover{background:#1740D0;transform:translateY(-2px);box-shadow:0 8px 32px rgba(35,84,244,.4);}
    .btn-ghost{display:inline-flex;align-items:center;gap:.5rem;background:transparent;color:#E2E8F0;padding:.72rem 1.5rem;border-radius:8px;font-weight:600;font-size:.9rem;border:1px solid rgba(255,255,255,.12);cursor:pointer;transition:border-color .2s,background .2s;font-family:'DM Sans',sans-serif;text-decoration:none;}
    .btn-ghost:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.04);}

    .card{background:#0F1117;border:1px solid rgba(255,255,255,.07);border-radius:16px;transition:border-color .25s,transform .25s,box-shadow .25s;}
    .card:hover{border-color:rgba(35,84,244,.3);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3);}

    .tag{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#60A5FA;background:rgba(35,84,244,.12);border:1px solid rgba(35,84,244,.2);padding:.3rem .8rem;border-radius:100px;margin-bottom:1.2rem;}
    .tag-amber{color:#FCD34D;background:rgba(217,119,6,.12);border-color:rgba(217,119,6,.25);}
    .tag-teal{color:#67E8F9;background:rgba(8,145,178,.12);border-color:rgba(8,145,178,.25);}
    .tag-green{color:#6EE7B7;background:rgba(5,150,105,.12);border-color:rgba(5,150,105,.25);}

    .section-title{font-family:'Instrument Serif',serif;font-size:clamp(2.2rem,4.5vw,3.4rem);line-height:1.08;letter-spacing:-.5px;color:#F1F5F9;}
    .section-sub{color:#64748B;font-size:1.05rem;line-height:1.75;max-width:540px;margin-top:.8rem;}

    input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:rgba(255,255,255,.1);outline:none;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#2354F4;cursor:pointer;}
    select{background:#0F1117;border:1px solid rgba(255,255,255,.1);color:#E2E8F0;font-family:'DM Sans',sans-serif;border-radius:8px;padding:.6rem 1rem;font-size:.9rem;outline:none;cursor:pointer;}
    select:focus{border-color:#2354F4;}
    select option{background:#0F1117;}
  `}</style>
);

/* ── CONSTANTS ── */
const BLUE = "#2354F4";
const AMBER = "#D97706";
const TEAL = "#0891B2";

/* ── NAV ── */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "scriptlab", label: "Script-Lab" },
    { id: "logicgen", label: "LogicGen" },
    { id: "pricing", label: "Pricing" },
  ];
  const go = (id) => { setPage(id); setMobileOpen(false); window.scrollTo(0,0); };
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:999,
      background: scrolled ? "rgba(8,9,15,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
      transition:"all .3s",
    }}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 5%",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={() => go("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:".5rem"}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#2354F4,#60A5FA)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>Q</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.25rem",color:"#F1F5F9",letterSpacing:"-.3px"}}>Questra <em style={{color:"#60A5FA",fontStyle:"normal"}}>AI</em></span>
        </button>

        <div style={{display:"flex",gap:"2rem",alignItems:"center"}} className="desktop-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              className={`nav-link ${page === l.id ? "active" : ""}`}
              style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:".8rem",alignItems:"center"}}>
          <button className="btn-ghost" style={{padding:".5rem 1.1rem",fontSize:".84rem"}} onClick={() => go("pricing")}>Log In</button>
          <button className="btn-primary" style={{padding:".5rem 1.2rem",fontSize:".84rem"}} onClick={() => go("pricing")}>Get Access</button>
        </div>
      </div>
    </nav>
  );
}

/* ── HOME PAGE ── */
function HomePage({ setPage }) {
  const stats = [
    { num: "4,28,500+", label: "Questions indexed" },
    { num: "15 yrs", label: "PYQ coverage" },
    { num: "7+", label: "Boards covered" },
    { num: "< 10s", label: "Paper generated" },
  ];
  const modules = [
    { icon: "🔮", name: "Exam Generator", desc: "AI predicts exam topics with Confidence Scores based on 15-year pattern analysis.", color: BLUE },
    { icon: "🔄", name: "LogicGen", desc: "Rebuilds PYQs with fresh variables — forces structural mastery, not rote memory.", color: AMBER },
    { icon: "📸", name: "SnapSolve", desc: "Photo of any problem → step-by-step solution + 3 Twin Questions for reinforcement.", color: TEAL },
    { icon: "✍️", name: "Script-Lab", desc: "AI reads your handwriting and gives tiny, achievable improvement nudges — one at a time.", color: "#7C3AED" },
    { icon: "💡", name: "Clarity AI", desc: "Dense textbook jargon converted to fluid Hindi & English for faster comprehension.", color: "#059669" },
    { icon: "📄", name: "Briefs", desc: "Every chapter compressed to a 1-page Core-Sheet for 5-minute pre-exam revision.", color: BLUE },
    { icon: "🎧", name: "Echo-Learning", desc: "Audio podcasts from your Briefs — study while commuting, zero screen time.", color: AMBER },
    { icon: "⚔️", name: "Strive Arena", desc: "Live timed battles, Genie Coins, global leaderboards — makes daily practice addictive.", color: "#7C3AED" },
    { icon: "🗺️", name: "Navigator", desc: "Self-correcting study calendar — auto-redistributes missed sessions without punishing you.", color: TEAL },
  ];
  return (
    <div className="page-enter">
      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:"9rem 5% 6rem",position:"relative",overflow:"hidden"}}>
        {/* Orbs */}
        <div style={{position:"absolute",top:"10%",left:"15%",width:500,height:500,background:"radial-gradient(circle,rgba(35,84,244,.15),transparent 65%)",borderRadius:"50%",filter:"blur(40px)",animation:"floatY 8s ease-in-out infinite",pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:"5%",right:"10%",width:400,height:400,background:"radial-gradient(circle,rgba(8,145,178,.1),transparent 65%)",borderRadius:"50%",filter:"blur(40px)",animation:"floatY 10s ease-in-out infinite reverse",pointerEvents:"none"}} />
        <div style={{position:"absolute",top:"40%",right:"20%",width:300,height:300,background:"radial-gradient(circle,rgba(217,119,6,.08),transparent 65%)",borderRadius:"50%",filter:"blur(60px)",pointerEvents:"none"}} />

        {/* Grid texture */}
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}} />

        <div style={{position:"relative",zIndex:1,maxWidth:900}}>
          <div className="tag fade-up" style={{marginBottom:"1.5rem"}}>
            <span style={{width:7,height:7,background:"#60A5FA",borderRadius:"50%",animation:"blink 1.5s infinite"}} />
            iStart Rajasthan · Ed-Tech Platform
          </div>
          <h1 className="fade-up" style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(3.2rem,8vw,6.5rem)",lineHeight:1.0,letterSpacing:"-2px",color:"#F1F5F9",marginBottom:"1.5rem",animationDelay:".1s"}}>
            Stop guessing.<br/>
            <span style={{background:"linear-gradient(135deg,#60A5FA,#2354F4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Start knowing.</span>
          </h1>
          <p className="fade-up" style={{fontSize:"1.15rem",color:"#64748B",lineHeight:1.8,marginBottom:"2.5rem",animationDelay:".2s",maxWidth:620,margin:"0 auto 2.5rem"}}>
            Questra AI centralises 15 years of examination intelligence — predicting your next paper, improving your handwriting one small step at a time, and saving teachers 15 hours every week.
          </p>
          <div className="fade-up" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <button className="btn-primary" onClick={() => { setPage("features"); window.scrollTo(0,0); }}>Explore Platform →</button>
            <button className="btn-ghost" onClick={() => { setPage("scriptlab"); window.scrollTo(0,0); }}>Try Script-Lab ✍️</button>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{position:"relative",zIndex:1,display:"flex",gap:"3rem",marginTop:"5rem",flexWrap:"wrap",justifyContent:"center",animationDelay:".4s"}}>
          {stats.map((s, i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"2.2rem",color:"#F1F5F9",letterSpacing:"-1px"}}>{s.num}</div>
              <div style={{fontSize:".78rem",color:"#475569",marginTop:".2rem",letterSpacing:".5px",textTransform:"uppercase",fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SCRIPT-LAB FEATURE HIGHLIGHT */}
      <section style={{padding:"6rem 5%",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
          <div>
            <div className="tag tag-amber">✍️ Script-Lab — New Feature</div>
            <h2 className="section-title">Tiny improvements.<br/><em>Massive results.</em></h2>
            <p className="section-sub" style={{marginTop:"1rem"}}>Upload a photo of your handwriting. Script-Lab identifies the single most impactful micro-improvement — because fixing one thing at a time is how lasting change actually happens.</p>
            <div style={{marginTop:"2rem",display:"flex",flexDirection:"column",gap:".9rem"}}>
              {[
                { icon:"📷", t:"Photo Upload", d:"Snap your answer sheet — phone camera is perfectly fine" },
                { icon:"🔍", t:"Micro-Analysis", d:"AI evaluates kerning, baseline, spacing, and letter consistency" },
                { icon:"🎯", t:"One Tiny Fix", d:"You get one small, achievable improvement tip — not a list of 20 problems" },
                { icon:"📈", t:"Track Progress", d:"Each session builds on the last — visible improvement within a week" },
              ].map((item, i) => (
                <div key={i} style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
                  <div style={{width:38,height:38,background:"rgba(217,119,6,.1)",border:"1px solid rgba(217,119,6,.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{item.icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:".95rem",color:"#F1F5F9"}}>{item.t}</div>
                    <div style={{fontSize:".85rem",color:"#64748B",marginTop:".15rem"}}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:"2rem",background:"linear-gradient(135deg,#D97706,#F59E0B)",boxShadow:"0 4px 20px rgba(217,119,6,.3)"}}
              onClick={() => { setPage("scriptlab"); window.scrollTo(0,0); }}>
              Try Script-Lab Free →
            </button>
          </div>

          {/* Script-Lab Preview Card */}
          <div style={{position:"relative"}}>
            <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"1.8rem",boxShadow:"0 24px 60px rgba(0,0,0,.4)"}}>
              <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:"1.2rem"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#EF4444"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#F59E0B"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#10B981"}} />
                <span style={{fontSize:".75rem",color:"#475569",marginLeft:".5rem",fontFamily:"'JetBrains Mono',monospace"}}>script-lab · analysis</span>
              </div>
              {/* Handwriting mock */}
              <div style={{background:"#fff",borderRadius:12,padding:"1.2rem",marginBottom:"1.2rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(transparent,transparent 27px,rgba(0,100,200,.15) 27px,rgba(0,100,200,.15) 28px)",pointerEvents:"none"}} />
                <svg viewBox="0 0 320 140" style={{width:"100%",height:140}}>
                  <path d="M20,40 Q40,25 55,38 Q70,50 80,35 Q90,22 105,38" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M115,38 Q130,20 145,35 Q155,45 165,32 Q175,20 190,36" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M20,75 Q35,60 50,73 Q65,85 80,68 Q95,52 110,70 Q125,85 140,68" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M150,68 Q165,55 180,70 Q195,82 210,65 Q225,50 240,67" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M20,110 Q40,95 55,108 Q70,118 85,100 Q100,85 115,105" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                  {/* Highlight an issue */}
                  <rect x="115" y="88" width="68" height="28" fill="rgba(217,119,6,.18)" stroke="rgba(217,119,6,.5)" strokeWidth="1.5" rx="4"/>
                  <line x1="149" y1="116" x2="149" y2="130" stroke="rgba(217,119,6,.7)" strokeWidth="1.5" strokeDasharray="3,2"/>
                </svg>
              </div>
              {/* Analysis Result */}
              <div style={{background:"rgba(217,119,6,.08)",border:"1px solid rgba(217,119,6,.2)",borderRadius:12,padding:"1rem"}}>
                <div style={{fontSize:".7rem",fontWeight:700,color:"#FCD34D",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".5rem"}}>🎯 This Session's One Fix</div>
                <div style={{fontSize:".9rem",color:"#F1F5F9",fontWeight:500,marginBottom:".4rem"}}>Letter spacing in line 3 is uneven</div>
                <div style={{fontSize:".82rem",color:"#94A3B8",lineHeight:1.6}}>Try leaving a consistent 2mm gap between each letter. Practice 3 lines today — that's it. Don't change anything else.</div>
                <div style={{marginTop:".8rem",display:"flex",gap:".5rem",alignItems:"center"}}>
                  <div style={{flex:1,height:4,background:"rgba(255,255,255,.08)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:"68%",height:"100%",background:"linear-gradient(90deg,#D97706,#FCD34D)",borderRadius:2}} />
                  </div>
                  <span style={{fontSize:".72rem",color:"#FCD34D",fontWeight:700}}>Session 4 of 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL MODULES GRID */}
      <section style={{padding:"5rem 5%",background:"rgba(255,255,255,.015)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div className="tag" style={{display:"inline-flex"}}>Student Ecosystem</div>
            <h2 className="section-title" style={{marginTop:0}}>9 Intelligent Modules</h2>
            <p className="section-sub" style={{margin:".8rem auto 0",textAlign:"center"}}>Every feature built to eliminate anxiety and replace it with certainty.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.2rem"}}>
            {modules.map((m, i) => (
              <div key={i} className="card" style={{padding:"1.5rem",cursor:"pointer",animationDelay:`${i*.05}s`}}
                onClick={() => m.name === "Script-Lab" && (setPage("scriptlab"), window.scrollTo(0,0))}>
                <div style={{display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,background:`${m.color}18`,border:`1px solid ${m.color}30`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{m.icon}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:".95rem",color:"#F1F5F9",marginBottom:".3rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                      {m.name}
                      {m.name === "Script-Lab" && <span style={{fontSize:".6rem",background:"rgba(217,119,6,.2)",color:"#FCD34D",padding:".15rem .5rem",borderRadius:100,fontWeight:700,letterSpacing:".5px"}}>NEW</span>}
                    </div>
                    <div style={{fontSize:".83rem",color:"#64748B",lineHeight:1.6}}>{m.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{padding:"6rem 5%",textAlign:"center",background:"linear-gradient(135deg,rgba(35,84,244,.08),rgba(8,145,178,.05))"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(2rem,4vw,3rem)",color:"#F1F5F9",marginBottom:"1rem"}}>
            Built for every student.<br/><em style={{color:"#60A5FA"}}>From village to Kota.</em>
          </h2>
          <p style={{color:"#64748B",fontSize:"1.05rem",marginBottom:"2.5rem"}}>Full platform works offline in under 1 MB. Because rural Rajasthan deserves the same preparation quality as the best coaching centres.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-primary" onClick={() => { setPage("pricing"); window.scrollTo(0,0); }}>See Pricing →</button>
            <button className="btn-ghost" onClick={() => { setPage("logicgen"); window.scrollTo(0,0); }}>Try LogicGen Demo</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── SCRIPT-LAB PAGE ── */
function ScriptLabPage() {
  const [phase, setPhase] = useState("upload"); // upload | analyzing | result | progress
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [sessionNum, setSessionNum] = useState(1);
  const [historyItems] = useState([
    { session: 1, fix: "Baseline drift on descenders", score: 52, done: true },
    { session: 2, fix: "Letter 'a' closing inconsistently", score: 61, done: true },
    { session: 3, fix: "Word spacing too compressed", score: 69, done: true },
  ]);
  const fileRef = useRef();

  const tips = [
    { area:"Letter Spacing", issue:"Letters in the middle of words are cramped together", fix:"Try leaving a visible 1.5mm breath between each letter. Write slowly for the next 3 lines — speed will come naturally.", priority:"High", zone:[88,52,110,36] },
    { area:"Baseline Alignment", issue:"Words are climbing slightly upward as you write", fix:"Place your notebook at a slight angle (10–15°) to your body. This naturally corrects upward drift without conscious effort.", priority:"Medium", zone:[20,80,180,28] },
    { area:"Letter Size Consistency", issue:"Capital letters vary in height across the page", fix:"Before writing, lightly mark the cap-height on the margin of your paper as a visual guide. Remove it after one page.", priority:"Low", zone:[140,110,90,30] },
    { area:"Pen Pressure", issue:"Pressure drops toward the end of longer words", fix:"Try gripping your pen 1cm higher than usual. This reduces fatigue and keeps pressure consistent through the whole word.", priority:"Medium", zone:[50,35,130,32] },
  ];

  const currentTip = tips[(sessionNum - 1) % tips.length];

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { setUploadedImg(e.target.result); analyze(); };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    setPhase("analyzing");
    setTimeout(() => setPhase("result"), 2800);
  };

  const doNext = () => {
    setSessionNum(s => s + 1);
    setUploadedImg(null);
    setPhase("upload");
  };

  const priorityColor = { High: "#EF4444", Medium: "#F59E0B", Low: "#10B981" };

  return (
    <div className="page-enter" style={{paddingTop:80}}>
      {/* HEADER */}
      <section style={{padding:"4rem 5% 3rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag tag-amber">✍️ Script-Lab — Writing Improvement</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"flex-start"}}>
          <div>
            <h1 className="section-title">One tiny fix.<br/><em>Every session.</em></h1>
            <p className="section-sub" style={{marginTop:"1rem"}}>
              Script-Lab is built on a single insight: nobody improves handwriting by fixing 15 things at once. 
              We identify the <strong style={{color:"#FCD34D"}}>single most impactful micro-improvement</strong> in your writing and give you one focused target. 
              That's it. Come back tomorrow for the next one.
            </p>
            <div style={{marginTop:"2rem",padding:"1rem 1.2rem",background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.15)",borderRadius:12}}>
              <div style={{fontSize:".78rem",fontWeight:700,color:"#FCD34D",letterSpacing:"1px",marginBottom:".4rem"}}>💡 WHY ONE FIX AT A TIME?</div>
              <p style={{fontSize:".88rem",color:"#94A3B8",lineHeight:1.65}}>
                Cognitive load research shows trying to change multiple habits simultaneously leads to 0% retention after 2 weeks. 
                Fixing one micro-habit at a time leads to 87% retention after 30 days. Script-Lab is designed around this.
              </p>
            </div>
          </div>

          {/* Progress History */}
          <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,padding:"1.5rem"}}>
            <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1.2rem"}}>📈 Your Progress History</div>
            {historyItems.map((h, i) => (
              <div key={i} style={{display:"flex",gap:"1rem",alignItems:"center",padding:".7rem 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:700,color:"#6EE7B7",flexShrink:0}}>✓</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:".85rem",color:"#CBD5E1",fontWeight:500}}>{h.fix}</div>
                  <div style={{display:"flex",alignItems:"center",gap:".5rem",marginTop:".3rem"}}>
                    <div style={{flex:1,height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{width:`${h.score}%`,height:"100%",background:"linear-gradient(90deg,#2354F4,#60A5FA)",borderRadius:2,transition:"width 1s ease"}} />
                    </div>
                    <span style={{fontSize:".72rem",color:"#60A5FA",fontWeight:700}}>{h.score}%</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{padding:".8rem 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:".82rem",color:"#475569"}}>Session {sessionNum} in progress</span>
              <span style={{fontSize:".8rem",color:"#FCD34D",fontWeight:700}}>+{sessionNum * 8}% overall ↑</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN TOOL */}
      <section style={{padding:"1rem 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{background:"#0D0F17",border:"1px solid rgba(255,255,255,.07)",borderRadius:24,overflow:"hidden"}}>
          {/* Tab header */}
          <div style={{borderBottom:"1px solid rgba(255,255,255,.06)",padding:"0 2rem",display:"flex",gap:"2rem"}}>
            {["upload","result","progress"].map(t => (
              <button key={t} onClick={() => setPhase(t)}
                style={{background:"none",border:"none",cursor:"pointer",padding:"1rem 0",fontSize:".85rem",fontWeight:600,
                  color: phase === t ? "#F1F5F9" : "#475569",
                  borderBottom: phase === t ? "2px solid #2354F4" : "2px solid transparent",
                  transition:"color .2s",fontFamily:"'DM Sans',sans-serif",letterSpacing:".3px",textTransform:"capitalize"}}>
                {t === "upload" ? "📷 Upload" : t === "result" ? "🎯 Analysis" : "📈 Progress"}
              </button>
            ))}
          </div>

          <div style={{padding:"2rem"}}>
            {/* UPLOAD PHASE */}
            {phase === "upload" && (
              <div className="fade-in">
                <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"2rem",alignItems:"start"}}>
                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileRef.current?.click()}
                    style={{border:`2px dashed ${dragOver ? "#2354F4" : "rgba(255,255,255,.1)"}`,borderRadius:16,padding:"3rem 2rem",textAlign:"center",cursor:"pointer",transition:"border-color .2s,background .2s",background: dragOver ? "rgba(35,84,244,.05)" : "rgba(255,255,255,.015)",minHeight:280,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem"}}>
                    <div style={{fontSize:"3rem"}}>📷</div>
                    <div style={{fontWeight:600,color:"#CBD5E1",fontSize:"1rem"}}>Drop your handwriting photo here</div>
                    <div style={{fontSize:".85rem",color:"#475569"}}>or click to browse — JPG, PNG, HEIC supported</div>
                    <div style={{background:"rgba(35,84,244,.1)",border:"1px solid rgba(35,84,244,.2)",borderRadius:8,padding:".5rem 1.2rem",fontSize:".8rem",color:"#60A5FA",fontWeight:600,marginTop:".5rem"}}>Choose File</div>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e => handleFile(e.target.files[0])} />
                  </div>

                  {/* Or use demo */}
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Or try with demo writing</div>
                    {[
                      { label:"English Cursive Answer", sub:"Class 10 essay response" },
                      { label:"Hindi Handwriting", sub:"Devanagari script sample" },
                      { label:"Maths Working", sub:"Numbered problem steps" },
                    ].map((d, i) => (
                      <button key={i} onClick={analyze}
                        style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"1rem 1.2rem",cursor:"pointer",textAlign:"left",transition:"border-color .2s,background .2s",display:"block",width:"100%"}}>
                        <div style={{fontSize:".9rem",fontWeight:600,color:"#CBD5E1",fontFamily:"'DM Sans',sans-serif"}}>{d.label}</div>
                        <div style={{fontSize:".78rem",color:"#475569",marginTop:".2rem"}}>{d.sub}</div>
                      </button>
                    ))}

                    <div style={{marginTop:".5rem",padding:"1rem",background:"rgba(35,84,244,.05)",border:"1px solid rgba(35,84,244,.12)",borderRadius:12}}>
                      <div style={{fontSize:".78rem",color:"#64748B",lineHeight:1.6}}>
                        📱 <strong style={{color:"#94A3B8"}}>Phone camera works perfectly.</strong> Script-Lab is trained on real classroom conditions — not studio-quality scans.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ANALYZING PHASE */}
            {phase === "analyzing" && (
              <div className="fade-in" style={{textAlign:"center",padding:"4rem 2rem"}}>
                <div style={{position:"relative",width:120,height:120,margin:"0 auto 2rem"}}>
                  <div style={{position:"absolute",inset:0,border:"3px solid rgba(35,84,244,.15)",borderRadius:"50%"}} />
                  <div style={{position:"absolute",inset:0,border:"3px solid transparent",borderTopColor:"#2354F4",borderRadius:"50%",animation:"spin 1s linear infinite"}} />
                  <div style={{position:"absolute",inset:"12px",border:"2px solid rgba(217,119,6,.2)",borderRadius:"50%"}} />
                  <div style={{position:"absolute",inset:"12px",border:"2px solid transparent",borderTopColor:"#D97706",borderRadius:"50%",animation:"spin 1.5s linear infinite reverse"}} />
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem"}}>✍️</div>
                </div>
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.5rem",color:"#F1F5F9",marginBottom:".5rem"}}>Analysing your writing…</h3>
                <p style={{color:"#64748B",fontSize:".9rem"}}>Checking kerning, baseline, pressure, and consistency</p>
                <div style={{display:"flex",gap:".8rem",justifyContent:"center",marginTop:"2rem",flexWrap:"wrap"}}>
                  {["Baseline scan","Letter spacing","Pressure map","Consistency check"].map((s, i) => (
                    <div key={i} style={{fontSize:".75rem",fontWeight:600,padding:".3rem .8rem",borderRadius:100,background:"rgba(35,84,244,.1)",color:"#60A5FA",animation:`fadeIn .4s ${i*.3}s both`}}>{s} ✓</div>
                  ))}
                </div>
              </div>
            )}

            {/* RESULT PHASE */}
            {phase === "result" && (
              <div className="fade-in" style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:"2rem",alignItems:"start"}}>
                {/* Annotated writing */}
                <div>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".8rem"}}>Annotated Sample</div>
                  <div style={{background:"#fff",borderRadius:16,padding:"1.5rem",position:"relative",overflow:"hidden",minHeight:200}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(transparent,transparent 31px,rgba(0,100,200,.12) 31px,rgba(0,100,200,.12) 32px)"}} />
                    <svg viewBox="0 0 360 180" style={{width:"100%",height:180,position:"relative"}}>
                      {/* Simulated handwriting lines */}
                      <path d="M15,35 Q35,22 52,34 Q68,45 82,30 Q96,16 114,32 Q130,46 148,28 Q165,12 184,30" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M194,30 Q210,18 226,32 Q242,44 258,28 Q274,14 292,30 Q308,44 326,30" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M15,78 Q32,65 50,76 Q67,86 82,68 Q98,50 116,72 Q134,90 152,70 Q170,52 188,72" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M198,72 Q216,55 234,70 Q252,84 268,65 Q284,48 302,68" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M15,122 Q35,108 52,120 Q68,130 84,112 Q100,96 118,114 Q136,130 154,112" fill="none" stroke="#1a1a3e" strokeWidth="2.5" strokeLinecap="round"/>
                      {/* Highlight zone */}
                      <rect x={currentTip.zone[0]} y={currentTip.zone[1]} width={currentTip.zone[2]} height={currentTip.zone[3]} fill="rgba(217,119,6,.2)" stroke="rgba(217,119,6,.6)" strokeWidth="1.5" rx="4"/>
                      <text x={currentTip.zone[0]+currentTip.zone[2]/2} y={currentTip.zone[1]-5} textAnchor="middle" fill="#D97706" fontSize="9" fontFamily="DM Sans" fontWeight="600">↑ Focus area</text>
                    </svg>
                  </div>

                  {/* Metrics */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginTop:"1rem"}}>
                    {[["Legibility","74%","#10B981"],["Consistency","61%","#F59E0B"],["Spacing","48%","#EF4444"],["Pressure","82%","#10B981"]].map(([k,v,c], i) => (
                      <div key={i} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:".8rem"}}>
                        <div style={{fontSize:".72rem",color:"#475569",fontWeight:600,marginBottom:".4rem"}}>{k}</div>
                        <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                          <div style={{flex:1,height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:v,height:"100%",background:c,borderRadius:2}} />
                          </div>
                          <span style={{fontSize:".8rem",fontWeight:700,color:c}}>{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Fix */}
                <div>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".8rem"}}>Your One Fix — Session {sessionNum}</div>
                  <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",borderRadius:16,padding:"1.5rem",marginBottom:"1rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
                      <div>
                        <div style={{fontSize:"1.05rem",fontWeight:700,color:"#FCD34D"}}>{currentTip.area}</div>
                        <div style={{fontSize:".78rem",color:"#92400E",background:"rgba(217,119,6,.15)",padding:".2rem .6rem",borderRadius:100,display:"inline-block",marginTop:".3rem",fontWeight:600}}>
                          {currentTip.priority} Priority
                        </div>
                      </div>
                      <div style={{fontSize:"2rem"}}>🎯</div>
                    </div>
                    <div style={{fontSize:".9rem",color:"#CBD5E1",marginBottom:"1rem",lineHeight:1.6}}>
                      <strong style={{color:"#F1F5F9"}}>What we noticed:</strong><br/>{currentTip.issue}
                    </div>
                    <div style={{background:"rgba(0,0,0,.2)",borderRadius:10,padding:"1rem"}}>
                      <div style={{fontSize:".72rem",fontWeight:700,color:"#FCD34D",letterSpacing:".5px",marginBottom:".4rem"}}>✅ YOUR ACTION TODAY</div>
                      <p style={{fontSize:".88rem",color:"#E2E8F0",lineHeight:1.65}}>{currentTip.fix}</p>
                    </div>
                  </div>

                  <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"1rem",marginBottom:"1rem"}}>
                    <div style={{fontSize:".72rem",fontWeight:700,color:"#475569",letterSpacing:".5px",textTransform:"uppercase",marginBottom:".6rem"}}>Other observations (saved for future sessions)</div>
                    {tips.filter((_, i) => i !== (sessionNum-1)%tips.length).slice(0,2).map((t, i) => (
                      <div key={i} style={{display:"flex",gap:".6rem",alignItems:"center",padding:".35rem 0",opacity:.5}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:"#475569",flexShrink:0}} />
                        <span style={{fontSize:".82rem",color:"#64748B"}}>{t.area} — {t.issue.slice(0,45)}…</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" onClick={doNext} style={{width:"100%",justifyContent:"center",background:"linear-gradient(135deg,#D97706,#F59E0B)",boxShadow:"0 4px 20px rgba(217,119,6,.3)"}}>
                    Mark Done & Upload Next Session →
                  </button>
                </div>
              </div>
            )}

            {/* PROGRESS PHASE */}
            {phase === "progress" && (
              <div className="fade-in">
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.4rem",color:"#F1F5F9",marginBottom:"1.5rem"}}>Your improvement journey</h3>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"2rem",alignItems:"start"}}>
                  <div>
                    {[...historyItems, { session: sessionNum, fix: currentTip.area+" (in progress)", score: 48+sessionNum*8, done: false }].map((h, i) => (
                      <div key={i} style={{display:"flex",gap:"1rem",alignItems:"center",padding:"1rem",background:"rgba(255,255,255,.02)",border:`1px solid rgba(255,255,255,${h.done ? ".07" : ".12"})`,borderRadius:12,marginBottom:".8rem"}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background: h.done ? "rgba(16,185,129,.15)" : "rgba(217,119,6,.15)",border:`1px solid ${h.done ? "rgba(16,185,129,.3)" : "rgba(217,119,6,.3)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem",fontWeight:700,color: h.done ? "#6EE7B7" : "#FCD34D",flexShrink:0}}>
                          {h.done ? "✓" : "→"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:".4rem"}}>
                            <span style={{fontSize:".88rem",fontWeight:600,color:h.done ? "#CBD5E1" : "#F1F5F9"}}>Session {h.session}: {h.fix}</span>
                            <span style={{fontSize:".8rem",fontWeight:700,color: h.score>70 ? "#6EE7B7" : h.score>55 ? "#FCD34D" : "#F87171"}}>{h.score}%</span>
                          </div>
                          <div style={{height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${h.score}%`,height:"100%",background: h.done ? "linear-gradient(90deg,#2354F4,#60A5FA)" : "linear-gradient(90deg,#D97706,#FCD34D)",borderRadius:2}} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"rgba(35,84,244,.06)",border:"1px solid rgba(35,84,244,.15)",borderRadius:16,padding:"1.5rem",textAlign:"center"}}>
                    <div style={{fontSize:"3.5rem",fontFamily:"'Instrument Serif',serif",color:"#60A5FA",lineHeight:1}}>{48+sessionNum*8}%</div>
                    <div style={{fontSize:".8rem",color:"#475569",marginTop:".3rem"}}>Overall score</div>
                    <div style={{margin:"1.5rem 0",height:1,background:"rgba(255,255,255,.06)"}} />
                    <div style={{fontSize:".82rem",color:"#94A3B8",lineHeight:1.65}}>At this rate, examiner legibility will be <strong style={{color:"#60A5FA"}}>publication quality</strong> in {Math.max(1, 8 - sessionNum)} more sessions.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── FEATURES PAGE ── */
function FeaturesPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("student");
  const studentFeatures = [
    { icon:"🔮", name:"Exam Generator", color:BLUE, desc:"Runs cyclical time-series analysis on Vault-15 and monitors official board circular releases. Generates a Confidence Score for every syllabus topic — not vague advice, but explicit probability percentages tied to the upcoming exam cycle.", detail:["15-year historical trend analysis","Monitors board sample papers & circulars","Per-topic Confidence Scores (e.g. 89%)","Updates after each official board communication","Covers all 7+ boards simultaneously"] },
    { icon:"🔄", name:"LogicGen · AI Shuffler", color:AMBER, desc:"Strips any PYQ down to its naked mathematical or situational logic. Then rebuilds it — same concept, completely new numbers, names, coordinates, or scenarios. Forces genuine structural understanding over static answer memorisation.", detail:["Infinite unique variants per question","Replaces integers, entities, and scenarios","Paired Oracle predictions for probability","Export as PDF for offline practice","Works for maths, science, and humanities"] },
    { icon:"📸", name:"SnapSolve", color:TEAL, desc:"Point your phone camera at any unsolved problem — homework, textbook, or previous exam. SnapSolve delivers a multi-stage step-by-step breakdown alongside three Twin Questions built with identical logic for immediate reinforcement.", detail:["Works with phone camera photos","Step-by-step resolution with reasoning","3 auto-generated Twin Questions","Supports diagrams and graphs","Hindi & English explanations"] },
    { icon:"✍️", name:"Script-Lab", color:"#D97706", desc:"Addresses the critical loss of presentation marks in Indian examinations. Upload handwritten mock answers. AI evaluates kerning, baseline alignment, paragraph structure, and whitespace — returning one focused micro-improvement at a time.", detail:["Analyses kerning & baseline drift","Evaluates whitespace & paragraph hierarchy","One targeted improvement per session","Tracks progress across sessions","Works with any language script"] },
    { icon:"💡", name:"Clarity AI", color:"#059669", desc:"Processes dense academic textbook jargon and translates it into fluid, high-retention conversational text. Available in parallel English and Hindi views — making complex concepts accessible to every student regardless of language background.", detail:["Instant English & Hindi translation","Jargon → conversational language","Preserves all technical accuracy","Works on any NCERT or state board text","Copy & share simplified explanations"] },
    { icon:"📄", name:"Briefs · Core-Sheets", color:BLUE, desc:"Condenses every textbook chapter into a standardised 1-page digital reference document containing key formulas, essential dates, structural diagrams, and core concepts — the only thing you need in the 5 minutes before an exam.", detail:["1-page per chapter, guaranteed","Key formulas & essential dates","Structural diagrams & mnemonics","Auto-updates if syllabus changes","Available offline via Edge-Sync"] },
    { icon:"🎧", name:"Echo-Learning", color:AMBER, desc:"Converts Briefs directly into high-fidelity conversational audio podcasts using natural voice synthesis. Auditory-preference learners can absorb the entire syllabus while commuting, exercising, or resting — zero screen time required.", detail:["Natural voice synthesis, not robotic TTS","Briefs → 8-12 minute audio episodes","Background playback while using other apps","Downloaded for offline listening","Hindi and English voice options"] },
    { icon:"⚔️", name:"Strive · Battle Mode", color:"#7C3AED", desc:"A highly gamified peer-to-peer competitive environment. Enter live timed quiz battles covering explicit syllabus sub-sections, risk and win Genie Coins, climb the global leaderboard — making daily practice genuinely addictive.", detail:["Live 1v1 and group battles","Genie Coins economy with rewards","City, state, and national leaderboards","Covers every board and competitive exam","Daily challenges tied to Oracle predictions"] },
    { icon:"🗺️", name:"Navigator Map", color:TEAL, desc:"A self-correcting study calendar that maps a clear path to 100% syllabus completion. Miss a study window due to illness or life? The engine auto-redistributes topics across remaining days — no punitive alerts, no guilt.", detail:["Covers 100% of syllabus automatically","Auto-redistributes missed sessions","Links to Oracle predictions dynamically","Visual completion heatmap","Syncs progress across all devices"] },
  ];
  const teacherFeatures = [
    { icon:"⚡", name:"Studio-Q · Paper Studio", color:BLUE, desc:"Input chapter boundaries, mark total, difficulty distribution (40% Easy / 40% Medium / 20% Hard), and board alignment. Studio-Q outputs a camera-ready formatted exam paper plus an exhaustive master evaluation key in under 10 seconds.", detail:["Under 10 seconds generation","Custom difficulty distributions","Full answer key with marking scheme","Camera-ready formatted output","Export to PDF or Google Docs"] },
    { icon:"🛡️", name:"Vari-Test Anti-Cheat", color:AMBER, desc:"One click generates Set A, Set B, and Set C simultaneously. Rearranges question ordering and randomises numeric parameters across all sets — ensuring equitable testing while making adjacent copying mathematically impossible.", detail:["Set A, B, C in one click","Randomised numeric parameters per set","Question order randomisation","Equitable difficulty across all sets","Unique answer keys per set"] },
    { icon:"📷", name:"Vision-Grade OCR Suite", color:TEAL, desc:"Point your phone camera at any handwritten answer sheet. The specialised OCR reads the student's script, scores it line-by-line against the marking key, adds contextual deduction notes, and syncs finalised grades to the class register.", detail:["Phone camera scanning — no scanner needed","Line-by-line scoring with reasoning","Contextual deduction notes","Auto-sync to grade register","Batch scanning for full class sets"] },
    { icon:"📊", name:"Pilot Dashboard", color:"#059669", desc:"Aggregate classroom telemetry visualised as a real-time Class Health Heatmap. Pinpoints exactly which student cohorts are falling behind and which sub-concepts require immediate re-teaching based on quiz failure patterns.", detail:["Real-time class performance heatmap","Individual student trajectory tracking","Sub-concept failure pattern analysis","Automated re-teaching suggestions","Parent-facing Bridge-Reports via WhatsApp"] },
  ];

  const features = activeTab === "student" ? studentFeatures : teacherFeatures;
  const [selected, setSelected] = useState(0);
  const current = features[selected] || features[0];

  return (
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"4rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag">Platform Features</div>
        <h1 className="section-title">Every tool you need.<br/><em>Nothing you don't.</em></h1>
        <p className="section-sub" style={{marginTop:"1rem"}}>9 student modules and 4 teacher tools built into one coherent ecosystem.</p>

        {/* Tab switcher */}
        <div style={{display:"flex",gap:".5rem",marginTop:"2.5rem",background:"rgba(255,255,255,.04)",borderRadius:12,padding:".4rem",width:"fit-content",border:"1px solid rgba(255,255,255,.07)"}}>
          {["student","teacher"].map(t => (
            <button key={t} onClick={() => { setActiveTab(t); setSelected(0); }}
              style={{padding:".6rem 1.5rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".88rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background: activeTab===t ? "#2354F4" : "transparent",color: activeTab===t ? "#fff" : "#64748B",transition:"all .2s"}}>
              {t === "student" ? "👤 For Students" : "🏫 For Teachers"}
            </button>
          ))}
        </div>
      </section>

      <section style={{padding:"1.5rem 5% 5rem",maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"280px 1fr",gap:"2rem",alignItems:"start"}}>
        {/* Feature list */}
        <div style={{display:"flex",flexDirection:"column",gap:".5rem",position:"sticky",top:80}}>
          {features.map((f, i) => (
            <button key={i} onClick={() => setSelected(i)}
              style={{background: selected===i ? `${f.color}15` : "transparent",border: selected===i ? `1px solid ${f.color}30` : "1px solid transparent",borderRadius:10,padding:".8rem 1rem",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:".7rem",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:"1.1rem"}}>{f.icon}</span>
              <span style={{fontSize:".88rem",fontWeight:selected===i ? 700 : 500,color: selected===i ? "#F1F5F9" : "#64748B"}}>{f.name}</span>
              {f.name === "Script-Lab" && <span style={{fontSize:".6rem",background:"rgba(217,119,6,.2)",color:"#FCD34D",padding:".1rem .4rem",borderRadius:100,fontWeight:700,marginLeft:"auto"}}>NEW</span>}
            </button>
          ))}
        </div>

        {/* Feature detail */}
        <div className="fade-in" key={`${activeTab}-${selected}`}>
          <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,padding:"2.5rem"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:"1.5rem",marginBottom:"1.8rem"}}>
              <div style={{width:64,height:64,background:`${current.color}15`,border:`1px solid ${current.color}25`,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",flexShrink:0}}>{current.icon}</div>
              <div>
                <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.8rem",color:"#F1F5F9",marginBottom:".4rem"}}>{current.name}</h2>
                <div style={{fontSize:".75rem",fontWeight:700,color:current.color,letterSpacing:"1px",textTransform:"uppercase"}}>
                  {activeTab === "student" ? "Student Feature" : "Teacher Tool"}
                </div>
              </div>
            </div>

            <p style={{fontSize:"1rem",color:"#94A3B8",lineHeight:1.75,marginBottom:"2rem"}}>{current.desc}</p>

            <div style={{marginBottom:"2rem"}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".9rem"}}>Key Capabilities</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".6rem"}}>
                {current.detail.map((d, i) => (
                  <div key={i} style={{display:"flex",gap:".6rem",alignItems:"flex-start"}}>
                    <span style={{color:current.color,fontWeight:700,marginTop:".1rem",flexShrink:0}}>✓</span>
                    <span style={{fontSize:".88rem",color:"#CBD5E1"}}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {current.name === "Script-Lab" && (
              <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.15)",borderRadius:12,padding:"1.2rem",display:"flex",gap:"1rem",alignItems:"center"}}>
                <span style={{fontSize:"1.5rem"}}>✍️</span>
                <div>
                  <div style={{fontWeight:700,color:"#FCD34D",fontSize:".9rem",marginBottom:".2rem"}}>Try Script-Lab Now</div>
                  <div style={{fontSize:".83rem",color:"#92400E"}}>Upload a handwriting photo and get your first micro-improvement tip in seconds.</div>
                </div>
                <button className="btn-primary" style={{marginLeft:"auto",flexShrink:0,background:"linear-gradient(135deg,#D97706,#F59E0B)",boxShadow:"none"}}
                  onClick={() => { setPage("scriptlab"); window.scrollTo(0,0); }}>Try It →</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── LOGICGEN PAGE ── */
function LogicGenPage() {
  const [cls, setCls] = useState("Class 10 — CBSE");
  const [chapter, setChapter] = useState("light");
  const [diff, setDiff] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [genCount, setGenCount] = useState(0);

  const ri = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const rf = (a,b,d=2) => (a+Math.random()*(b-a)).toFixed(d);

  const qBank = {
    light: [
      q => `A concave mirror has a focal length of ${ri(8,30)} cm. An object is placed ${ri(15,50)} cm in front of the mirror. Using the mirror formula, find the image position and state whether the image is real or virtual.`,
      q => `Light travels from medium A (refractive index ${rf(1.2,1.5)}) to medium B (refractive index ${rf(1.6,2.1)}). Find (a) the critical angle, and (b) state what happens when the angle of incidence exceeds this value.`,
      q => `A convex lens of focal length ${ri(10,25)} cm forms a real, inverted image ${ri(30,80)} cm from the lens. Find the object distance using the lens formula and calculate the magnification.`,
      q => `An object of height ${ri(2,8)} cm is placed ${ri(20,60)} cm in front of a convex mirror of focal length ${ri(10,25)} cm. Find the image height, position, and nature. Draw a ray diagram.`,
    ],
    electricity: [
      q => `Three resistors of ${ri(3,15)} Ω, ${ri(3,15)} Ω, and ${ri(3,15)} Ω are connected in parallel across a ${ri(6,24)} V battery. Find (a) equivalent resistance, (b) total current, and (c) current through each resistor.`,
      q => `A wire of resistance ${ri(10,40)} Ω at 20°C has a temperature coefficient of ${rf(0.003,0.005,4)} /°C. Find its resistance at ${ri(80,200)}°C.`,
      q => `A household has ${ri(3,8)} appliances each rated at ${ri(40,200)} W connected to a ${ri(220,240)} V supply. Calculate the total power consumed per day (${ri(4,12)} hours) and the monthly electricity cost at ₹${ri(4,8)}/unit.`,
      q => `Draw a Wheatstone bridge circuit. Given P = ${ri(5,20)} Ω, Q = ${ri(5,20)} Ω, R = ${ri(5,20)} Ω, find S for bridge balance. Calculate the sensitivity if the galvanometer shows 1 μA/Ω.`,
    ],
    carbon: [
      q => `Write the IUPAC name, structural formula, and isomers of the compound formed when a ${ri(3,6)}-carbon alcohol undergoes complete oxidation. State the type of reaction and industrial use.`,
      q => `An ester is formed from ${["ethanol","propan-1-ol","butan-1-ol"][ri(0,2)]} and ${["ethanoic acid","propanoic acid","methanoic acid"][ri(0,2)]}. Write the balanced equation with conditions, name the ester, and explain its commercial applications.`,
      q => `Compare saturated and unsaturated hydrocarbons with ${ri(2,4)} examples each. Draw structural formulae of ${["butane & but-1-ene","propane & prop-1-yne","pentane & pent-2-ene"][ri(0,2)]} and explain the difference in reactivity.`,
      q => `Explain the cleansing action of soap at the molecular level. Why does soap lose its effectiveness in hard water? What do synthetic detergents offer as an alternative? Draw a micelle diagram.`,
    ],
    humanEye: [
      q => `A person with myopia has a far point of ${ri(40,150)} cm. (a) What type of lens is required? (b) Calculate the focal length and power of the corrective lens. (c) Explain the cause and prevention of myopia.`,
      q => `The near point of a hypermetropic person is ${ri(50,200)} cm. Calculate the power of the corrective lens required to restore normal near vision (near point = 25 cm). Explain why the eye loses accommodation with age.`,
      q => `Explain why the sky appears (a) deep blue at noon, (b) reddish-orange at sunrise and sunset. Use Rayleigh's scattering law and mention why clouds appear white.`,
      q => `Draw a fully labelled diagram of the human eye and explain the role of (a) ciliary muscles, (b) iris, (c) cornea, and (d) retina. Describe the mechanism of accommodation.`,
    ],
  };

  const predictionText = {
    light: `Exam Generator: ${ri(74,93)}% probability of a ray optics question in the upcoming board exam based on 15-year Vault-15 analysis. Specifically, lens formula applications have appeared in ${ri(12,14)} of the last 15 papers.`,
    electricity: `Exam Generator: ${ri(68,88)}% probability. Numerical on parallel circuits or household consumption has appeared consecutively for ${ri(3,5)} years — high probability of continuation.`,
    carbon: `Exam Generator: ${ri(70,90)}% probability. Saponification and ester formation questions follow a ${ri(2,3)}-year alternating pattern. This year aligns with ester chemistry.`,
    humanEye: `Exam Generator: ${ri(65,85)}% probability. Defects of vision and scattering of light are consistently combined in ${ri(10,13)} of the last 15 papers as a single high-value question.`,
  };

  const generate = () => {
    setLoading(true); setQuestions([]); setPrediction(null);
    setTimeout(() => {
      const pool = qBank[chapter];
      const qs = pool.map((fn, i) => ({ id:i, text:fn(), highlight: i===2 }));
      setQuestions(qs);
      setPrediction(predictionText[chapter]);
      setGenCount(c => c+1);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"4rem 5% 3rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag tag-amber">🔄 LogicGen · AI Shuffler</div>
        <h1 className="section-title">Same concept.<br/><em>New question. Every time.</em></h1>
        <p className="section-sub" style={{marginTop:"1rem"}}>LogicGen strips any PYQ to its core logic structure, then rebuilds it with randomised parameters. Rote memorisation becomes impossible — structural mastery becomes inevitable.</p>
      </section>

      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:"2rem",alignItems:"start"}}>
          {/* Controls */}
          <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,padding:"1.5rem",position:"sticky",top:80}}>
            <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1.2rem"}}>Configure Paper</div>

            <div style={{marginBottom:"1rem"}}>
              <label style={{fontSize:".75rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".4rem"}}>CLASS / EXAM</label>
              <select style={{width:"100%"}} value={cls} onChange={e => setCls(e.target.value)}>
                {["Class 10 — CBSE","Class 12 — CBSE","Class 10 — RBSE","Class 11 — CBSE","JEE Mains","NEET","UPSC Prelims"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{marginBottom:"1rem"}}>
              <label style={{fontSize:".75rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".4rem"}}>CHAPTER</label>
              <select style={{width:"100%"}} value={chapter} onChange={e => setChapter(e.target.value)}>
                <option value="light">Light — Reflection & Refraction</option>
                <option value="electricity">Electricity & Circuits</option>
                <option value="carbon">Carbon & Its Compounds</option>
                <option value="humanEye">Human Eye & Colourful World</option>
              </select>
            </div>

            <div style={{marginBottom:"1.5rem"}}>
              <label style={{fontSize:".75rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".4rem"}}>DIFFICULTY</label>
              <div style={{display:"flex",gap:".4rem"}}>
                {["easy","medium","hard"].map(d => (
                  <button key={d} onClick={() => setDiff(d)}
                    style={{flex:1,padding:".5rem .3rem",border:"none",borderRadius:8,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background: diff===d ? BLUE : "rgba(255,255,255,.05)",color: diff===d ? "#fff" : "#64748B",transition:"all .2s",textTransform:"capitalize"}}>{d}</button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading}
              className="btn-primary"
              style={{width:"100%",justifyContent:"center",opacity: loading ? .6 : 1}}>
              {loading ? "⚡ Generating..." : `⚡ Generate${genCount > 0 ? " Again" : ""}`}
            </button>

            {genCount > 0 && (
              <div style={{marginTop:"1rem",textAlign:"center",fontSize:".78rem",color:"#475569"}}>
                {genCount} paper{genCount>1?"s":""} generated · All unique
              </div>
            )}

            <div style={{marginTop:"1.5rem",padding:"1rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:12}}>
              <div style={{fontSize:".72rem",color:"#475569",lineHeight:1.7}}>
                <strong style={{color:"#CBD5E1",display:"block",marginBottom:".3rem"}}>How LogicGen works</strong>
                Each question's mathematical or logical structure is preserved. All specific values — numbers, names, places, molecules — are randomised on every generation. No two outputs are ever identical.
              </div>
            </div>
          </div>

          {/* Output */}
          <div>
            {!loading && questions.length === 0 && (
              <div style={{background:"#0F1117",border:"1px dashed rgba(255,255,255,.08)",borderRadius:20,padding:"4rem 2rem",textAlign:"center"}}>
                <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⚡</div>
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.4rem",color:"#475569",marginBottom:".5rem"}}>Configure and generate your paper</h3>
                <p style={{color:"#334155",fontSize:".88rem"}}>Select your class, chapter, and difficulty — then watch LogicGen build a unique question set in under 2 seconds.</p>
              </div>
            )}

            {loading && (
              <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,padding:"4rem 2rem",textAlign:"center"}}>
                <div style={{width:60,height:60,border:"3px solid rgba(35,84,244,.15)",borderTop:"3px solid #2354F4",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1.5rem"}} />
                <p style={{color:"#64748B",fontSize:".9rem"}}>Remixing {chapter} questions…</p>
              </div>
            )}

            {!loading && questions.length > 0 && (
              <div className="fade-in">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>{cls} · {diff.toUpperCase()} · {questions.length} Questions</div>
                  <div style={{fontSize:".75rem",fontWeight:700,background:"rgba(35,84,244,.1)",color:"#60A5FA",border:"1px solid rgba(35,84,244,.2)",padding:".25rem .7rem",borderRadius:100}}>AI-Shuffled ✓</div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"1.2rem"}}>
                  {questions.map((q, i) => (
                    <div key={`${genCount}-${i}`} className="fade-up"
                      style={{background: q.highlight ? "rgba(35,84,244,.06)" : "#0F1117",border:`1px solid ${q.highlight ? "rgba(35,84,244,.25)" : "rgba(255,255,255,.07)"}`,borderRadius:14,padding:"1.2rem 1.4rem",animationDelay:`${i*.07}s`}}>
                      <div style={{display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                        <div style={{width:26,height:26,borderRadius:8,background: q.highlight ? BLUE : "rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".78rem",fontWeight:700,color: q.highlight ? "#fff" : "#475569",flexShrink:0}}>Q{i+1}</div>
                        <div style={{flex:1}}>
                          {q.highlight && <div style={{fontSize:".68rem",fontWeight:700,color:"#60A5FA",letterSpacing:".5px",marginBottom:".4rem"}}>⭐ HIGH PROBABILITY — Oracle Flagged</div>}
                          <p style={{fontSize:".9rem",color:"#CBD5E1",lineHeight:1.7}}>{q.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {prediction && (
                  <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",borderRadius:14,padding:"1.2rem",display:"flex",gap:"1rem",alignItems:"flex-start"}}>
                    <span style={{fontSize:"1.3rem",flexShrink:0}}>🔮</span>
                    <p style={{fontSize:".85rem",color:"#FCD34D",lineHeight:1.65}}>{prediction}</p>
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

/* ── PRICING PAGE ── */
function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  const tiers = [
    {
      name: "Core Access", price: { monthly: "Free", yearly: "Free" }, desc: "Zero financial barrier. Start learning immediately.",
      color: "#475569", cta: "Get Started Free", ctaStyle: "ghost",
      features: [
        "Last 3 years PYQ access",
        "3 Oracle predictions per month",
        "3 paper generations per month",
        "Briefs for 2 chapters",
        "Basic Navigator roadmap",
        "Script-Lab — 1 session/month",
      ],
    },
    {
      name: "Student Pro", price: { monthly: "₹199", yearly: "₹149" }, period: "/month", popular: true,
      desc: "For serious exam aspirants who want the full edge.",
      color: BLUE, cta: "Start Free Trial", ctaStyle: "primary",
      features: [
        "Full Vault-15 — 15 years, all 7+ boards",
        "Unlimited AI Confidence Scores",
        "LogicGen — unlimited question shuffles",
        "SnapSolve — unlimited photo uploads",
        "Script-Lab — unlimited sessions + progress tracking",
        "Clarity AI — English & Hindi",
        "Echo-Learning audio podcasts",
        "Strive Arena + Genie Coins",
        "Full Navigator + smart redistribution",
        "Edge-Sync offline access",
      ],
    },
    {
      name: "School / Coaching", price: { monthly: "₹999", yearly: "₹749" }, period: "/month",
      desc: "For institutions and Kota coaching centres.",
      color: AMBER, cta: "Book a Demo", ctaStyle: "amber",
      features: [
        "Everything in Student Pro",
        "Studio-Q — unlimited paper generation",
        "Vari-Test Set A / B / C anti-cheat",
        "Vision-Grade OCR auto-grading",
        "Pilot Dashboard class heatmaps",
        "Bridge-Reports via WhatsApp",
        "Custom branding on papers",
        "Unlimited teacher accounts",
        "Priority support",
      ],
    },
  ];

  return (
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"4rem 5% 2rem",maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
        <div className="tag" style={{display:"inline-flex"}}>Pricing</div>
        <h1 className="section-title">Fair pricing.<br/><em>Maximum impact.</em></h1>
        <p className="section-sub" style={{margin:".8rem auto 2rem",textAlign:"center"}}>Affordable for every Indian student. No hidden fees. Cancel any time.</p>

        {/* Billing toggle */}
        <div style={{display:"inline-flex",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:".35rem",gap:".35rem",marginBottom:"3.5rem"}}>
          {["monthly","yearly"].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{padding:".55rem 1.4rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".88rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background: billing===b ? "#2354F4" : "transparent",color: billing===b ? "#fff" : "#64748B",transition:"all .2s",display:"flex",alignItems:"center",gap:".4rem"}}>
              {b.charAt(0).toUpperCase()+b.slice(1)}
              {b === "yearly" && <span style={{fontSize:".65rem",background:"rgba(16,185,129,.2)",color:"#6EE7B7",padding:".1rem .4rem",borderRadius:100,fontWeight:700}}>-25%</span>}
            </button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem",alignItems:"start"}}>
          {tiers.map((t, i) => (
            <div key={i} style={{background:"#0F1117",border:`1px solid ${t.popular ? BLUE : "rgba(255,255,255,.07)"}`,borderRadius:20,padding:"2rem",position:"relative",boxShadow: t.popular ? "0 0 50px rgba(35,84,244,.12)" : "none",transition:"transform .25s",transform: t.popular ? "scale(1.02)" : "scale(1)"}}>
              {t.popular && (
                <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:BLUE,color:"#fff",fontSize:".72rem",fontWeight:700,padding:".3rem 1rem",borderRadius:100,letterSpacing:".5px",whiteSpace:"nowrap"}}>⭐ MOST POPULAR</div>
              )}
              <div style={{marginBottom:"1.5rem"}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:t.color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:".6rem"}}>{t.name}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:".3rem"}}>
                  <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"2.8rem",color:"#F1F5F9",letterSpacing:"-1px"}}>{t.price[billing]}</span>
                  {t.period && <span style={{fontSize:".9rem",color:"#475569"}}>{t.period}</span>}
                </div>
                {billing === "yearly" && t.price.monthly !== "Free" && (
                  <div style={{fontSize:".75rem",color:"#6EE7B7",marginTop:".2rem"}}>billed annually · save 25%</div>
                )}
                <p style={{fontSize:".85rem",color:"#64748B",marginTop:".6rem",lineHeight:1.5}}>{t.desc}</p>
              </div>

              <div style={{height:1,background:"rgba(255,255,255,.06)",marginBottom:"1.5rem"}} />

              <ul style={{listStyle:"none",marginBottom:"2rem",display:"flex",flexDirection:"column",gap:".55rem"}}>
                {t.features.map((f, fi) => (
                  <li key={fi} style={{display:"flex",gap:".6rem",alignItems:"flex-start",fontSize:".86rem",color:"#CBD5E1"}}>
                    <span style={{color:t.color,fontWeight:700,flexShrink:0,marginTop:".1rem"}}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button className={t.ctaStyle === "primary" ? "btn-primary" : t.ctaStyle === "amber" ? "btn-primary" : "btn-ghost"}
                style={{width:"100%",justifyContent:"center",
                  ...(t.ctaStyle === "amber" ? {background:`linear-gradient(135deg,${AMBER},#F59E0B)`,boxShadow:"0 4px 20px rgba(217,119,6,.25)"} : {})}}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"5rem 5%",maxWidth:800,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"2rem",color:"#F1F5F9",textAlign:"center",marginBottom:"2.5rem"}}>Common questions</h2>
        {[
          { q:"Does the free tier actually work offline?", a:"Yes — Core Access includes Edge-Sync with the latest 3 years of PYQs and Briefs for 2 chapters. Everything under 1 MB is cached locally on your first sync." },
          { q:"How does Script-Lab work on phone photos?", a:"Script-Lab's vision model is trained on real classroom writing conditions — not studio scans. It works reliably with photos taken under normal indoor lighting at arm's length." },
          { q:"Can a coaching centre use this for 200 students?", a:"The School/Coaching tier supports unlimited student accounts and teacher seats. Vari-Test generates unique Set A/B/C papers preventing copying across any class size." },
          { q:"Is RBSE (Rajasthan Board) covered?", a:"Fully. Vault-15 includes every RBSE paper from 2010 to 2026, tagged across all four metadata vectors. Oracle predictions are tailored per board — RBSE gets its own trend analysis." },
          { q:"What happens if I miss sessions on the Navigator?", a:"Nothing punitive. The Navigator quietly redistributes your missed topics across remaining days and recalculates the completion path without any alerts or warnings." },
        ].map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} />
        ))}
      </section>

      {/* iStart badge */}
      <section style={{padding:"4rem 5%",background:"rgba(35,84,244,.05)",borderTop:"1px solid rgba(35,84,244,.12)"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:"1.5rem",marginBottom:"1rem"}}>🏆</div>
          <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.6rem",color:"#F1F5F9",marginBottom:".8rem"}}>Proudly submitted to iStart Rajasthan 2025</h3>
          <p style={{color:"#64748B",fontSize:".92rem",lineHeight:1.75}}>
            "We are not just creating another study app. We are building the resilient infrastructure for the National Database of Examination Intelligence — maximising passing percentages and minimising teacher burnout across every tier of the state."
          </p>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{borderBottom:"1px solid rgba(255,255,255,.06)",padding:"1.2rem 0"}}>
      <button onClick={() => setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",fontFamily:"'DM Sans',sans-serif"}}>
        <span style={{fontSize:".95rem",fontWeight:600,color:"#CBD5E1"}}>{q}</span>
        <span style={{color:"#475569",fontSize:"1.2rem",transition:"transform .2s",transform: open ? "rotate(45deg)" : "rotate(0deg)",flexShrink:0}}>+</span>
      </button>
      {open && <p style={{fontSize:".88rem",color:"#64748B",lineHeight:1.7,marginTop:".8rem",paddingRight:"2rem",animation:"fadeUp .25s ease"}}>{a}</p>}
    </div>
  );
}

/* ── FOOTER ── */
function Footer({ setPage }) {
  const cols = [
    { title:"Platform", links:[["Exam Generator","features"],["LogicGen","logicgen"],["Script-Lab","scriptlab"],["SnapSolve","features"],["Strive Arena","features"]] },
    { title:"For Teachers", links:[["Studio-Q","features"],["Vari-Test","features"],["Vision-Grade","features"],["Pilot Dashboard","features"]] },
    { title:"Company", links:[["About","home"],["iStart Rajasthan","home"],["Pricing","pricing"],["Get Access","pricing"]] },
  ];
  return (
    <footer style={{background:"#060810",borderTop:"1px solid rgba(255,255,255,.05)",padding:"4rem 5% 2rem"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",marginBottom:"3rem"}}>
          <div>
            <button onClick={() => { setPage("home"); window.scrollTo(0,0); }} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:".5rem",marginBottom:"1rem"}}>
              <div style={{width:28,height:28,background:"linear-gradient(135deg,#2354F4,#60A5FA)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700}}>Q</div>
              <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.2rem",color:"#F1F5F9"}}>Questra <em style={{color:"#60A5FA",fontStyle:"normal"}}>AI</em></span>
            </button>
            <p style={{fontSize:".85rem",color:"#334155",lineHeight:1.7,maxWidth:280}}>The National Database of Examination Intelligence. Built for Bharat. Powered by evidence.</p>
            <div style={{marginTop:"1rem",fontSize:".75rem",color:"#1E293B"}}>A proud iStart Rajasthan initiative · 2025</div>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{fontSize:".72rem",fontWeight:700,color:"#334155",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1rem"}}>{col.title}</div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".6rem"}}>
                {col.links.map(([label, page], j) => (
                  <li key={j}><button onClick={() => { setPage(page); window.scrollTo(0,0); }} style={{background:"none",border:"none",cursor:"pointer",fontSize:".85rem",color:"#475569",fontFamily:"'DM Sans',sans-serif",transition:"color .2s",padding:0}}
                    onMouseEnter={e => e.target.style.color="#94A3B8"} onMouseLeave={e => e.target.style.color="#475569"}>{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.04)",paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
          <span style={{fontSize:".78rem",color:"#1E293B"}}>© 2025 Questra AI. All rights reserved.</span>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:".9rem",color:"#1E293B",fontStyle:"italic"}}>Engineered Preparation. Guaranteed Results.</span>
        </div>
      </div>
    </footer>
  );
}

/* ── ROOT APP ── */
export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch(page) {
      case "home": return <HomePage setPage={setPage} />;
      case "features": return <FeaturesPage setPage={setPage} />;
      case "scriptlab": return <ScriptLabPage />;
      case "logicgen": return <LogicGenPage />;
      case "pricing": return <PricingPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={page} setPage={setPage} />
        <main style={{flex:1}}>
          {renderPage()}
        </main>
        <Footer setPage={setPage} />
      </div>
    </>
  );
}
