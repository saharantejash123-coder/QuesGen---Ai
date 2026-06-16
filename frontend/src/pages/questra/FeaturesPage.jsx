import React, { useState, useEffect, useRef } from 'react';
const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import StaggerContainer from '../../components/animations/StaggerContainer';
import HoverCard from '../../components/animations/HoverCard';
import FAQItem from '../../components/questra/FAQItem';

function FeaturesPage({setPage}){
  const [tab,setTab]=useState("student");
  const [sel,setSel]=useState(0);
  const sf=[
    {icon:"🗄️",name:"Vault-15",color:VIOLET,desc:"The largest tagged PYQ archive ever built for Indian boards — 4,28,500+ questions from 2010–2025, each carrying Difficulty, Bloom's Taxonomy, Historical Frequency, and AI Confidence metadata tags.",detail:["4,28,500+ questions fully indexed","7+ boards, Class 9–12","4-Vector metadata per question","Year-wise trend heatmaps"]},
    {icon:"🏆",name:"Exam Generator",color:BLUE,desc:"Runs cyclical time-series analysis on Vault-15 and monitors official board circular releases. Generates a Confidence Score for every syllabus topic — explicit probability percentages tied to the upcoming exam cycle.",detail:["15-year historical trend analysis","Monitors board sample papers & circulars","Per-topic Confidence Scores (e.g. 89%)","Updates after each official board communication","Covers all 7+ boards simultaneously"]},
    {icon:"🔄",name:"LogicGen",color:AMBER,desc:"Strips any PYQ down to its core logic structure, then rebuilds it — same concept, completely new numbers, names, coordinates, or scenarios. Forces genuine structural understanding over static answer memorisation.",detail:["Infinite unique variants per question","Replaces integers, entities, and scenarios","Paired Oracle predictions for probability","Export as PDF for offline practice","Works for maths, science, and humanities"]},
    {icon:"🧠",name:"Adaptive Testing",color:TEAL,desc:"Generate dynamic, AI-powered tests on the fly. Questions adapt to your specific weak areas and provide detailed explanations to help you master every topic.",detail:["Unlimited AI-generated questions","Adapts to your weak areas","Instant AI explanations","Performance history tracking","Continuous skill mastery"]},
    {icon:"✍️",name:"Script-Lab",color:"#D97706",desc:"Addresses the critical loss of presentation marks in Indian exams. Upload handwritten mock answers. AI evaluates kerning, baseline alignment, paragraph structure, and whitespace — returning one focused micro-improvement at a time.",detail:["Analyses kerning & baseline drift","Evaluates whitespace & paragraph hierarchy","One targeted improvement per session","Tracks progress across sessions","Works with any language script"]},
    {icon:"💡",name:"Clarity AI",color:GREEN,desc:"Processes dense academic textbook jargon and translates it into fluid, high-retention conversational text. Available in parallel English and Hindi views.",detail:["Instant English & Hindi translation","Jargon → conversational language","Preserves all technical accuracy","Works on any NCERT or state board text","Copy & share simplified explanations"]},
    {icon:"📄",name:"Briefs",color:BLUE,desc:"Condenses every textbook chapter into a standardised 1-page digital reference document containing key formulas, essential dates, structural diagrams, and core concepts.",detail:["1-page per chapter, guaranteed","Key formulas & essential dates","Structural diagrams & mnemonics","Auto-updates if syllabus changes"]},
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
    <div className="page-enter" style={{paddingTop:80, background: 'var(--bg)'}}>
      <section style={{padding:"3.5rem 5% 2rem",maxWidth:1200,margin:"0 auto"}}>
        <ScrollReveal>
          <div>
            <div className="tag">Platform Features</div>
            <h1 className="st">Every tool you need.<br/><em>Nothing you don't.</em></h1>
            <p className="ss" style={{marginTop:".7rem"}}>8 student modules and 4 teacher tools in one coherent ecosystem.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div style={{display:"flex",gap:".4rem",marginTop:"2rem",background:"var(--bg3)",borderRadius:11,padding:".35rem",width:"fit-content",border:"1px solid var(--border)"}}>
            {["student","teacher"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setSel(0);}} style={{padding:".55rem 1.3rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:tab===t?"#2354F4":"transparent",color:tab===t?"#fff":"var(--text2)",transition:"all .2s"}}>
                {t==="student"?"👤 For Students":"🏫 For Teachers"}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>
      <section style={{padding:"1rem 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div className="feat-sidebar-grid">
          <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
            {features.map((f,i)=>(
              <button key={i} onClick={()=>setSel(i)} style={{background:sel===i?`${f.color}14`:"transparent",border:sel===i?`1px solid ${f.color}28`:"1px solid transparent",borderRadius:9,padding:".7rem .9rem",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:".6rem",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{fontSize:"1rem"}}>{f.icon}</span>
                <span style={{fontSize:".85rem",fontWeight:sel===i?700:500,color:sel===i?"var(--text)":"var(--text3)"}}>{f.name}</span>
                {(f.name==="Vault-15"||f.name==="Script-Lab")&&<span style={{fontSize:".55rem",background:"rgba(124,58,237,.2)",color:"#7C3AED",padding:".1rem .35rem",borderRadius:100,fontWeight:700,marginLeft:"auto"}}>NEW</span>}
              </button>
            ))}
          </div>
          <ScrollReveal key={`${tab}-${sel}`}>
            <HoverCard className="card" style={{padding:"2rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:"1.2rem",marginBottom:"1.5rem"}}>
                <div style={{width:56,height:56,background:`${cur.color}14`,border:`1px solid ${cur.color}22`,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0}}>{cur.icon}</div>
                <div>
                  <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.7rem",color:"var(--text)",marginBottom:".3rem"}}>{cur.name}</h2>
                  <div style={{fontSize:".7rem",fontWeight:700,color:cur.color,letterSpacing:"1px",textTransform:"uppercase"}}>{tab==="student"?"Student Feature":"Teacher Tool"}</div>
                </div>
              </div>
              <p style={{fontSize:".95rem",color:"var(--text2)",lineHeight:1.75,marginBottom:"1.8rem"}}>{cur.desc}</p>
              <div style={{fontSize:".68rem",fontWeight:700,color:"var(--text3)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:".8rem"}}>Key Capabilities</div>
              <div className="g2" style={{gap:".55rem",marginBottom:"1.5rem"}}>
                {cur.detail.map((d,i)=>(
                  <div key={i} style={{display:"flex",gap:".55rem",alignItems:"flex-start"}}>
                    <span style={{color:cur.color,fontWeight:700,flexShrink:0,marginTop:".1rem",fontSize:".85rem"}}>✓</span>
                    <span style={{fontSize:".84rem",color:"var(--text2)"}}>{d}</span>
                  </div>
                ))}
              </div>
              <div className="fr">
                {cur.name==="Vault-15"&&<button className="btn-p" style={{background:"linear-gradient(135deg,#7C3AED,#A78BFA)",boxShadow:"0 4px 16px rgba(124,58,237,.3)"}} onClick={()=>{setPage("vault15");window.scrollTo(0,0);}}>Open Vault-15 →</button>}
                {cur.name==="Script-Lab"&&<button className="btn-a" onClick={()=>{setPage("scriptlab");window.scrollTo(0,0);}}>Try Script-Lab →</button>}
                {cur.name==="LogicGen"&&<button className="btn-p" onClick={()=>{setPage("logicgen");window.scrollTo(0,0);}}>Try LogicGen →</button>}
                {cur.name==="Exam Generator"&&<button className="btn-p" style={{background:"linear-gradient(135deg,#2354F4,#60A5FA)",boxShadow:"0 4px 16px rgba(35,84,244,.3)"}} onClick={()=>{setPage("oracle");window.scrollTo(0,0);}}>Open Exam Generator →</button>}
                {cur.name==="Adaptive Testing"&&<button className="btn-p" style={{background:"linear-gradient(135deg,#0891B2,#38BDF8)",boxShadow:"0 4px 16px rgba(8,145,178,.3)"}} onClick={()=>{setPage("adaptive");window.scrollTo(0,0);}}>Try Adaptive Testing →</button>}
              </div>
            </HoverCard>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
export default FeaturesPage;
