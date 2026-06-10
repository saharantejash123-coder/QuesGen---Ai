import React, { useState } from 'react';
import { motion } from 'framer-motion';

import ScrollReveal from '../../components/animations/ScrollReveal';
import AnimatedGrid, { AnimatedListItem } from '../../components/animations/AnimatedGrid';
import StaggerContainer from '../../components/animations/StaggerContainer';
import { staggerContainerVariants, staggerChildVariants, easings } from '../../utils/animationConfig';





/* ── mock paper catalogue (2010-2025) ── */
const boards = ["CBSE","RBSE","ICSE","UP Board","Maharashtra","Bihar","MP Board","Karnataka"];
const classes = ["Class 9","Class 10","Class 11","Class 12"];
const subjects = ["Physics","Chemistry","Mathematics","Biology","English","Hindi","Social Science"];
const years = Array.from({length:16},(_,i)=>2025-i);  // 2025 down to 2010

import { englishPYQ2025 } from '../../data/pyq/english-10-2025';
import { englishRBSCPYQ2025 } from '../../data/pyq/english-10-rbse-2025';

const generatePapers = (board,cls,subj) => {
  if (board === "CBSE" && cls === "Class 10" && subj === "English") {
    return [
      {
        id: englishPYQ2025.id,
        board: englishPYQ2025.board,
        class: englishPYQ2025.class,
        subject: englishPYQ2025.subject,
        year: englishPYQ2025.year,
        title: englishPYQ2025.title,
        sets: ["Set 1", "Set 2", "Set 3"],
        duration: englishPYQ2025.duration,
        maxMarks: englishPYQ2025.maxMarks,
        sections: englishPYQ2025.sections.length,
        totalQuestions: 12, // example
        pages: 10,
        language: "English",
        hasAnswerKey: true,
        hasSolution: true
      }
    ];
  }
  if (board === "RBSE" && cls === "Class 10" && subj === "English") {
    const realPYQ = {
      id: englishRBSCPYQ2025.id,
      board: englishRBSCPYQ2025.board,
      class: englishRBSCPYQ2025.class,
      subject: englishRBSCPYQ2025.subject,
      year: englishRBSCPYQ2025.year,
      title: englishRBSCPYQ2025.title,
      sets: ["Set 1", "Set 2", "Set 3"],
      duration: englishRBSCPYQ2025.duration,
      maxMarks: englishRBSCPYQ2025.maxMarks,
      sections: englishRBSCPYQ2025.sections.length,
      totalQuestions: 20, // example
      pages: 10,
      language: "English",
      hasAnswerKey: true,
      hasSolution: true,
      pdfUrl: "/rbse-class10-english-paper.pdf"
    };

    const mockPapers = years.filter(y => y !== 2025).map(yr => ({
      id: `${board}-${cls}-${subj}-${yr}`,
      board, class: cls, subject: subj, year: yr,
      title: `${board} ${cls} ${subj} — Annual Examination ${yr}`,
      sets: yr >= 2018 ? ["Set 1","Set 2","Set 3"] : yr >= 2014 ? ["Set 1","Set 2"] : ["Set 1"],
      duration: "3 Hours",
      maxMarks: 80,
      sections: 4,
      totalQuestions: Math.floor(Math.random()*6) + 28,
      pages: Math.floor(Math.random()*4) + 8,
      language: "English",
      hasAnswerKey: yr >= 2015,
      hasSolution: yr >= 2018,
      pdfUrl: "/rbse-class10-english-paper.pdf"
    }));

    return [realPYQ, ...mockPapers];
  }
  return years.map(yr => ({
    id: `${board}-${cls}-${subj}-${yr}`,
    board, class: cls, subject: subj, year: yr,
    title: `${board} ${cls} ${subj} — Annual Examination ${yr}`,
    sets: yr >= 2018 ? ["Set 1","Set 2","Set 3"] : yr >= 2014 ? ["Set 1","Set 2"] : ["Set 1"],
    duration: cls.includes("9") || cls.includes("10") ? "3 Hours" : "3 Hours",
    maxMarks: subj === "English" || subj === "Hindi" ? 80 : 70,
    sections: subj === "Mathematics" ? 5 : 4,
    totalQuestions: Math.floor(Math.random()*6) + 28,
    pages: Math.floor(Math.random()*4) + 8,
    language: subj === "Hindi" ? "Hindi" : "English",
    hasAnswerKey: yr >= 2015,
    hasSolution: yr >= 2018,
  }));
};

