import React, { useState, useEffect, useRef } from 'react';
import AdaptiveTesting from '../components/student/AdaptiveTesting';
import { englishPYQ2025 } from '../data/pyq/english-10-2025';

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:'DM Sans',sans-serif;background:#08090F;color:#E2E8F0;overflow-x:hidden;line-height:1.6;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#0F1117;}
    ::-webkit-scrollbar-thumb{background:#2354F4;border-radius:3px;}
    ::selection{background:rgba(35,84,244,.35);color:#fff;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .fade-up{animation:fadeUp .6s ease both;}
    .fade-in{animation:fadeIn .4s ease both;}
    .page-enter{animation:fadeUp .4s ease both;}
    .nav-link{position:relative;color:#94A3B8;text-decoration:none;font-size:.88rem;font-weight:500;transition:color .2s;padding:.25rem 0;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;}
    .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:#2354F4;transition:width .25s;}
    .nav-link:hover,.nav-link.active{color:#E2E8F0;}
    .nav-link:hover::after,.nav-link.active::after{width:100%;}
    .btn-p{display:inline-flex;align-items:center;gap:.5rem;background:#2354F4;color:#fff;padding:.7rem 1.5rem;border-radius:8px;font-weight:600;font-size:.88rem;border:none;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;box-shadow:0 4px 20px rgba(35,84,244,.3);}
    .btn-p:hover{background:#1740D0;transform:translateY(-2px);}
    .btn-g{display:inline-flex;align-items:center;gap:.5rem;background:transparent;color:#E2E8F0;padding:.7rem 1.4rem;border-radius:8px;font-weight:600;font-size:.88rem;border:1px solid rgba(255,255,255,.12);cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;}
    .btn-g:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.04);}
    .btn-a{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#D97706,#F59E0B);color:#fff;padding:.7rem 1.5rem;border-radius:8px;font-weight:600;font-size:.88rem;border:none;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;box-shadow:0 4px 20px rgba(217,119,6,.3);}
    .btn-a:hover{transform:translateY(-2px);}
    .card{background:#0F1117;border:1px solid rgba(255,255,255,.07);border-radius:16px;transition:all .25s;}
    .card:hover{border-color:rgba(35,84,244,.3);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3);}
    .tag{display:inline-flex;align-items:center;gap:.4rem;font-size:.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#60A5FA;background:rgba(35,84,244,.12);border:1px solid rgba(35,84,244,.2);padding:.28rem .75rem;border-radius:100px;margin-bottom:1.2rem;}
    .tag-a{color:#FCD34D;background:rgba(217,119,6,.12);border-color:rgba(217,119,6,.25);}
    .tag-v{color:#C4B5FD;background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.25);}
    .st{font-family:'Instrument Serif',serif;font-size:clamp(2rem,4.5vw,3.2rem);line-height:1.08;letter-spacing:-.4px;color:#F1F5F9;}
    .ss{color:#64748B;font-size:1rem;line-height:1.75;max-width:520px;margin-top:.7rem;}
    select{background:#0F1117;border:1px solid rgba(255,255,255,.1);color:#E2E8F0;font-family:'DM Sans',sans-serif;border-radius:8px;padding:.55rem .9rem;font-size:.88rem;outline:none;cursor:pointer;width:100%;}
    select:focus{border-color:#2354F4;}
    select option{background:#0F1117;}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;}
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
    .fr{display:flex;gap:1rem;flex-wrap:wrap;}
    @media(max-width:900px){
      .g2{grid-template-columns:1fr;gap:2rem;}
      .g3{grid-template-columns:repeat(2,1fr);}
      .g4{grid-template-columns:repeat(2,1fr);}
      .hide-mob{display:none!important;}
      .desk-nav{display:none!important;}
    }
    @media(max-width:600px){
      .g3{grid-template-columns:1fr;}
      .g4{grid-template-columns:1fr 1fr;}
    }
    @media(max-width:420px){
      .g4{grid-template-columns:1fr;}
    }
  `}</style>
);

const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";

function Nav({page,setPage}){
  const [sc,setSc]=useState(false);
  const [mob,setMob]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>20);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const links=[{id:"home",l:"Home"},{id:"features",l:"Features"},{id:"vault15",l:"Vault-15"},{id:"scriptlab",l:"Script-Lab"},{id:"logicgen",l:"LogicGen"},{id:"adaptive",l:"Adaptive Test"},{id:"pricing",l:"Pricing"}];
  const go=id=>{setPage(id);setMob(false);window.scrollTo(0,0);};
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:sc?"rgba(8,9,15,.94)":"transparent",backdropFilter:sc?"blur(20px)":"none",borderBottom:sc?"1px solid rgba(255,255,255,.06)":"none",transition:"all .3s"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 5%",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:".45rem"}}>
          <div style={{width:26,height:26,background:"linear-gradient(135deg,#2354F4,#60A5FA)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>Q</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.2rem",color:"#F1F5F9"}}>QuesGen <em style={{color:"#60A5FA",fontStyle:"normal"}}>AI</em></span>
        </button>
        <div className="desk-nav" style={{display:"flex",gap:"1.6rem",alignItems:"center"}}>
          {links.map(l=><button key={l.id} onClick={()=>go(l.id)} className={`nav-link${page===l.id?" active":""}`}>{l.l}</button>)}
        </div>
        <div style={{display:"flex",gap:".6rem",alignItems:"center"}}>
          <button className="btn-g hide-mob" style={{padding:".45rem 1rem",fontSize:".82rem"}} onClick={() => window.location.href='/student'}>Log In</button>
          <button className="btn-p hide-mob" style={{padding:".45rem 1.1rem",fontSize:".82rem"}} onClick={() => window.location.href='/student'}>Get Access</button>
          <button onClick={()=>setMob(!mob)} style={{background:"none",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#E2E8F0"}}>☰</button>
        </div>
      </div>
      {mob&&(
        <div style={{background:"rgba(8,9,15,.98)",borderTop:"1px solid rgba(255,255,255,.06)",padding:"1rem 5%",display:"flex",flexDirection:"column",gap:".2rem"}}>
          {links.map(l=><button key={l.id} onClick={()=>go(l.id)} style={{background:"none",border:"none",cursor:"pointer",padding:".75rem .5rem",textAlign:"left",color:page===l.id?"#60A5FA":"#94A3B8",fontWeight:page===l.id?700:500,fontSize:".95rem",fontFamily:"'DM Sans',sans-serif",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{l.l}</button>)}
          <div style={{display:"flex",gap:".7rem",marginTop:".8rem"}}>
            <button className="btn-g" style={{flex:1,justifyContent:"center"}} onClick={() => window.location.href='/student'}>Log In</button>
            <button className="btn-p" style={{flex:1,justifyContent:"center"}} onClick={() => window.location.href='/student'}>Get Access</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function HomePage({setPage}){
  const stats=[{n:"4,28,500+",l:"Questions indexed"},{n:"15 yrs",l:"PYQ coverage"},{n:"7+",l:"Boards covered"},{n:"< 10s",l:"Paper generated"}];
  const modules=[
    {icon:"🗄️",name:"Vault-15",desc:"15-year indexed PYQ archive across 7+ boards with intelligent tagging and trend metadata.",color:VIOLET},
    {icon:"🏆",name:"Exam Generator",desc:"AI predicts upcoming exam topics with Confidence Scores based on 15-year pattern analysis.",color:BLUE},
    {icon:"🔄",name:"LogicGen",desc:"Rebuilds PYQs with fresh variables — forces structural mastery, not rote memory.",color:AMBER},
    {icon:"🧠",name:"Adaptive Testing",desc:"Dynamic AI-generated tests that adapt to your weak areas in real-time.",color:TEAL},
    {icon:"✍️",name:"Script-Lab",desc:"AI reads your handwriting and gives tiny, achievable improvement nudges — one at a time.",color:"#D97706"},
    {icon:"💡",name:"Clarity AI",desc:"Dense textbook jargon converted to fluid Hindi & English for faster comprehension.",color:GREEN},
    {icon:"📄",name:"Briefs",desc:"Every chapter compressed to a 1-page Core-Sheet for 5-minute pre-exam revision.",color:BLUE},
    {icon:"🗺️",name:"Navigator",desc:"Self-correcting study calendar — auto-redistributes missed sessions without punishing you.",color:TEAL},
  ];
  return(
    <div className="page-enter">
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:"9rem 5% 5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"12%",left:"10%",width:"min(480px,80vw)",height:"min(480px,80vw)",background:"radial-gradient(circle,rgba(35,84,244,.14),transparent 65%)",borderRadius:"50%",filter:"blur(40px)",animation:"floatY 8s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"8%",right:"8%",width:"min(360px,70vw)",height:"min(360px,70vw)",background:"radial-gradient(circle,rgba(8,145,178,.09),transparent 65%)",borderRadius:"50%",filter:"blur(40px)",animation:"floatY 10s ease-in-out infinite reverse",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)",backgroundSize:"56px 56px",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:860}}>
          <div className="tag fade-up" style={{display:"inline-flex",marginBottom:"1.4rem"}}>
            <span style={{width:7,height:7,background:"#60A5FA",borderRadius:"50%",animation:"blink 1.5s infinite"}}/>
            iStart Rajasthan · Ed-Tech Platform
          </div>
          <h1 className="fade-up" style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(3rem,8vw,6rem)",lineHeight:1.0,letterSpacing:"-2px",color:"#F1F5F9",marginBottom:"1.4rem",animationDelay:".1s"}}>
            Stop guessing.<br/>
            <span style={{background:"linear-gradient(135deg,#60A5FA,#2354F4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Start knowing.</span>
          </h1>
          <p className="fade-up" style={{fontSize:"clamp(.95rem,2.5vw,1.1rem)",color:"#64748B",lineHeight:1.8,marginBottom:"2.4rem",animationDelay:".2s",maxWidth:580,margin:"0 auto 2.4rem"}}>
            QuesGen centralises 15 years of examination intelligence — predicting your next paper, improving your handwriting one step at a time, and saving teachers 15 hours every week.
          </p>
          <div className="fade-up fr" style={{justifyContent:"center",animationDelay:".3s"}}>
            <button className="btn-p" onClick={()=>{setPage("features");window.scrollTo(0,0);}}>Explore Platform →</button>
            <button className="btn-g" onClick={()=>{setPage("vault15");window.scrollTo(0,0);}}>Open Vault-15 🗄️</button>
          </div>
        </div>
        <div className="fade-up" style={{position:"relative",zIndex:1,display:"flex",gap:"clamp(1.5rem,5vw,3rem)",marginTop:"4.5rem",flexWrap:"wrap",justifyContent:"center",animationDelay:".4s"}}>
          {stats.map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.6rem,4vw,2.2rem)",color:"#F1F5F9",letterSpacing:"-1px"}}>{s.n}</div>
              <div style={{fontSize:".72rem",color:"#475569",marginTop:".2rem",letterSpacing:".5px",textTransform:"uppercase",fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"5rem 5%",maxWidth:1200,margin:"0 auto"}}>
        <div className="g2">
          <div>
            <div className="tag tag-v">🗄️ Vault-15 — New Feature</div>
            <h2 className="st">15 years of exam<br/><em>intelligence, indexed.</em></h2>
            <p className="ss" style={{marginTop:"1rem"}}>Vault-15 is the largest tagged PYQ database ever built for Indian boards — 4,28,500+ questions across 7+ boards, each carrying Difficulty, Bloom's Taxonomy, Frequency, and AI Confidence metadata.</p>
            <div style={{marginTop:"1.8rem",display:"flex",flexDirection:"column",gap:".8rem"}}>
              {[
                {icon:"📦",t:"4,28,500+ Questions",d:"Every board, every class, 2010–2025 — fully indexed"},
                {icon:"🏷️",t:"4-Vector Metadata",d:"Difficulty · Bloom's Level · Frequency · AI Score"},
                {icon:"📊",t:"Trend Heatmaps",d:"Visual year-wise topic frequency charts per board"},
                {icon:"🔌",t:"Edge-Sync Offline",d:"Full archive synced under 1 MB for rural access"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:".9rem",alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",flexShrink:0}}>{item.icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:".92rem",color:"#F1F5F9"}}>{item.t}</div>
                    <div style={{fontSize:".82rem",color:"#64748B",marginTop:".1rem"}}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-p" style={{marginTop:"2rem",background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 20px rgba(124,58,237,.3)"}} onClick={()=>{setPage("vault15");window.scrollTo(0,0);}}>Explore Vault-15 →</button>
          </div>
          <div style={{background:"#0F1117",border:"1px solid rgba(124,58,237,.2)",borderRadius:20,padding:"1.6rem",boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}>
            <div style={{display:"flex",alignItems:"center",gap:".45rem",marginBottom:"1.2rem"}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#EF4444"}}/><div style={{width:9,height:9,borderRadius:"50%",background:"#F59E0B"}}/><div style={{width:9,height:9,borderRadius:"50%",background:"#10B981"}}/>
              <span style={{fontSize:".72rem",color:"#475569",marginLeft:".4rem",fontFamily:"'JetBrains Mono',monospace"}}>vault-15 · browser</span>
            </div>
            <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:".6rem 1rem",display:"flex",alignItems:"center",gap:".6rem",marginBottom:"1rem"}}>
              <span style={{color:"#475569",fontSize:".85rem"}}>🔍</span>
              <span style={{fontSize:".82rem",color:"#64748B"}}>CBSE Class 10 · Physics · Lens Formula</span>
              <span style={{marginLeft:"auto",fontSize:".68rem",background:"rgba(124,58,237,.15)",color:"#C4B5FD",padding:".2rem .5rem",borderRadius:6,fontWeight:700}}>247 results</span>
            </div>
            {[
              {yr:"2024",q:"An object is placed 25 cm in front of a convex lens of focal length 15 cm...",diff:"Med",freq:8,conf:92,bloom:"Apply"},
              {yr:"2023",q:"State and prove the mirror formula. Draw a labelled ray diagram...",diff:"Hard",freq:11,conf:87,bloom:"Evaluate"},
              {yr:"2022",q:"Define refractive index. Calculate the speed of light in glass...",diff:"Easy",freq:14,conf:95,bloom:"Remember"},
            ].map((q,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,padding:".85rem",marginBottom:".6rem"}}>
                <div style={{display:"flex",gap:".5rem",alignItems:"flex-start",marginBottom:".5rem"}}>
                  <span style={{fontSize:".68rem",fontWeight:700,color:"#C4B5FD",background:"rgba(124,58,237,.15)",padding:".15rem .5rem",borderRadius:5,flexShrink:0}}>{q.yr}</span>
                  <p style={{fontSize:".78rem",color:"#CBD5E1",lineHeight:1.5}}>{q.q}</p>
                </div>
                <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
                  <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:q.diff==="Easy"?"rgba(16,185,129,.15)":q.diff==="Med"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)",color:q.diff==="Easy"?"#6EE7B7":q.diff==="Med"?"#FCD34D":"#FCA5A5"}}>{q.diff}</span>
                  <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(35,84,244,.15)",color:"#93C5FD"}}>Freq: {q.freq}×</span>
                  <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(16,185,129,.12)",color:"#6EE7B7"}}>Oracle: {q.conf}%</span>
                  <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:"#94A3B8"}}>{q.bloom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"4rem 5%",background:"rgba(255,255,255,.013)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"3rem"}}>
            <div className="tag" style={{display:"inline-flex"}}>Student Ecosystem</div>
            <h2 className="st" style={{marginTop:0}}>8 Intelligent Modules</h2>
            <p className="ss" style={{margin:".8rem auto 0",textAlign:"center"}}>Every feature built to eliminate anxiety and replace it with certainty.</p>
          </div>
          <div className="g3" style={{gap:"1rem"}}>
            {modules.map((m,i)=>(
              <div key={i} className="card" style={{padding:"1.3rem",cursor:"pointer"}}
                onClick={()=>{if(m.name==="Script-Lab"){setPage("scriptlab");}else if(m.name==="Vault-15"){setPage("vault15");}else if(m.name==="LogicGen"){setPage("logicgen");}window.scrollTo(0,0);}}>
                <div style={{display:"flex",gap:".75rem",alignItems:"flex-start"}}>
                  <div style={{width:40,height:40,background:`${m.color}18`,border:`1px solid ${m.color}28`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{m.icon}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:".9rem",color:"#F1F5F9",marginBottom:".25rem",display:"flex",alignItems:"center",gap:".4rem"}}>
                      {m.name}
                      {(m.name==="Vault-15"||m.name==="Script-Lab")&&<span style={{fontSize:".58rem",background:"rgba(124,58,237,.2)",color:"#C4B5FD",padding:".1rem .4rem",borderRadius:100,fontWeight:700}}>NEW</span>}
                    </div>
                    <div style={{fontSize:".8rem",color:"#64748B",lineHeight:1.55}}>{m.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"5rem 5%",textAlign:"center",background:"linear-gradient(135deg,rgba(35,84,244,.07),rgba(8,145,178,.04))"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",color:"#F1F5F9",marginBottom:"1rem"}}>Built for every student.<br/><em style={{color:"#60A5FA"}}>From village to Kota.</em></h2>
          <p style={{color:"#64748B",fontSize:"1rem",marginBottom:"2.2rem"}}>Full platform works offline in under 1 MB. Because rural Rajasthan deserves the same preparation quality as the best coaching centres.</p>
          <div className="fr" style={{justifyContent:"center"}}>
            <button className="btn-p" onClick={()=>{setPage("pricing");window.scrollTo(0,0);}}>See Pricing →</button>
            <button className="btn-g" onClick={()=>{setPage("logicgen");window.scrollTo(0,0);}}>Try LogicGen Demo</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Vault15Page(){
  const [board,setBoard]=useState("CBSE");
  const [cls,setCls]=useState("Class 10");
  const [subject,setSubject]=useState("Physics");
  const [chapter,setChapter]=useState("Light — Reflection & Refraction");
  const [year,setYear]=useState("All Years");
  const [diff,setDiff]=useState("All");
  const [bloom,setBloom]=useState("All");
  const [loading,setLoading]=useState(false);
  const [results,setResults]=useState([]);
  const [searched,setSearched]=useState(false);
  const [viewQ,setViewQ]=useState(null);

  const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;

  const chapters={
    Physics:["Light — Reflection & Refraction","Electricity & Circuits","Human Eye","Magnetic Effects of Current","Sources of Energy"],
    Chemistry:["Carbon & Its Compounds","Acids, Bases & Salts","Metals & Non-Metals","Chemical Reactions","Periodic Classification"],
    Biology:["Life Processes","Control & Coordination","Reproduction","Heredity & Evolution","Our Environment"],
    Mathematics:["Real Numbers","Polynomials","Quadratic Equations","Triangles","Statistics"],
    "Social Science":["Nationalism in India","Federalism","Development","Money & Credit","Consumer Rights"],
  };

  const qTemplates=[
    {bloom:"Remember",diff:"Easy",q:"Define {concept}. State {law} and write its mathematical expression.",marks:2,type:"2-mark"},
    {bloom:"Understand",diff:"Easy",q:"Explain with a labelled diagram how {phenomenon} occurs in {context}.",marks:3,type:"3-mark"},
    {bloom:"Apply",diff:"Medium",q:"An object of height {h} cm is placed {u} cm in front of a {lens} of focal length {f} cm. Find the image distance, magnification, and nature.",marks:5,type:"5-mark Numerical"},
    {bloom:"Analyse",diff:"Medium",q:"Compare {A} and {B} on the basis of {criteria}. Give two examples of each with suitable diagrams.",marks:5,type:"5-mark"},
    {bloom:"Evaluate",diff:"Hard",q:"A student sets up an experiment to verify {law}. Draw a circuit diagram, list three precautions, and explain what happens when {variable} is changed by {factor}×.",marks:5,type:"5-mark Experiment"},
    {bloom:"Create",diff:"Hard",q:"Design a {device} that uses the principle of {principle}. Label all parts, explain its working, and state one advantage over conventional methods.",marks:5,type:"5-mark Application"},
    {bloom:"Apply",diff:"Medium",q:"Calculate {quantity} when {param1} = {val1} and {param2} = {val2}. Show all steps and state the formula used.",marks:3,type:"3-mark Numerical"},
    {bloom:"Remember",diff:"Easy",q:"List any four properties of {concept}. Draw a neat diagram and label its parts.",marks:4,type:"4-mark"},
  ];

  const fill=(t)=>{
    const vars={
      concept:["concave mirror","refractive index","electromagnet","covalent bond"],
      law:["Snell's law","Ohm's law","Faraday's law","Mendel's law"],
      phenomenon:["total internal reflection","electromagnetic induction","photosynthesis","refraction"],
      context:["optical fibre","a transformer","leaves","a glass prism"],
      A:["concave and convex lenses","acids and bases","metals and non-metals"],
      B:["plane and spherical mirrors","alkalis and bases","ionic and covalent bonds"],
      criteria:["focal length","pH","bonding"],
      device:["periscope","simple motor","electrolytic cell"],
      principle:["reflection","electromagnetic induction","electrolysis"],
      quantity:["resistance","image distance","current"],
      param1:["voltage","object distance","resistance"],
      param2:["current","focal length","area"],
      val1:[`${ri(4,24)} V`,`${ri(20,60)} cm`,`${ri(5,40)} Ω`],
      val2:[`${ri(1,8)} A`,`${ri(10,30)} cm`,`${ri(2,15)} Ω`],
      h:[`${ri(2,8)}`],u:[`${ri(15,60)}`],f:[`${ri(8,25)}`],
      lens:["convex lens","concave mirror","concave lens"],
      variable:["voltage","resistance","distance"],
      factor:[`${ri(2,4)}`],
    };
    return t.replace(/{(\w+)}/g,(_,k)=>{const arr=vars[k];return arr?arr[Math.floor(Math.random()*arr.length)]:k;});
  };

  const search=()=>{
    setLoading(true);setResults([]);setSearched(false);
    setTimeout(()=>{
      let qs = [];
      if (board === "CBSE" && cls === "Class 10" && subject === "English") {
        // Integrate real PYQ data
        qs = [
          {
            id: "real-1", yr: 2025, board: "CBSE", cls: "Class 10", subject: "English", 
            chapter: "Reading Skills", q: englishPYQ2025.sections[0].questions[0].text, 
            diff: "Med", bloom: "Analyse", marks: 10, type: "Section A", freq: 1, conf: 100, set: "Set 1", section: "Section A"
          },
          {
            id: "real-2", yr: 2025, board: "CBSE", cls: "Class 10", subject: "English", 
            chapter: "Grammar", q: englishPYQ2025.sections[1].questions[1].text, 
            diff: "Easy", bloom: "Apply", marks: 5, type: "Section B", freq: 1, conf: 100, set: "Set 1", section: "Section B"
          }
        ];
      } else {
        const count=ri(18,28);
        qs=Array.from({length:count},(_,i)=>{
          const tmpl=qTemplates[i%qTemplates.length];
          const yr=year==="All Years"?ri(2010,2024):parseInt(year);
          return{id:i,yr,board,cls,subject,chapter,q:fill(tmpl.q),diff:diff==="All"?tmpl.diff:diff,bloom:bloom==="All"?tmpl.bloom:bloom,marks:tmpl.marks,type:tmpl.type,freq:ri(2,14),conf:ri(62,97),set:["Set 1","Set 2","Set 3"][ri(0,2)],section:["Section A","Section B","Section C"][ri(0,2)]};
        });
      }
      setResults(qs);setSearched(true);setLoading(false);
    },1200);
  };

  const dc=(d)=>d==="Easy"?"#6EE7B7":d==="Medium"?"#FCD34D":"#FCA5A5";
  const db=(d)=>d==="Easy"?"rgba(16,185,129,.12)":d==="Medium"?"rgba(245,158,11,.12)":"rgba(239,68,68,.12)";
  const bc={Remember:"#93C5FD",Understand:"#A5F3FC",Apply:"#C4B5FD",Analyse:"#FCA5A5",Evaluate:"#FCD34D",Create:"#6EE7B7"};
  const stats=searched?{total:results.length,easy:results.filter(q=>q.diff==="Easy").length,med:results.filter(q=>q.diff==="Medium").length,hard:results.filter(q=>q.diff==="Hard").length,avgConf:Math.round(results.reduce((a,q)=>a+q.conf,0)/results.length)}:{};

  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag tag-v">🗄️ Vault-15 — PYQ Intelligence Archive</div>
        <div className="g2" style={{gap:"3rem",alignItems:"flex-start"}}>
          <div>
            <h1 className="st">The complete exam<br/><em>intelligence archive.</em></h1>
            <p className="ss" style={{marginTop:".8rem"}}>4,28,500+ questions from 2010–2025. Every question carries four metadata tags: Difficulty, Bloom's Taxonomy Level, Historical Frequency, and AI Confidence Score. Filter. Analyse. Master.</p>
          </div>
          <div className="g4" style={{gap:".7rem"}}>
            {[{n:"4,28,500+",l:"Questions",c:VIOLET},{n:"5",l:"Boards",c:BLUE},{n:"15 yrs",l:"Coverage",c:TEAL},{n:"4",l:"Metadata Tags",c:AMBER}].map((s,i)=>(
              <div key={i} style={{background:"#0F1117",border:`1px solid ${s.c}22`,borderRadius:12,padding:"1rem .8rem",textAlign:"center"}}>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.2rem,3vw,1.6rem)",color:"#F1F5F9",letterSpacing:"-.5px"}}>{s.n}</div>
                <div style={{fontSize:".68rem",color:"#475569",marginTop:".2rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{background:"#0D0F17",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,overflow:"hidden"}}>
          <div style={{background:"rgba(124,58,237,.06)",borderBottom:"1px solid rgba(124,58,237,.12)",padding:"1.2rem 1.8rem",display:"flex",alignItems:"center",gap:".8rem"}}>
            <span style={{fontSize:"1.2rem"}}>🗄️</span>
            <span style={{fontWeight:700,color:"#C4B5FD",fontSize:".9rem"}}>Vault-15 Search Engine</span>
            <span style={{marginLeft:"auto",fontSize:".72rem",color:"#475569",fontFamily:"'JetBrains Mono',monospace"}}>4,28,500 records indexed</span>
          </div>
          <div style={{padding:"1.8rem"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem",marginBottom:"1rem"}}>
              {[
                {label:"Board",val:board,set:setBoard,opts:["CBSE","RBSE","ICSE","UP Board","Maharashtra","Bihar","MP Board","Karnataka"]},
                {label:"Class",val:cls,set:setCls,opts:["Class 9","Class 10","Class 11","Class 12"]},
                {label:"Subject",val:subject,set:v=>{setSubject(v);setChapter(chapters[v]?.[0]||"");},opts:Object.keys(chapters)},
                {label:"Year",val:year,set:setYear,opts:["All Years",...Array.from({length:15},(_,i)=>`${2024-i}`)]},
              ].map(f=>(
                <div key={f.label}>
                  <label style={{fontSize:".68rem",fontWeight:700,color:"#475569",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>{f.label}</label>
                  <select value={f.val} onChange={e=>f.set(e.target.value)}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
              <div>
                <label style={{fontSize:".68rem",fontWeight:700,color:"#475569",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Chapter</label>
                <select value={chapter} onChange={e=>setChapter(e.target.value)}>
                  {(chapters[subject]||[]).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:".68rem",fontWeight:700,color:"#475569",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Difficulty</label>
                <select value={diff} onChange={e=>setDiff(e.target.value)}>
                  {["All","Easy","Medium","Hard"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:".68rem",fontWeight:700,color:"#475569",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Bloom's Level</label>
                <select value={bloom} onChange={e=>setBloom(e.target.value)}>
                  {["All","Remember","Understand","Apply","Analyse","Evaluate","Create"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{display:"flex",alignItems:"flex-end"}}>
                <button onClick={search} disabled={loading} className="btn-p" style={{width:"100%",justifyContent:"center",background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 16px rgba(124,58,237,.3)",opacity:loading?.6:1}}>
                  {loading?"Searching…":"🔍 Search Vault-15"}
                </button>
              </div>
            </div>

            {loading&&(
              <div style={{textAlign:"center",padding:"3rem"}}>
                <div style={{width:48,height:48,border:"3px solid rgba(124,58,237,.2)",borderTop:"3px solid #7C3AED",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}/>
                <p style={{color:"#64748B",fontSize:".88rem"}}>Scanning Vault-15 archive…</p>
              </div>
            )}

            {!loading&&searched&&(
              <div className="fade-in">
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",padding:"1rem",background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)",borderRadius:12,marginBottom:"1.2rem"}}>
                  <span style={{fontSize:".8rem",fontWeight:700,color:"#C4B5FD"}}>Found {stats.total} questions</span>
                  <span style={{color:"rgba(255,255,255,.1)"}}>|</span>
                  <span style={{fontSize:".78rem",color:"#6EE7B7"}}>Easy: {stats.easy}</span>
                  <span style={{fontSize:".78rem",color:"#FCD34D"}}>Med: {stats.med}</span>
                  <span style={{fontSize:".78rem",color:"#FCA5A5"}}>Hard: {stats.hard}</span>
                  <span style={{color:"rgba(255,255,255,.1)"}}>|</span>
                  <span style={{fontSize:".78rem",color:"#60A5FA"}}>Avg Oracle: {stats.avgConf}%</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:".7rem",maxHeight:500,overflowY:"auto",paddingRight:4}}>
                  {results.map((q,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"1rem",cursor:"pointer",transition:"border-color .2s"}}
                      onClick={()=>setViewQ(q)} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(124,58,237,.35)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.06)"}>
                      <div style={{display:"flex",gap:".6rem",alignItems:"flex-start",marginBottom:".5rem"}}>
                        <span style={{fontSize:".68rem",fontWeight:700,color:"#C4B5FD",background:"rgba(124,58,237,.15)",padding:".15rem .5rem",borderRadius:5,flexShrink:0,whiteSpace:"nowrap"}}>{q.yr} · {q.set}</span>
                        <p style={{fontSize:".83rem",color:"#CBD5E1",lineHeight:1.55,flex:1}}>{q.q}</p>
                      </div>
                      <div style={{display:"flex",gap:".4rem",flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:db(q.diff),color:dc(q.diff)}}>{q.diff}</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:bc[q.bloom]||"#94A3B8"}}>{q.bloom}</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(35,84,244,.12)",color:"#93C5FD"}}>Freq {q.freq}×</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .5rem",borderRadius:5,background:"rgba(16,185,129,.1)",color:"#6EE7B7"}}>Oracle {q.conf}%</span>
                        <span style={{fontSize:".62rem",color:"#475569",marginLeft:"auto"}}>{q.marks}M · {q.section}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading&&!searched&&(
              <div style={{textAlign:"center",padding:"3rem 1rem",border:"1px dashed rgba(255,255,255,.06)",borderRadius:14}}>
                <div style={{fontSize:"2.5rem",marginBottom:".8rem"}}>🗄️</div>
                <p style={{color:"#334155",fontSize:".88rem"}}>Configure your filters and search Vault-15 — 4,28,500 questions ready.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {viewQ&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"5%"}} onClick={()=>setViewQ(null)}>
          <div style={{background:"#0F1117",border:"1px solid rgba(124,58,237,.3)",borderRadius:20,padding:"2rem",maxWidth:620,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.2rem"}}>
              <div>
                <div style={{fontSize:".7rem",fontWeight:700,color:"#C4B5FD",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".3rem"}}>Vault-15 · Question Detail</div>
                <div style={{fontSize:".78rem",color:"#475569"}}>{viewQ.yr} · {viewQ.board} · {viewQ.cls} · {viewQ.set} · {viewQ.section}</div>
              </div>
              <button onClick={()=>setViewQ(null)} style={{background:"rgba(255,255,255,.06)",border:"none",cursor:"pointer",width:30,height:30,borderRadius:8,color:"#94A3B8",fontSize:"1rem"}}>✕</button>
            </div>
            <div style={{background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)",borderRadius:12,padding:"1.2rem",marginBottom:"1.2rem"}}>
              <p style={{fontSize:".92rem",color:"#E2E8F0",lineHeight:1.7}}>{viewQ.q}</p>
              <div style={{marginTop:".8rem",display:"flex",gap:".5rem",flexWrap:"wrap"}}>
                <span style={{fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:5,background:db(viewQ.diff),color:dc(viewQ.diff)}}>{viewQ.diff}</span>
                <span style={{fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:bc[viewQ.bloom]||"#94A3B8"}}>{viewQ.bloom}</span>
                <span style={{fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:5,background:"rgba(35,84,244,.12)",color:"#93C5FD"}}>Appeared {viewQ.freq}× since 2010</span>
                <span style={{fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:5,background:"rgba(16,185,129,.1)",color:"#6EE7B7"}}>Oracle {viewQ.conf}%</span>
                <span style={{fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:"#94A3B8"}}>{viewQ.marks} Marks · {viewQ.type}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:".7rem",flexWrap:"wrap"}}>
              <button className="btn-p" style={{flex:1,justifyContent:"center",fontSize:".82rem"}}>🔄 Generate Variant (LogicGen)</button>
              <button className="btn-g" style={{flex:1,justifyContent:"center",fontSize:".82rem"}}>📥 Save to My List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScriptLabPage(){
  const [phase,setPhase]=useState("upload");
  const [dragOver,setDragOver]=useState(false);
  const [sessionNum,setSessionNum]=useState(1);
  const fileRef=useRef();
  const history=[{session:1,fix:"Baseline drift on descenders",score:52,done:true},{session:2,fix:"Letter 'a' closing inconsistently",score:61,done:true},{session:3,fix:"Word spacing too compressed",score:69,done:true}];
  const tips=[{area:"Letter Spacing",issue:"Letters in the middle of words are cramped together",fix:"Try leaving a visible 1.5mm breath between each letter. Write slowly for the next 3 lines — speed will come naturally.",priority:"High",zone:[88,52,110,36]},{area:"Baseline Alignment",issue:"Words are climbing slightly upward as you write",fix:"Place your notebook at a slight angle (10–15°) to your body. This naturally corrects upward drift without conscious effort.",priority:"Medium",zone:[20,80,180,28]},{area:"Letter Size Consistency",issue:"Capital letters vary in height across the page",fix:"Before writing, lightly mark the cap-height on the margin of your paper as a visual guide. Remove it after one page.",priority:"Low",zone:[140,110,90,30]},{area:"Pen Pressure",issue:"Pressure drops toward the end of longer words",fix:"Try gripping your pen 1cm higher than usual. This reduces fatigue and keeps pressure consistent through the whole word.",priority:"Medium",zone:[50,35,130,32]}];
  const tip=tips[(sessionNum-1)%tips.length];
  const handleFile=(file)=>{if(!file||!file.type.startsWith("image/"))return;setPhase("analyzing");setTimeout(()=>setPhase("result"),2800);};
  const analyze=()=>{setPhase("analyzing");setTimeout(()=>setPhase("result"),2800);};
  const doNext=()=>{setSessionNum(s=>s+1);setPhase("upload");};

  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag tag-a">✍️ Script-Lab — Writing Improvement</div>
        <div className="g2" style={{gap:"3rem",alignItems:"flex-start"}}>
          <div>
            <h1 className="st">One tiny fix.<br/><em>Every session.</em></h1>
            <p className="ss" style={{marginTop:".8rem"}}>Script-Lab identifies the <strong style={{color:"#FCD34D"}}>single most impactful micro-improvement</strong> in your handwriting. One focused target per session. Come back tomorrow for the next one.</p>
            <div style={{marginTop:"1.5rem",padding:"1rem",background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.15)",borderRadius:12}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:"#FCD34D",letterSpacing:"1px",marginBottom:".35rem"}}>💡 WHY ONE FIX AT A TIME?</div>
              <p style={{fontSize:".83rem",color:"#94A3B8",lineHeight:1.6}}>Fixing one micro-habit at a time leads to 87% retention after 30 days. Trying to fix 15 things at once leads to 0% retention.</p>
            </div>
          </div>
          <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,padding:"1.4rem"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1rem"}}>📈 Progress History</div>
            {history.map((h,i)=>(
              <div key={i} style={{display:"flex",gap:".8rem",alignItems:"center",padding:".6rem 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(16,185,129,.12)",border:"1px solid rgba(16,185,129,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:700,color:"#6EE7B7",flexShrink:0}}>✓</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:".82rem",color:"#CBD5E1",fontWeight:500}}>{h.fix}</div>
                  <div style={{display:"flex",alignItems:"center",gap:".5rem",marginTop:".3rem"}}>
                    <div style={{flex:1,height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{width:`${h.score}%`,height:"100%",background:"linear-gradient(90deg,#2354F4,#60A5FA)",borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:".68rem",color:"#60A5FA",fontWeight:700}}>{h.score}%</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{padding:".7rem 0 0",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:".78rem",color:"#475569"}}>Session {sessionNum} in progress</span>
              <span style={{fontSize:".76rem",color:"#FCD34D",fontWeight:700}}>+{sessionNum*8}% overall ↑</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{background:"#0D0F17",border:"1px solid rgba(255,255,255,.07)",borderRadius:22,overflow:"hidden"}}>
          <div style={{borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 1.5rem",display:"flex",gap:"1.5rem",overflowX:"auto"}}>
            {["upload","result","progress"].map(t=>(
              <button key={t} onClick={()=>setPhase(t)} style={{background:"none",border:"none",cursor:"pointer",padding:".9rem 0",fontSize:".82rem",fontWeight:600,color:phase===t?"#F1F5F9":"#475569",borderBottom:phase===t?"2px solid #D97706":"2px solid transparent",transition:"color .2s",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",textTransform:"capitalize"}}>
                {t==="upload"?"📷 Upload":t==="result"?"🎯 Analysis":"📈 Progress"}
              </button>
            ))}
          </div>
          <div style={{padding:"1.8rem"}}>
            {phase==="upload"&&(
              <div className="fade-in">
                <div className="g2" style={{gap:"1.5rem"}}>
                  <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current?.click()}
                    style={{border:`2px dashed ${dragOver?"#2354F4":"rgba(255,255,255,.1)"}`,borderRadius:14,padding:"2.5rem 1.5rem",textAlign:"center",cursor:"pointer",transition:"all .2s",background:dragOver?"rgba(35,84,244,.05)":"transparent",minHeight:220,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".8rem"}}>
                    <div style={{fontSize:"2.5rem"}}>📷</div>
                    <div style={{fontWeight:600,color:"#CBD5E1",fontSize:".92rem"}}>Drop your handwriting photo here</div>
                    <div style={{fontSize:".8rem",color:"#475569"}}>JPG, PNG, HEIC · phone camera is fine</div>
                    <div style={{background:"rgba(35,84,244,.1)",border:"1px solid rgba(35,84,244,.2)",borderRadius:7,padding:".4rem 1rem",fontSize:".78rem",color:"#60A5FA",fontWeight:600}}>Choose File</div>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:".8rem"}}>
                    <div style={{fontSize:".72rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Or try demo samples</div>
                    {["English Cursive Answer","Hindi Handwriting (Devanagari)","Maths Working Steps"].map((d,i)=>(
                      <button key={i} onClick={analyze} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:11,padding:".9rem 1rem",cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'DM Sans',sans-serif",color:"#CBD5E1",fontSize:".88rem",fontWeight:500,transition:"border-color .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(217,119,6,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {phase==="analyzing"&&(
              <div className="fade-in" style={{textAlign:"center",padding:"3rem 1rem"}}>
                <div style={{position:"relative",width:90,height:90,margin:"0 auto 1.5rem"}}>
                  <div style={{position:"absolute",inset:0,border:"3px solid rgba(35,84,244,.15)",borderRadius:"50%"}}/>
                  <div style={{position:"absolute",inset:0,border:"3px solid transparent",borderTopColor:"#2354F4",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
                  <div style={{position:"absolute",inset:"10px",border:"2px solid transparent",borderTopColor:"#D97706",borderRadius:"50%",animation:"spin 1.5s linear infinite reverse"}}/>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem"}}>✍️</div>
                </div>
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.35rem",color:"#F1F5F9",marginBottom:".4rem"}}>Analysing your writing…</h3>
                <p style={{color:"#64748B",fontSize:".85rem"}}>Checking kerning, baseline, pressure, and consistency</p>
              </div>
            )}
            {phase==="result"&&(
              <div className="fade-in">
                <div className="g2" style={{gap:"1.5rem",alignItems:"start"}}>
                  <div>
                    <div style={{fontSize:".7rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".7rem"}}>Annotated Sample</div>
                    <div style={{background:"#fff",borderRadius:14,padding:"1.2rem",position:"relative",overflow:"hidden",minHeight:170}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(transparent,transparent 29px,rgba(0,100,200,.12) 29px,rgba(0,100,200,.12) 30px)"}}/>
                      <svg viewBox="0 0 340 160" style={{width:"100%",height:160,position:"relative"}}>
                        <path d="M15,35 Q35,22 52,34 Q68,44 82,30 Q96,16 114,32 Q130,44 148,28 Q165,12 184,30" fill="none" stroke="#1a1a3e" strokeWidth="2.2" strokeLinecap="round"/>
                        <path d="M194,30 Q210,18 226,32 Q242,43 258,28 Q274,14 292,30 Q308,43 320,30" fill="none" stroke="#1a1a3e" strokeWidth="2.2" strokeLinecap="round"/>
                        <path d="M15,75 Q32,62 50,73 Q67,83 82,65 Q98,48 116,68 Q134,86 152,66 Q170,48 188,68" fill="none" stroke="#1a1a3e" strokeWidth="2.2" strokeLinecap="round"/>
                        <path d="M15,118 Q35,104 52,116 Q68,126 84,108 Q100,92 118,110 Q136,126 154,108" fill="none" stroke="#1a1a3e" strokeWidth="2.2" strokeLinecap="round"/>
                        <rect x={tip.zone[0]} y={tip.zone[1]} width={tip.zone[2]} height={tip.zone[3]} fill="rgba(217,119,6,.2)" stroke="rgba(217,119,6,.55)" strokeWidth="1.5" rx="4"/>
                        <text x={tip.zone[0]+tip.zone[2]/2} y={tip.zone[1]-5} textAnchor="middle" fill="#D97706" fontSize="8" fontFamily="DM Sans" fontWeight="700">↑ Focus area</text>
                      </svg>
                    </div>
                    <div className="r2-sm" style={{marginTop:".8rem"}}>
                      {[["Legibility","74%","#10B981"],["Consistency","61%","#F59E0B"],["Spacing","48%","#EF4444"],["Pressure","82%","#10B981"]].map(([k,v,c],i)=>(
                        <div key={i} style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:9,padding:".7rem"}}>
                          <div style={{fontSize:".68rem",color:"#475569",fontWeight:600,marginBottom:".35rem"}}>{k}</div>
                          <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                            <div style={{flex:1,height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
                              <div style={{width:v,height:"100%",background:c,borderRadius:2}}/>
                            </div>
                            <span style={{fontSize:".75rem",fontWeight:700,color:c}}>{v}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:".7rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".7rem"}}>Your One Fix — Session {sessionNum}</div>
                    <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",borderRadius:14,padding:"1.3rem",marginBottom:"1rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".9rem"}}>
                        <div>
                          <div style={{fontSize:"1rem",fontWeight:700,color:"#FCD34D"}}>{tip.area}</div>
                          <div style={{fontSize:".68rem",color:"#92400E",background:"rgba(217,119,6,.15)",padding:".18rem .55rem",borderRadius:100,display:"inline-block",marginTop:".3rem",fontWeight:600}}>{tip.priority} Priority</div>
                        </div>
                        <span style={{fontSize:"1.5rem"}}>🎯</span>
                      </div>
                      <div style={{fontSize:".85rem",color:"#CBD5E1",marginBottom:".9rem",lineHeight:1.6}}><strong style={{color:"#F1F5F9"}}>Noticed:</strong> {tip.issue}</div>
                      <div style={{background:"rgba(0,0,0,.2)",borderRadius:9,padding:".9rem"}}>
                        <div style={{fontSize:".68rem",fontWeight:700,color:"#FCD34D",letterSpacing:".5px",marginBottom:".35rem"}}>✅ YOUR ACTION TODAY</div>
                        <p style={{fontSize:".84rem",color:"#E2E8F0",lineHeight:1.6}}>{tip.fix}</p>
                      </div>
                    </div>
                    <button className="btn-a" onClick={doNext} style={{width:"100%",justifyContent:"center"}}>Mark Done & Upload Next →</button>
                  </div>
                </div>
              </div>
            )}
            {phase==="progress"&&(
              <div className="fade-in">
                <div className="g2" style={{gap:"1.5rem",alignItems:"start"}}>
                  <div>
                    {[...history,{session:sessionNum,fix:tip.area+" (in progress)",score:48+sessionNum*8,done:false}].map((h,i)=>(
                      <div key={i} style={{display:"flex",gap:".8rem",alignItems:"center",padding:".9rem",background:"rgba(255,255,255,.02)",border:`1px solid rgba(255,255,255,${h.done?".06":".1"})`,borderRadius:11,marginBottom:".7rem"}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:h.done?"rgba(16,185,129,.12)":"rgba(217,119,6,.12)",border:`1px solid ${h.done?"rgba(16,185,129,.25)":"rgba(217,119,6,.25)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:h.done?"#6EE7B7":"#FCD34D",flexShrink:0}}>{h.done?"✓":"→"}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:".35rem",gap:".5rem",flexWrap:"wrap"}}>
                            <span style={{fontSize:".83rem",fontWeight:600,color:h.done?"#CBD5E1":"#F1F5F9"}}>S{h.session}: {h.fix}</span>
                            <span style={{fontSize:".76rem",fontWeight:700,color:h.score>70?"#6EE7B7":h.score>55?"#FCD34D":"#F87171"}}>{h.score}%</span>
                          </div>
                          <div style={{height:3,background:"rgba(255,255,255,.04)",borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${h.score}%`,height:"100%",background:h.done?"linear-gradient(90deg,#2354F4,#60A5FA)":"linear-gradient(90deg,#D97706,#FCD34D)",borderRadius:2}}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"rgba(35,84,244,.06)",border:"1px solid rgba(35,84,244,.15)",borderRadius:16,padding:"1.5rem",textAlign:"center"}}>
                    <div style={{fontSize:"3.2rem",fontFamily:"'Instrument Serif',serif",color:"#60A5FA",lineHeight:1}}>{48+sessionNum*8}%</div>
                    <div style={{fontSize:".78rem",color:"#475569",marginTop:".3rem"}}>Overall score</div>
                    <div style={{margin:"1.2rem 0",height:1,background:"rgba(255,255,255,.06)"}}/>
                    <div style={{fontSize:".82rem",color:"#94A3B8",lineHeight:1.65}}>At this rate, your writing will reach <strong style={{color:"#60A5FA"}}>examiner-quality legibility</strong> in {Math.max(1,8-sessionNum)} more sessions.</div>
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

function FeaturesPage({setPage}){
  const [tab,setTab]=useState("student");
  const [sel,setSel]=useState(0);
  const sf=[
    {icon:"🗄️",name:"Vault-15",color:VIOLET,desc:"The largest tagged PYQ archive ever built for Indian boards — 4,28,500+ questions from 2010–2025, each carrying Difficulty, Bloom's Taxonomy, Historical Frequency, and AI Confidence metadata tags.",detail:["4,28,500+ questions fully indexed","7+ boards, Class 9–12","4-Vector metadata per question","Year-wise trend heatmaps","Edge-Sync offline under 1 MB"]},
    {icon:"🏆",name:"Exam Generator",color:BLUE,desc:"Runs cyclical time-series analysis on Vault-15 and monitors official board circular releases. Generates a Confidence Score for every syllabus topic — explicit probability percentages tied to the upcoming exam cycle.",detail:["15-year historical trend analysis","Monitors board sample papers & circulars","Per-topic Confidence Scores (e.g. 89%)","Updates after each official board communication","Covers all 7+ boards simultaneously"]},
    {icon:"🔄",name:"LogicGen",color:AMBER,desc:"Strips any PYQ down to its core logic structure, then rebuilds it — same concept, completely new numbers, names, coordinates, or scenarios. Forces genuine structural understanding over static answer memorisation.",detail:["Infinite unique variants per question","Replaces integers, entities, and scenarios","Paired Oracle predictions for probability","Export as PDF for offline practice","Works for maths, science, and humanities"]},
    {icon:"🧠",name:"Adaptive Testing",color:TEAL,desc:"Generate dynamic, AI-powered tests on the fly. Questions adapt to your specific weak areas and provide detailed explanations to help you master every topic.",detail:["Unlimited AI-generated questions","Adapts to your weak areas","Instant AI explanations","Performance history tracking","Continuous skill mastery"]},
    {icon:"✍️",name:"Script-Lab",color:"#D97706",desc:"Addresses the critical loss of presentation marks in Indian exams. Upload handwritten mock answers. AI evaluates kerning, baseline alignment, paragraph structure, and whitespace — returning one focused micro-improvement at a time.",detail:["Analyses kerning & baseline drift","Evaluates whitespace & paragraph hierarchy","One targeted improvement per session","Tracks progress across sessions","Works with any language script"]},
    {icon:"💡",name:"Clarity AI",color:GREEN,desc:"Processes dense academic textbook jargon and translates it into fluid, high-retention conversational text. Available in parallel English and Hindi views.",detail:["Instant English & Hindi translation","Jargon → conversational language","Preserves all technical accuracy","Works on any NCERT or state board text","Copy & share simplified explanations"]},
    {icon:"📄",name:"Briefs",color:BLUE,desc:"Condenses every textbook chapter into a standardised 1-page digital reference document containing key formulas, essential dates, structural diagrams, and core concepts.",detail:["1-page per chapter, guaranteed","Key formulas & essential dates","Structural diagrams & mnemonics","Auto-updates if syllabus changes","Available offline via Edge-Sync"]},
    {icon:"🗺️",name:"Navigator",color:TEAL,desc:"A self-correcting study calendar that maps a clear path to 100% syllabus completion. Miss a session? The engine auto-redistributes topics across remaining days — no guilt.",detail:["Covers 100% of syllabus automatically","Auto-redistributes missed sessions","Links to Oracle predictions dynamically","Visual completion heatmap","Syncs progress across all devices"]},
  ];
  const tf=[
    {icon:"⚡",name:"Studio-Q",color:BLUE,desc:"Input chapter boundaries, mark total, difficulty distribution, and board alignment. Studio-Q outputs a camera-ready formatted exam paper plus an exhaustive master evaluation key in under 10 seconds.",detail:["Under 10 seconds generation","Custom difficulty distributions","Full answer key with marking scheme","Camera-ready formatted output","Export to PDF or Google Docs"]},
    {icon:"🛡️",name:"Vari-Test",color:AMBER,desc:"One click generates Set A, B, and C simultaneously. Rearranges question ordering and randomises numeric parameters — making adjacent copying mathematically impossible.",detail:["Set A, B, C in one click","Randomised numeric parameters per set","Question order randomisation","Equitable difficulty across all sets","Unique answer keys per set"]},
    {icon:"📷",name:"Vision-Grade",color:TEAL,desc:"Point your phone camera at any handwritten answer sheet. The specialised OCR reads the student's script, scores it line-by-line against the marking key, and syncs grades to the class register.",detail:["Phone camera scanning","Line-by-line scoring with reasoning","Contextual deduction notes","Auto-sync to grade register","Batch scanning for full class sets"]},
    {icon:"📊",name:"Pilot Dashboard",color:GREEN,desc:"Aggregate classroom telemetry visualised as a real-time Class Health Heatmap. Pinpoints exactly which student cohorts are falling behind and which sub-concepts require immediate re-teaching.",detail:["Real-time class performance heatmap","Individual student trajectory tracking","Sub-concept failure pattern analysis","Automated re-teaching suggestions","Parent-facing Bridge-Reports via WhatsApp"]},
  ];
  const features=tab==="student"?sf:tf;
  const cur=features[Math.min(sel,features.length-1)];
  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag">Platform Features</div>
        <h1 className="st">Every tool you need.<br/><em>Nothing you don't.</em></h1>
        <p className="ss" style={{marginTop:".7rem"}}>8 student modules and 4 teacher tools in one coherent ecosystem.</p>
        <div style={{display:"flex",gap:".4rem",marginTop:"2rem",background:"rgba(255,255,255,.035)",borderRadius:11,padding:".35rem",width:"fit-content",border:"1px solid rgba(255,255,255,.06)"}}>
          {["student","teacher"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setSel(0);}} style={{padding:".55rem 1.3rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:tab===t?"#2354F4":"transparent",color:tab===t?"#fff":"#64748B",transition:"all .2s"}}>
              {t==="student"?"👤 For Students":"🏫 For Teachers"}
            </button>
          ))}
        </div>
      </section>
      <section style={{padding:"1rem 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:"1.5rem",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
            {features.map((f,i)=>(
              <button key={i} onClick={()=>setSel(i)} style={{background:sel===i?`${f.color}14`:"transparent",border:sel===i?`1px solid ${f.color}28`:"1px solid transparent",borderRadius:9,padding:".7rem .9rem",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:".6rem",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{fontSize:"1rem"}}>{f.icon}</span>
                <span style={{fontSize:".85rem",fontWeight:sel===i?700:500,color:sel===i?"#F1F5F9":"#64748B"}}>{f.name}</span>
                {(f.name==="Vault-15"||f.name==="Script-Lab")&&<span style={{fontSize:".55rem",background:"rgba(124,58,237,.2)",color:"#C4B5FD",padding:".1rem .35rem",borderRadius:100,fontWeight:700,marginLeft:"auto"}}>NEW</span>}
              </button>
            ))}
          </div>
          <div key={`${tab}-${sel}`} className="fade-in">
            <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,padding:"2rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:"1.2rem",marginBottom:"1.5rem"}}>
                <div style={{width:56,height:56,background:`${cur.color}14`,border:`1px solid ${cur.color}22`,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0}}>{cur.icon}</div>
                <div>
                  <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.7rem",color:"#F1F5F9",marginBottom:".3rem"}}>{cur.name}</h2>
                  <div style={{fontSize:".7rem",fontWeight:700,color:cur.color,letterSpacing:"1px",textTransform:"uppercase"}}>{tab==="student"?"Student Feature":"Teacher Tool"}</div>
                </div>
              </div>
              <p style={{fontSize:".95rem",color:"#94A3B8",lineHeight:1.75,marginBottom:"1.8rem"}}>{cur.desc}</p>
              <div style={{fontSize:".68rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".8rem"}}>Key Capabilities</div>
              <div className="r2-sm" style={{gap:".55rem",marginBottom:"1.5rem"}}>
                {cur.detail.map((d,i)=>(
                  <div key={i} style={{display:"flex",gap:".55rem",alignItems:"flex-start"}}>
                    <span style={{color:cur.color,fontWeight:700,flexShrink:0,marginTop:".1rem",fontSize:".85rem"}}>✓</span>
                    <span style={{fontSize:".84rem",color:"#CBD5E1"}}>{d}</span>
                  </div>
                ))}
              </div>
              {cur.name==="Vault-15"&&<button className="btn-p" style={{background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 16px rgba(124,58,237,.3)"}} onClick={()=>{setPage("vault15");window.scrollTo(0,0);}}>Open Vault-15 →</button>}
              {cur.name==="Script-Lab"&&<button className="btn-a" onClick={()=>{setPage("scriptlab");window.scrollTo(0,0);}}>Try Script-Lab →</button>}
              {cur.name==="LogicGen"&&<button className="btn-p" onClick={()=>{setPage("logicgen");window.scrollTo(0,0);}}>Try LogicGen →</button>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LogicGenPage(){
  const [cls,setCls]=useState("Class 10 — CBSE");
  const [chapter,setChapter]=useState("light");
  const [diff,setDiff]=useState("medium");
  const [loading,setLoading]=useState(false);
  const [questions,setQuestions]=useState([]);
  const [prediction,setPrediction]=useState(null);
  const [gc,setGc]=useState(0);
  const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const rf=(a,b,d=2)=>(a+Math.random()*(b-a)).toFixed(d);
  const qBank={
    light:[
      ()=>`A concave mirror has a focal length of ${ri(8,30)} cm. An object is placed ${ri(15,50)} cm in front of the mirror. Using the mirror formula, find the image position and state whether the image is real or virtual.`,
      ()=>`Light travels from medium A (refractive index ${rf(1.2,1.5)}) to medium B (refractive index ${rf(1.6,2.1)}). Find (a) the critical angle, and (b) what happens when the angle of incidence exceeds this value.`,
      ()=>`A convex lens of focal length ${ri(10,25)} cm forms a real, inverted image ${ri(30,80)} cm from the lens. Find the object distance and calculate the magnification.`,
      ()=>`An object of height ${ri(2,8)} cm is placed ${ri(20,60)} cm in front of a convex mirror of focal length ${ri(10,25)} cm. Find the image height, position, and nature.`,
    ],
    electricity:[
      ()=>`Three resistors of ${ri(3,15)} Ω, ${ri(3,15)} Ω, and ${ri(3,15)} Ω are connected in parallel across a ${ri(6,24)} V battery. Find (a) equivalent resistance, (b) total current, and (c) current through each resistor.`,
      ()=>`A wire of resistance ${ri(10,40)} Ω at 20°C has a temperature coefficient of ${rf(0.003,0.005,4)} /°C. Find its resistance at ${ri(80,200)}°C.`,
      ()=>`A household has ${ri(3,8)} appliances each rated at ${ri(40,200)} W on a ${ri(220,240)} V supply. Calculate total power per day (${ri(4,12)} hours) and monthly cost at ₹${ri(4,8)}/unit.`,
      ()=>`In a Wheatstone bridge: P = ${ri(5,20)} Ω, Q = ${ri(5,20)} Ω, R = ${ri(5,20)} Ω. Find S for bridge balance.`,
    ],
    carbon:[
      ()=>`Write the IUPAC name, structural formula, and isomers of the compound formed when a ${ri(3,6)}-carbon alcohol undergoes complete oxidation. State the type of reaction.`,
      ()=>`An ester is formed from ${["ethanol","propan-1-ol","butan-1-ol"][ri(0,2)]} and ${["ethanoic acid","propanoic acid","methanoic acid"][ri(0,2)]}. Write the balanced equation and name the ester.`,
      ()=>`Compare saturated and unsaturated hydrocarbons with ${ri(2,4)} examples each. Draw structural formulae and explain the difference in reactivity.`,
      ()=>`Explain the cleansing action of soap at the molecular level. Why does soap lose effectiveness in hard water? Draw a micelle diagram.`,
    ],
    humanEye:[
      ()=>`A person with myopia has a far point of ${ri(40,150)} cm. (a) What type of lens is required? (b) Calculate the focal length and power of the corrective lens.`,
      ()=>`The near point of a hypermetropic person is ${ri(50,200)} cm. Calculate the power of the corrective lens required to restore normal near vision (near point = 25 cm).`,
      ()=>`Explain why the sky appears (a) deep blue at noon, (b) reddish-orange at sunrise and sunset. Use Rayleigh's scattering law.`,
      ()=>`Draw a fully labelled diagram of the human eye and explain the role of (a) ciliary muscles, (b) iris, (c) cornea, and (d) retina.`,
    ],
  };
  const predText={
    light:`Exam Generator: ${ri(74,93)}% probability of a ray optics question. Lens formula applications have appeared in ${ri(12,14)} of the last 15 papers.`,
    electricity:`Exam Generator: ${ri(68,88)}% probability. Parallel circuit numericals have appeared consecutively for ${ri(3,5)} years.`,
    carbon:`Exam Generator: ${ri(70,90)}% probability. Ester formation follows a ${ri(2,3)}-year alternating pattern — this year aligns with ester chemistry.`,
    humanEye:`Exam Generator: ${ri(65,85)}% probability. Defects of vision and scattering of light are combined in ${ri(10,13)} of the last 15 papers.`,
  };
  const generate=()=>{
    setLoading(true);setQuestions([]);setPrediction(null);
    setTimeout(()=>{
      setQuestions(qBank[chapter].map((fn,i)=>({id:i,text:fn(),highlight:i===2})));
      setPrediction(predText[chapter]);
      setGc(c=>c+1);setLoading(false);
    },1400);
  };
  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="tag tag-a">🔄 LogicGen · AI Shuffler</div>
        <h1 className="st">Same concept.<br/><em>New question. Every time.</em></h1>
        <p className="ss" style={{marginTop:".7rem"}}>LogicGen strips any PYQ to its core logic structure, then rebuilds it with randomised parameters. Rote memorisation becomes impossible — structural mastery becomes inevitable.</p>
      </section>
      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"250px 1fr",gap:"1.5rem",alignItems:"start"}}>
          <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,padding:"1.4rem",position:"sticky",top:70}}>
            <div style={{fontSize:".7rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1rem"}}>Configure Paper</div>
            <div style={{marginBottom:"1rem"}}>
              <label style={{fontSize:".68rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Class / Exam</label>
              <select value={cls} onChange={e=>setCls(e.target.value)}>
                {["Class 10 — CBSE","Class 12 — CBSE","Class 10 — RBSE","Class 11 — CBSE","JEE Mains","NEET"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{marginBottom:"1rem"}}>
              <label style={{fontSize:".68rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Chapter</label>
              <select value={chapter} onChange={e=>setChapter(e.target.value)}>
                <option value="light">Light — Reflection & Refraction</option>
                <option value="electricity">Electricity & Circuits</option>
                <option value="carbon">Carbon & Its Compounds</option>
                <option value="humanEye">Human Eye & Colourful World</option>
              </select>
            </div>
            <div style={{marginBottom:"1.3rem"}}>
              <label style={{fontSize:".68rem",fontWeight:700,color:"#64748B",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Difficulty</label>
              <div style={{display:"flex",gap:".4rem"}}>
                {["easy","medium","hard"].map(d=>(
                  <button key={d} onClick={()=>setDiff(d)} style={{flex:1,padding:".45rem .2rem",border:"none",borderRadius:7,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:diff===d?BLUE:"rgba(255,255,255,.05)",color:diff===d?"#fff":"#64748B",transition:"all .2s",textTransform:"capitalize"}}>{d}</button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="btn-p" style={{width:"100%",justifyContent:"center",opacity:loading?.6:1}}>
              {loading?"⚡ Generating…":`⚡ Generate${gc>0?" Again":""}`}
            </button>
            {gc>0&&<div style={{marginTop:".8rem",textAlign:"center",fontSize:".74rem",color:"#475569"}}>{gc} paper{gc>1?"s":""} generated · All unique</div>}
          </div>
          <div>
            {!loading&&questions.length===0&&(
              <div style={{background:"#0F1117",border:"1px dashed rgba(255,255,255,.07)",borderRadius:18,padding:"3.5rem 1.5rem",textAlign:"center"}}>
                <div style={{fontSize:"2.5rem",marginBottom:".8rem"}}>⚡</div>
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.3rem",color:"#475569",marginBottom:".5rem"}}>Configure and generate your paper</h3>
                <p style={{color:"#334155",fontSize:".84rem"}}>Select class, chapter, and difficulty — LogicGen will build a unique question set.</p>
              </div>
            )}
            {loading&&(
              <div style={{background:"#0F1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,padding:"3.5rem",textAlign:"center"}}>
                <div style={{width:52,height:52,border:"3px solid rgba(35,84,244,.15)",borderTop:"3px solid #2354F4",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1.2rem"}}/>
                <p style={{color:"#64748B",fontSize:".88rem"}}>Remixing questions…</p>
              </div>
            )}
            {!loading&&questions.length>0&&(
              <div className="fade-in">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".9rem",flexWrap:"wrap",gap:".5rem"}}>
                  <div style={{fontSize:".7rem",fontWeight:700,color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>{diff.toUpperCase()} · {questions.length} Questions</div>
                  <div style={{fontSize:".68rem",fontWeight:700,background:"rgba(35,84,244,.1)",color:"#60A5FA",border:"1px solid rgba(35,84,244,.2)",padding:".22rem .65rem",borderRadius:100}}>AI-Shuffled ✓</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:".8rem",marginBottom:"1rem"}}>
                  {questions.map((q,i)=>(
                    <div key={`${gc}-${i}`} style={{background:q.highlight?"rgba(35,84,244,.06)":"#0F1117",border:`1px solid ${q.highlight?"rgba(35,84,244,.25)":"rgba(255,255,255,.07)"}`,borderRadius:12,padding:"1.1rem 1.2rem",animation:"fadeUp .4s ease both",animationDelay:`${i*.06}s`}}>
                      <div style={{display:"flex",gap:".7rem",alignItems:"flex-start"}}>
                        <div style={{width:24,height:24,borderRadius:7,background:q.highlight?BLUE:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,color:q.highlight?"#fff":"#475569",flexShrink:0}}>Q{i+1}</div>
                        <div>
                          {q.highlight&&<div style={{fontSize:".62rem",fontWeight:700,color:"#60A5FA",letterSpacing:".5px",marginBottom:".35rem"}}>⭐ HIGH PROBABILITY — Oracle Flagged</div>}
                          <p style={{fontSize:".87rem",color:"#CBD5E1",lineHeight:1.65}}>{q.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {prediction&&(
                  <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",borderRadius:12,padding:"1.1rem",display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                    <span style={{fontSize:"1.2rem",flexShrink:0}}>🏆</span>
                    <p style={{fontSize:".83rem",color:"#FCD34D",lineHeight:1.6}}>{prediction}</p>
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

function PricingPage(){
  const [billing,setBilling]=useState("monthly");
  const tiers=[
    {name:"Core Access",price:{monthly:"Free",yearly:"Free"},desc:"Zero financial barrier. Start learning immediately.",color:"#475569",cta:"Get Started Free",ctaC:"ghost",
      features:["Last 3 years PYQ access (Vault-15 preview)","3 Oracle predictions per month","3 LogicGen paper generations/month","Briefs for 2 chapters","Basic Navigator roadmap","Script-Lab — 1 session/month"]},
    {name:"Student Pro",price:{monthly:"₹199",yearly:"₹149"},period:"/month",popular:true,desc:"For serious exam aspirants who want the full edge.",color:BLUE,cta:"Start Free Trial",ctaC:"primary",
      features:["Full Vault-15 — 15 yrs, 7+ boards","Unlimited AI Confidence Scores","LogicGen — unlimited shuffles","Adaptive Testing — unlimited practice tests","Script-Lab — unlimited + progress tracking","Clarity AI — English & Hindi","Briefs for all chapters","Full Navigator + smart redistribution","Edge-Sync offline access"]},
    {name:"School / Coaching",price:{monthly:"₹999",yearly:"₹749"},period:"/month",desc:"For institutions and Kota coaching centres.",color:AMBER,cta:"Book a Demo",ctaC:"amber",
      features:["Everything in Student Pro","Studio-Q — unlimited paper generation","Vari-Test Set A/B/C anti-cheat","Vision-Grade OCR auto-grading","Pilot Dashboard class heatmaps","Bridge-Reports via WhatsApp","Custom branding on papers","Unlimited teacher accounts","Priority support"]},
  ];
  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"4rem 5% 2rem",maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
        <div className="tag" style={{display:"inline-flex"}}>Pricing</div>
        <h1 className="st" style={{margin:"0 auto"}}>Fair pricing.<br/><em>Maximum impact.</em></h1>
        <p className="ss" style={{margin:".7rem auto 2rem",textAlign:"center"}}>Affordable for every Indian student. No hidden fees. Cancel any time.</p>
        <div style={{display:"inline-flex",background:"rgba(255,255,255,.035)",border:"1px solid rgba(255,255,255,.07)",borderRadius:11,padding:".3rem",gap:".3rem",marginBottom:"3rem"}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{padding:".5rem 1.2rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:billing===b?"#2354F4":"transparent",color:billing===b?"#fff":"#64748B",transition:"all .2s",display:"flex",alignItems:"center",gap:".35rem"}}>
              {b.charAt(0).toUpperCase()+b.slice(1)}
              {b==="yearly"&&<span style={{fontSize:".6rem",background:"rgba(16,185,129,.2)",color:"#6EE7B7",padding:".1rem .4rem",borderRadius:100,fontWeight:700}}>-25%</span>}
            </button>
          ))}
        </div>
        <div className="g3" style={{gap:"1.2rem",alignItems:"start"}}>
          {tiers.map((t,i)=>(
            <div key={i} style={{background:"#0F1117",border:`1px solid ${t.popular?BLUE:"rgba(255,255,255,.07)"}`,borderRadius:18,padding:"1.8rem",position:"relative",boxShadow:t.popular?"0 0 50px rgba(35,84,244,.12)":"none",transform:t.popular?"scale(1.02)":"scale(1)"}}>
              {t.popular&&<div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:BLUE,color:"#fff",fontSize:".65rem",fontWeight:700,padding:".28rem .9rem",borderRadius:100,letterSpacing:".5px",whiteSpace:"nowrap"}}>⭐ MOST POPULAR</div>}
              <div style={{fontSize:".7rem",fontWeight:700,color:t.color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:".55rem"}}>{t.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:".3rem",marginBottom:".3rem"}}>
                <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"2.6rem",color:"#F1F5F9",letterSpacing:"-1px"}}>{t.price[billing]}</span>
                {t.period&&<span style={{fontSize:".85rem",color:"#475569"}}>{t.period}</span>}
              </div>
              {billing==="yearly"&&t.price.monthly!=="Free"&&<div style={{fontSize:".72rem",color:"#6EE7B7",marginBottom:".4rem"}}>billed annually · save 25%</div>}
              <p style={{fontSize:".82rem",color:"#64748B",marginBottom:"1.2rem",lineHeight:1.5}}>{t.desc}</p>
              <div style={{height:1,background:"rgba(255,255,255,.05)",marginBottom:"1.2rem"}}/>
              <ul style={{listStyle:"none",marginBottom:"1.8rem",display:"flex",flexDirection:"column",gap:".5rem",textAlign:"left"}}>
                {t.features.map((f,fi)=>(
                  <li key={fi} style={{display:"flex",gap:".55rem",alignItems:"flex-start",fontSize:".83rem",color:"#CBD5E1"}}>
                    <span style={{color:t.color,fontWeight:700,flexShrink:0,marginTop:".1rem"}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={t.ctaC==="primary"?"btn-p":t.ctaC==="amber"?"btn-a":"btn-g"} style={{width:"100%",justifyContent:"center"}}>{t.cta}</button>
            </div>
          ))}
        </div>
      </section>
      <section style={{padding:"4rem 5%",maxWidth:760,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.9rem",color:"#F1F5F9",textAlign:"center",marginBottom:"2rem"}}>Common questions</h2>
        {[
          {q:"Does the free tier work offline?",a:"Yes — Core Access includes Edge-Sync with the latest 3 years of Vault-15 PYQs and Briefs for 2 chapters. Everything is cached locally on first sync under 1 MB."},
          {q:"Is RBSE (Rajasthan Board) covered?",a:"Fully. Vault-15 includes every RBSE paper from 2010 to 2025, tagged across all four metadata vectors. Oracle predictions are tailored per board."},
          {q:"How does Script-Lab work with phone photos?",a:"Script-Lab's vision model is trained on real classroom writing conditions — not studio scans. It works reliably with photos taken under normal indoor lighting."},
          {q:"What if I miss sessions on the Navigator?",a:"Nothing punitive. The Navigator quietly redistributes your missed topics across remaining days and recalculates the completion path without any alerts."},
          {q:"Can a coaching centre use this for 200 students?",a:"The School/Coaching tier supports unlimited student and teacher accounts. Vari-Test generates unique Set A/B/C papers preventing copying across any class size."},
        ].map((f,i)=><FAQItem key={i} q={f.q} a={f.a}/>)}
      </section>
      <section style={{padding:"4rem 5%",background:"rgba(35,84,244,.05)",borderTop:"1px solid rgba(35,84,244,.1)"}}>
        <div style={{maxWidth:660,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:"1.4rem",marginBottom:".9rem"}}>🏆</div>
          <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.4rem,3vw,1.7rem)",color:"#F1F5F9",marginBottom:".8rem"}}>Proudly submitted to iStart Rajasthan 2025</h3>
          <p style={{color:"#64748B",fontSize:".9rem",lineHeight:1.75}}>"We are not just creating another study app. We are building the resilient infrastructure for the National Database of Examination Intelligence — maximising passing percentages and minimising teacher burnout across every tier of the state."</p>
        </div>
      </section>
    </div>
  );
}

function FAQItem({q,a}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:"1px solid rgba(255,255,255,.05)",padding:"1rem 0"}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",fontFamily:"'DM Sans',sans-serif"}}>
        <span style={{fontSize:".92rem",fontWeight:600,color:"#CBD5E1"}}>{q}</span>
        <span style={{color:"#475569",fontSize:"1.1rem",transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0deg)",flexShrink:0}}>+</span>
      </button>
      {open&&<p style={{fontSize:".85rem",color:"#64748B",lineHeight:1.7,marginTop:".7rem",paddingRight:"2rem",animation:"fadeUp .2s ease"}}>{a}</p>}
    </div>
  );
}

function Footer({setPage}){
  const cols=[
    {title:"Platform",links:[["Vault-15","vault15"],["Exam Generator","features"],["LogicGen","logicgen"],["Script-Lab","scriptlab"],["Adaptive Testing","features"]]},
    {title:"For Teachers",links:[["Studio-Q","features"],["Vari-Test","features"],["Vision-Grade","features"],["Pilot Dashboard","features"]]},
    {title:"Company",links:[["Home","home"],["Features","features"],["Pricing","pricing"],["Get Access","pricing"]]},
  ];
  return(
    <footer style={{background:"#060810",borderTop:"1px solid rgba(255,255,255,.04)",padding:"3.5rem 5% 1.8rem"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="r4-sm" style={{marginBottom:"2.5rem"}}>
          <div>
            <button onClick={()=>{setPage("home");window.scrollTo(0,0);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:".45rem",marginBottom:".9rem"}}>
              <div style={{width:26,height:26,background:"linear-gradient(135deg,#2354F4,#60A5FA)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>Q</div>
              <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.15rem",color:"#F1F5F9"}}>QuesGen <em style={{color:"#60A5FA",fontStyle:"normal"}}>AI</em></span>
            </button>
            <p style={{fontSize:".82rem",color:"#334155",lineHeight:1.7,maxWidth:260}}>The National Database of Examination Intelligence. Built for Bharat. Powered by evidence.</p>
            <div style={{marginTop:".8rem",fontSize:".7rem",color:"#1E293B"}}>A proud iStart Rajasthan initiative · 2025</div>
          </div>
          {cols.map((col,i)=>(
            <div key={i}>
              <div style={{fontSize:".68rem",fontWeight:700,color:"#334155",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".9rem"}}>{col.title}</div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".55rem"}}>
                {col.links.map(([label,pg],j)=>(
                  <li key={j}><button onClick={()=>{setPage(pg);window.scrollTo(0,0);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".82rem",color:"#475569",fontFamily:"'DM Sans',sans-serif",transition:"color .2s",padding:0}}
                    onMouseEnter={e=>e.target.style.color="#94A3B8"} onMouseLeave={e=>e.target.style.color="#475569"}>{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.04)",paddingTop:"1.3rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".8rem"}}>
          <span style={{fontSize:".74rem",color:"#1E293B"}}>© 2025 QuesGen. All rights reserved.</span>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:".88rem",color:"#1E293B",fontStyle:"italic"}}>Engineered Preparation. Guaranteed Results.</span>
        </div>
      </div>
    </footer>
  );
}

function App(){
  const [page,setPage]=useState("home");
  const render=()=>{
    switch(page){
      case"home":return <HomePage setPage={setPage}/>;
      case"features":return <FeaturesPage setPage={setPage}/>;
      case"vault15":return <Vault15Page/>;
      case"scriptlab":return <ScriptLabPage/>;
      case"logicgen":return <LogicGenPage/>;
      case"adaptive":return <AdaptiveTesting/>;
      case"pricing":return <PricingPage/>;
      default:return <HomePage setPage={setPage}/>;
    }
  };
  return(
    <>
      <G/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={page} setPage={setPage}/>
        <main style={{flex:1}}>{render()}</main>
        <Footer setPage={setPage}/>
      </div>
    </>
  );
}

export default App;
