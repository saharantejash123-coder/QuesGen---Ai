import React, { useState, useEffect, useRef } from 'react';
const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import StaggerContainer from '../../components/animations/StaggerContainer';
import HoverCard from '../../components/animations/HoverCard';
import FAQItem from '../../components/questra/FAQItem';

function PricingPage(){
  const [billing,setBilling]=useState("monthly");
  const tiers=[
    {name:"Core Access",price:{monthly:"Free",yearly:"Free"},desc:"Zero financial barrier. Start learning immediately.",color:"var(--text2)",cta:"Get Started Free",ctaC:"ghost",
      features:["Last 3 years PYQ access (Vault-15 preview)","3 Oracle predictions per month","3 LogicGen paper generations/month","Briefs for 2 chapters","Basic Navigator roadmap","Script-Lab — 1 session/month"]},
    {name:"Student Pro",price:{monthly:"₹199",yearly:"₹149"},period:"/month",popular:true,desc:"For serious exam aspirants who want the full edge.",color:BLUE,cta:"Start Free Trial",ctaC:"primary",
      features:["Full Vault-15 — 15 yrs, 7+ boards","Unlimited AI Confidence Scores","LogicGen — unlimited shuffles","Adaptive Testing — unlimited practice tests","Script-Lab — unlimited + progress tracking","Clarity AI — English & Hindi","Briefs for all chapters","Full Navigator + smart redistribution","Edge-Sync offline access"]},
    {name:"School / Coaching",price:{monthly:"₹999",yearly:"₹749"},period:"/month",desc:"For institutions and Kota coaching centres.",color:AMBER,cta:"Book a Demo",ctaC:"amber",
      features:["Everything in Student Pro","Studio-Q — unlimited paper generation","Vari-Test Set A/B/C anti-cheat","Vision-Grade OCR auto-grading","Pilot Dashboard class heatmaps","Bridge-Reports via WhatsApp","Custom branding on papers","Unlimited teacher accounts","Priority support"]},
  ];
  return(
    <div className="page-enter" style={{paddingTop:80}}>
      <section style={{padding:"4rem 5% 2rem",maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
        <ScrollReveal>
          <div>
            <div className="tag" style={{display:"inline-flex"}}>Pricing</div>
            <h1 className="st" style={{margin:"0 auto"}}>Fair pricing.<br/><em>Maximum impact.</em></h1>
            <p className="ss" style={{margin:".7rem auto 2rem",textAlign:"center"}}>Affordable for every Indian student. No hidden fees. Cancel any time.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div style={{display:"inline-flex",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:11,padding:".3rem",gap:".3rem",marginBottom:"3rem"}}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{padding:".5rem 1.2rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:billing===b?"#2354F4":"transparent",color:billing===b?"#fff":"var(--text3)",transition:"all .2s",display:"flex",alignItems:"center",gap:".35rem"}}>
                {b.charAt(0).toUpperCase()+b.slice(1)}
                {b==="yearly"&&<span style={{fontSize:".6rem",background:"rgba(16,185,129,.2)",color:"#6EE7B7",padding:".1rem .4rem",borderRadius:100,fontWeight:700}}>-25%</span>}
              </button>
            ))}
          </div>
        </ScrollReveal>
        <StaggerContainer className="g3" style={{gap:"1.2rem",alignItems:"start"}}>
          {tiers.map((t,i)=>(
            <HoverCard key={i} style={{background:"var(--card-bg)",border:`1px solid ${t.popular?BLUE:"var(--border)"}`,borderRadius:18,padding:"1.8rem",position:"relative",boxShadow:t.popular?"0 0 50px rgba(35,84,244,.12)":"none"}}>
              {t.popular&&<div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:BLUE,color:"#fff",fontSize:".65rem",fontWeight:700,padding:".28rem .9rem",borderRadius:100,letterSpacing:".5px",whiteSpace:"nowrap"}}>⭐ MOST POPULAR</div>}
              <div style={{fontSize:".7rem",fontWeight:700,color:t.color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:".55rem"}}>{t.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:".3rem",marginBottom:".3rem"}}>
                <span style={{fontFamily:"'Instrument Serif',serif",fontSize:"2.6rem",color:"var(--text)",letterSpacing:"-1px"}}>{t.price[billing]}</span>
                {t.period&&<span style={{fontSize:".85rem",color:"var(--text3)"}}>{t.period}</span>}
              </div>
              {billing==="yearly"&&t.price.monthly!=="Free"&&<div style={{fontSize:".72rem",color:"#6EE7B7",marginBottom:".4rem"}}>billed annually · save 25%</div>}
              <p style={{fontSize:".82rem",color:"var(--text2)",marginBottom:"1.2rem",lineHeight:1.5}}>{t.desc}</p>
              <div style={{height:1,background:"var(--border2)",marginBottom:"1.2rem"}}/>
              <ul style={{listStyle:"none",marginBottom:"1.8rem",display:"flex",flexDirection:"column",gap:".5rem",textAlign:"left"}}>
                {t.features.map((f,fi)=>(
                  <li key={fi} style={{display:"flex",gap:".55rem",alignItems:"flex-start",fontSize:".83rem",color:"var(--text)"}}>
                    <span style={{color:t.color,fontWeight:700,flexShrink:0,marginTop:".1rem"}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={t.ctaC==="primary"?"btn-p":t.ctaC==="amber"?"btn-a":"btn-g"} style={{width:"100%",justifyContent:"center"}}>{t.cta}</button>
            </HoverCard>
          ))}
        </StaggerContainer>
      </section>
      <section style={{padding:"4rem 5%",maxWidth:760,margin:"0 auto"}}>
        <ScrollReveal>
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.9rem",color:"var(--text)",textAlign:"center",marginBottom:"2rem"}}>Common questions</h2>
        </ScrollReveal>
        {[
          {q:"Does the free tier work offline?",a:"Yes — Core Access includes Edge-Sync with the latest 3 years of Vault-15 PYQs and Briefs for 2 chapters. Everything is cached locally on first sync under 1 MB."},
          {q:"Is RBSE (Rajasthan Board) covered?",a:"Fully. Vault-15 includes every RBSE paper from 2010 to 2025, tagged across all four metadata vectors. Oracle predictions are tailored per board."},
          {q:"How does Script-Lab work with phone photos?",a:"Script-Lab's vision model is trained on real classroom writing conditions — not studio scans. It works reliably with photos taken under normal indoor lighting."},
          {q:"What if I miss sessions on the Navigator?",a:"Nothing punitive. The Navigator quietly redistributes your missed topics across remaining days and recalculates the completion path without any alerts."},
          {q:"Can a coaching centre use this for 200 students?",a:"The School/Coaching tier supports unlimited student and teacher accounts. Vari-Test generates unique Set A/B/C papers preventing copying across any class size."},
        ].map((f,i)=>(
          <ScrollReveal key={i} delay={i * 0.1}>
            <FAQItem q={f.q} a={f.a}/>
          </ScrollReveal>
        ))}
      </section>
      <section style={{padding:"4rem 5%",background:"rgba(35,84,244,.05)",borderTop:"1px solid rgba(35,84,244,.1)"}}>
        <ScrollReveal>
          <div style={{maxWidth:660,margin:"0 auto",textAlign:"center"}}>
            <div style={{fontSize:"1.4rem",marginBottom:".9rem"}}>🏆</div>
            <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.4rem,3vw,1.7rem)",color:"var(--text)",marginBottom:".8rem"}}>Proudly submitted to iStart Rajasthan 2025</h3>
            <p style={{color:"var(--text2)",fontSize:".9rem",lineHeight:1.75}}>"We are not just creating another study app. We are building the resilient infrastructure for the National Database of Examination Intelligence — maximising passing percentages and minimising teacher burnout across every tier of the state."</p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
export default PricingPage;