function Vault15Page(){
  const [board,setBoard]=useState("CBSE");
  const [cls,setCls]=useState("Class 10");
  const [subj,setSubj]=useState("Physics");
  const [searched,setSearched]=useState(false);
  const [loading,setLoading]=useState(false);
  const [papers,setPapers]=useState([]);
  const [viewPaper,setViewPaper]=useState(null);
  const [activeSet,setActiveSet]=useState("Set 1");

  const search=()=>{
    setLoading(true);setSearched(false);setPapers([]);
    setTimeout(()=>{
      setPapers(generatePapers(board,cls,subj));
      setSearched(true);setLoading(false);
    },800);
  };

  return(
    <div className="page-enter" style={{paddingTop:80}}>
      {/* ── Hero ── */}
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <ScrollReveal>
          <div className="tag tag-v">🗄️ Vault-15 — Past Paper Archive</div>
        </ScrollReveal>
        <div className="g2" style={{gap:"3rem",alignItems:"flex-start"}}>
          <ScrollReveal>
            <div>
              <h1 className="st">15 years of real<br/><em>exam papers, archived.</em></h1>
              <p className="ss" style={{marginTop:".8rem"}}>Browse the largest indexed collection of original board examination papers from 2010–2025. Every paper is preserved in its original format — complete with all sections, instructions, and marking schemes.</p>
            </div>
          </ScrollReveal>
          <AnimatedGrid containerVariants={staggerContainerVariants} itemVariants={staggerChildVariants}>
            {[
              {n:"12,500+",l:"Papers",c:"#7C3AED"},
              {n:"5",l:"Boards",c:"#2354F4"},
              {n:"15 yrs",l:"Coverage",c:"#0891B2"},
              {n:"100%",l:"Original",c:"#D97706"},
            ].map((s,i)=>(
              <div key={i} style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:12,padding:"1rem .8rem",textAlign:"center"}}>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.2rem,3vw,1.6rem)",color:"var(--text)",letterSpacing:"-.5px"}}>{s.n}</div>
                <div style={{fontSize:".68rem",color:"var(--text3)",marginTop:".2rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{s.l}</div>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* ── Search Panel ── */}
      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:20,overflow:"hidden"}}>
          {/* Header bar */}
          <div style={{background:"rgba(124,58,237,.06)",borderBottom:"1px solid rgba(124,58,237,.12)",padding:"1.2rem 1.8rem",display:"flex",alignItems:"center",gap:".8rem"}}>
            <span style={{fontSize:"1.2rem"}}>🗄️</span>
            <span style={{fontWeight:700,color:"#7C3AED",fontSize:".9rem"}}>Paper Archive Browser</span>
            <span style={{marginLeft:"auto",fontSize:".72rem",color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>12,500+ papers indexed</span>
          </div>

          <div style={{padding:"1.8rem"}}>
            {/* Filters */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                {label:"Board",val:board,set:setBoard,opts:boards},
                {label:"Class",val:cls,set:setCls,opts:classes},
                {label:"Subject",val:subj,set:setSubj,opts:subjects},
              ].map(f=>(
                <div key={f.label}>
                  <label style={{fontSize:".68rem",fontWeight:700,color:"var(--text3)",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>{f.label}</label>
                  <select value={f.val} onChange={e=>f.set(e.target.value)} style={{width:"100%",padding:".6rem .8rem",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg3)",color:"var(--text)",fontSize:".85rem",cursor:"pointer"}}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{display:"flex",alignItems:"flex-end"}}>
                <button onClick={search} disabled={loading} className="btn-p" style={{width:"100%",justifyContent:"center",background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 16px rgba(124,58,237,.3)",opacity:loading?.6:1}}>
                  {loading?"Searching…":"🔍 Browse Papers"}
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading&&(
              <div style={{textAlign:"center",padding:"3rem"}}>
                <div style={{width:48,height:48,border:"3px solid rgba(124,58,237,.2)",borderTop:"3px solid #7C3AED",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}/>
                <p style={{color:"var(--text3)",fontSize:".88rem"}}>Scanning paper archive…</p>
              </div>
            )}

            {/* Results */}
            {!loading&&searched&&(
              <div className="fade-in">
                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",padding:"1rem",background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)",borderRadius:12,marginBottom:"1.2rem"}}>
                  <span style={{fontSize:".8rem",fontWeight:700,color:"#7C3AED"}}>📄 {papers.length} papers found</span>
                  <span style={{color:"var(--border)"}}>|</span>
                  <span style={{fontSize:".78rem",color:"var(--text3)"}}>{board} · {cls} · {subj} · 2010–2025</span>
                </div>

                {/* Paper Cards Grid */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem",maxHeight:600,overflowY:"auto",paddingRight:4}}>
                  {papers.map((p)=>(
                    <div key={p.id}
                      onClick={()=>{setViewPaper(p);setActiveSet(p.sets[0]);}}
                      style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:14,padding:"1.2rem",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(124,58,237,.4)";e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.transform="translateY(0)";}}
                    >
                      {/* Year Badge */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".8rem"}}>
                        <span style={{fontSize:"1.4rem",fontWeight:800,color:"#7C3AED",fontFamily:"'Instrument Serif',serif"}}>{p.year}</span>
                        <div style={{display:"flex",gap:".3rem"}}>
                          {p.hasAnswerKey&&<span style={{fontSize:".58rem",fontWeight:700,background:"rgba(16,185,129,.12)",color:"#059669",padding:".15rem .4rem",borderRadius:5}}>Answer Key</span>}
                          {p.hasSolution&&<span style={{fontSize:".58rem",fontWeight:700,background:"rgba(35,84,244,.12)",color:"#2354F4",padding:".15rem .4rem",borderRadius:5}}>Solutions</span>}
                        </div>
                      </div>
                      {/* Paper Title */}
                      <h3 style={{fontSize:".88rem",fontWeight:600,color:"var(--text)",lineHeight:1.4,marginBottom:".6rem"}}>{p.title}</h3>
                      {/* Meta Row */}
                      <div style={{display:"flex",gap:".4rem",flexWrap:"wrap",marginBottom:".6rem"}}>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .45rem",borderRadius:5,background:"rgba(124,58,237,.1)",color:"#7c3aed"}}>{p.duration}</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .45rem",borderRadius:5,background:"rgba(217,119,6,.1)",color:"#d97706"}}>{p.maxMarks} Marks</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .45rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:"var(--text3)"}}>{p.sections} Sections</span>
                        <span style={{fontSize:".62rem",fontWeight:700,padding:".15rem .45rem",borderRadius:5,background:"rgba(255,255,255,.06)",color:"var(--text3)"}}>{p.pages} Pages</span>
                      </div>
                      {/* Sets */}
                      <div style={{display:"flex",gap:".3rem"}}>
                        {p.sets.map(s=>(
                          <span key={s} style={{fontSize:".62rem",fontWeight:600,padding:".2rem .5rem",borderRadius:6,border:"1px solid var(--border)",color:"var(--text3)"}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading&&!searched&&(
              <div style={{textAlign:"center",padding:"3rem 1rem",border:"1px dashed var(--border)",borderRadius:14}}>
                <div style={{fontSize:"2.5rem",marginBottom:".8rem"}}>🗄️</div>
                <p style={{color:"var(--text3)",fontSize:".88rem"}}>Select your Board, Class, & Subject — then browse 15 years of original exam papers.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Paper Detail Modal ── */}
      {viewPaper&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"5%"}} onClick={()=>setViewPaper(null)}>
          <div style={{background:"var(--card-bg)",border:"1px solid rgba(124,58,237,.3)",borderRadius:20,padding:"2rem",maxWidth:680,width:"100%",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem"}}>
              <div>
                <div style={{fontSize:".7rem",fontWeight:700,color:"#7C3AED",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".3rem"}}>Vault-15 · Paper Details</div>
                <h2 style={{fontSize:"1.1rem",fontWeight:700,color:"var(--text)",lineHeight:1.3}}>{viewPaper.title}</h2>
              </div>
              <button onClick={()=>setViewPaper(null)} style={{background:"var(--bg3)",border:"1px solid var(--border)",cursor:"pointer",width:30,height:30,borderRadius:8,color:"var(--text3)",fontSize:"1rem",flexShrink:0}}>✕</button>
            </div>

            {/* Info Grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:".8rem",marginBottom:"1.5rem"}}>
              {[
                {label:"Board",value:viewPaper.board},
                {label:"Class",value:viewPaper.class},
                {label:"Subject",value:viewPaper.subject},
                {label:"Year",value:viewPaper.year},
                {label:"Duration",value:viewPaper.duration},
                {label:"Max Marks",value:viewPaper.maxMarks},
                {label:"Sections",value:viewPaper.sections},
                {label:"Pages",value:viewPaper.pages},
                {label:"Language",value:viewPaper.language},
              ].map(info=>(
                <div key={info.label} style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:10,padding:".7rem"}}>
                  <div style={{fontSize:".62rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:".2rem"}}>{info.label}</div>
                  <div style={{fontSize:".9rem",fontWeight:600,color:"var(--text)"}}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Paper Set Tabs */}
            <div style={{marginBottom:"1.2rem"}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:".5rem"}}>Available Sets</div>
              <div style={{display:"flex",gap:".5rem"}}>
                {viewPaper.sets.map(s=>(
                  <button key={s} onClick={()=>setActiveSet(s)} style={{padding:".5rem 1rem",borderRadius:10,border:activeSet===s?"1px solid #7C3AED":"1px solid var(--border)",background:activeSet===s?"rgba(124,58,237,.12)":"var(--bg3)",color:activeSet===s?"#7C3AED":"var(--text3)",fontSize:".82rem",fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{s}</button>
                ))}
              </div>
            </div>

            {/* Paper Preview Placeholder */}
            <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:14,padding:"2rem",textAlign:"center",marginBottom:"1.5rem"}}>
              <div style={{fontSize:"3rem",marginBottom:".8rem"}}>📄</div>
              <h3 style={{fontWeight:700,color:"var(--text)",fontSize:"1rem",marginBottom:".3rem"}}>{viewPaper.board} {viewPaper.class} {viewPaper.subject}</h3>
              <p style={{color:"var(--text3)",fontSize:".85rem",marginBottom:".2rem"}}>Annual Examination {viewPaper.year} — {activeSet}</p>
              <p style={{color:"var(--text3)",fontSize:".75rem"}}>Time Allowed: {viewPaper.duration} | Maximum Marks: {viewPaper.maxMarks}</p>
              <div style={{marginTop:"1rem",padding:"1rem",background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,textAlign:"left"}}>
                <p style={{fontSize:".75rem",fontWeight:700,color:"var(--text)",marginBottom:".5rem"}}>GENERAL INSTRUCTIONS:</p>
                <ol style={{fontSize:".75rem",color:"var(--text3)",lineHeight:1.8,paddingLeft:"1.2rem"}}>
                  <li>All questions are compulsory.</li>
                  <li>This question paper contains {viewPaper.sections} sections.</li>
                  <li>Section A has objective type questions of 1 mark each.</li>
                  <li>Section B has short answer questions of 2-3 marks each.</li>
                  <li>Section {String.fromCharCode(64+viewPaper.sections)} has long answer questions of 5 marks each.</li>
                  <li>There is no overall choice. However, internal choices are provided.</li>
                  <li>Use of calculators is not permitted.</li>
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display:"flex",gap:".7rem",flexWrap:"wrap"}}>
              <button 
                onClick={() => {
                  if (viewPaper.pdfUrl) {
                    const link = document.createElement("a");
                    link.href = viewPaper.pdfUrl;
                    link.download = `${viewPaper.board}_${viewPaper.class}_${viewPaper.subject}_${viewPaper.year}.pdf`.replace(/ /g, "_");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    alert("PDF not available for this mock paper.");
                  }
                }}
                className="btn-p" 
                style={{flex:1,justifyContent:"center",fontSize:".82rem",background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 16px rgba(124,58,237,.3)"}}
              >
                📥 Download Paper PDF
              </button>
              {viewPaper.hasAnswerKey&&<button className="btn-g" style={{flex:1,justifyContent:"center",fontSize:".82rem"}}>📋 View Answer Key</button>}
              {viewPaper.hasSolution&&<button className="btn-g" style={{flex:1,justifyContent:"center",fontSize:".82rem"}}>📝 View Solutions</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Vault15Page;
