import React, { useState } from 'react';
const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import HoverCard from '../../components/animations/HoverCard';

function StudentFeaturesPage({ setActiveTab }) {
  const [sel, setSel] = useState(0);
  const features = [
    {icon:"🗄️",name:"Vault-15",tab:"vault15",color:VIOLET,desc:"The largest tagged PYQ archive ever built for Indian boards — 4,28,500+ questions from 2010–2025, each carrying Difficulty, Bloom's Taxonomy, Historical Frequency, and AI Confidence metadata tags.",detail:["4,28,500+ questions fully indexed","7+ boards, Class 9–12","4-Vector metadata per question","Year-wise trend heatmaps"]},
    {icon:"🏆",name:"Exam Generator",tab:"oracle",color:BLUE,desc:"Runs cyclical time-series analysis on Vault-15 and monitors official board circular releases. Generates a Confidence Score for every syllabus topic — explicit probability percentages tied to the upcoming exam cycle.",detail:["15-year historical trend analysis","Monitors board sample papers & circulars","Per-topic Confidence Scores (e.g. 89%)","Updates after each official board communication","Covers all 7+ boards simultaneously"]},
    {icon:"🔄",name:"LogicGen",tab:"logicgen",color:AMBER,desc:"Strips any PYQ down to its core logic structure, then rebuilds it — same concept, completely new numbers, names, coordinates, or scenarios. Forces genuine structural understanding over static answer memorisation.",detail:["Infinite unique variants per question","Replaces integers, entities, and scenarios","Paired Oracle predictions for probability","Export as PDF for offline practice","Works for maths, science, and humanities"]},
    {icon:"🧠",name:"Adaptive Testing",tab:"adaptive",color:TEAL,desc:"Generate dynamic, AI-powered tests on the fly. Questions adapt to your specific weak areas and provide detailed explanations to help you master every topic.",detail:["Unlimited AI-generated questions","Adapts to your weak areas","Instant AI explanations","Performance history tracking","Continuous skill mastery"]},
    {icon:"✍️",name:"Script-Lab",tab:"scriptlab",color:AMBER,desc:"Addresses the critical loss of presentation marks in Indian exams. Upload handwritten mock answers. AI evaluates kerning, baseline alignment, paragraph structure, and whitespace — returning one focused micro-improvement at a time.",detail:["Analyses kerning & baseline drift","Evaluates whitespace & paragraph hierarchy","One targeted improvement per session","Tracks progress across sessions","Works with any language script"]},
    {icon:"💡",name:"Clarity AI",color:GREEN,desc:"Processes dense academic textbook jargon and translates it into fluid, high-retention conversational text. Available in parallel English and Hindi views.",detail:["Instant English & Hindi translation","Jargon → conversational language","Preserves all technical accuracy","Works on any NCERT or state board text","Copy & share simplified explanations"]},
    {icon:"📄",name:"Briefs",color:BLUE,desc:"Condenses every textbook chapter into a standardised 1-page digital reference document containing key formulas, essential dates, structural diagrams, and core concepts.",detail:["1-page per chapter, guaranteed","Key formulas & essential dates","Structural diagrams & mnemonics","Auto-updates if syllabus changes"]},
    {icon:"🗺️",name:"Navigator",color:TEAL,desc:"A self-correcting study calendar that maps a clear path to 100% syllabus completion. Miss a session? The engine auto-redistributes topics across remaining days — no guilt.",detail:["Covers 100% of syllabus automatically","Auto-redistributes missed sessions","Links to Oracle predictions dynamically","Visual completion heatmap","Syncs progress across all devices"]},
  ];
  const cur = features[sel];

  return (
    <div className="page-enter" style={{ paddingTop: 16, background: 'var(--bg)' }}>
      <section style={{ padding: "1.5rem 0 1rem" }}>
        <ScrollReveal>
          <div>
            <div className="tag">Student Features</div>
            <h1 className="st">Your study toolkit.<br /><em>Built for boards.</em></h1>
            <p className="ss" style={{ marginTop: ".7rem" }}>8 AI-powered modules designed exclusively for Indian board exam students.</p>
          </div>
        </ScrollReveal>
      </section>
      <section style={{ padding: "1rem 0 3rem" }}>
        <div className="feat-sidebar-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
            {features.map((f, i) => (
              <button key={i} onClick={() => setSel(i)} style={{ background: sel === i ? `${f.color}14` : "transparent", border: sel === i ? `1px solid ${f.color}28` : "1px solid transparent", borderRadius: 9, padding: ".7rem .9rem", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: ".6rem", transition: "all .2s", fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ fontSize: "1rem" }}>{f.icon}</span>
                <span style={{ fontSize: ".85rem", fontWeight: sel === i ? 700 : 500, color: sel === i ? "var(--text)" : "var(--text3)" }}>{f.name}</span>
                {(f.name === "Vault-15" || f.name === "Script-Lab") && <span style={{ fontSize: ".55rem", background: "rgba(124,58,237,.2)", color: "#7C3AED", padding: ".1rem .35rem", borderRadius: 100, fontWeight: 700, marginLeft: "auto" }}>NEW</span>}
              </button>
            ))}
          </div>
          <ScrollReveal key={sel}>
            <HoverCard className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 56, height: 56, background: `${cur.color}14`, border: `1px solid ${cur.color}22`, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>{cur.icon}</div>
                <div>
                  <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.7rem", color: "var(--text)", marginBottom: ".3rem" }}>{cur.name}</h2>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, color: cur.color, letterSpacing: "1px", textTransform: "uppercase" }}>Student Feature</div>
                </div>
              </div>
              <p style={{ fontSize: ".95rem", color: "var(--text2)", lineHeight: 1.75, marginBottom: "1.8rem" }}>{cur.desc}</p>
              <div style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".8rem" }}>Key Capabilities</div>
              <div className="g2" style={{ gap: ".55rem", marginBottom: "1.5rem" }}>
                {cur.detail.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: ".55rem", alignItems: "flex-start" }}>
                    <span style={{ color: cur.color, fontWeight: 700, flexShrink: 0, marginTop: ".1rem", fontSize: ".85rem" }}>✓</span>
                    <span style={{ fontSize: ".84rem", color: "var(--text2)" }}>{d}</span>
                  </div>
                ))}
              </div>
              {cur.tab && setActiveTab && (
                <div className="fr">
                  <button className="btn-p" style={{ background: `linear-gradient(135deg,${cur.color},${cur.color}cc)`, boxShadow: `0 4px 16px ${cur.color}44` }} onClick={() => { setActiveTab(cur.tab); window.scrollTo(0, 0); }}>
                    Open {cur.name} →
                  </button>
                </div>
              )}
            </HoverCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

export default StudentFeaturesPage;
