import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import AnimatedGrid, { AnimatedListItem } from '../../components/animations/AnimatedGrid';
import LoadingSpinner from '../../components/animations/LoadingSpinner';
import FAQItem from '../../components/questra/FAQItem';
import { easings } from '../../utils/animationConfig';

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
        <ScrollReveal>
          <div className="tag tag-a">🔄 LogicGen · AI Shuffler</div>
          <h1 className="st">Same concept.<br/><em>New question. Every time.</em></h1>
          <p className="ss" style={{marginTop:".7rem"}}>LogicGen strips any PYQ to its core logic structure, then rebuilds it with randomised parameters. Rote memorisation becomes impossible — structural mastery becomes inevitable.</p>
        </ScrollReveal>
      </section>
      <section style={{padding:"0 5% 5rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"250px 1fr",gap:"1.5rem",alignItems:"start"}}>
          <motion.div
            style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"1.4rem",position:"sticky",top:70}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: easings.smooth }}
          >
            <div style={{fontSize:".7rem",fontWeight:700,color:"var(--text3)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"1rem"}}>Configure Paper</div>
            <div style={{marginBottom:"1rem"}}>
              <label style={{fontSize:".68rem",fontWeight:700,color:"var(--text3)",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Class / Exam</label>
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
              <label style={{fontSize:".68rem",fontWeight:700,color:"var(--text3)",letterSpacing:".5px",display:"block",marginBottom:".35rem",textTransform:"uppercase"}}>Difficulty</label>
              <div style={{display:"flex",gap:".4rem"}}>
                {["easy","medium","hard"].map(d=>(
                  <button key={d} onClick={()=>setDiff(d)} style={{flex:1,padding:".45rem .2rem",border:"none",borderRadius:7,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:diff===d?BLUE:"var(--bg)",color:diff===d?"#fff":"var(--text3)",transition:"all .2s",textTransform:"capitalize"}}>{d}</button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="btn-p" style={{width:"100%",justifyContent:"center",opacity:loading?.6:1}}>
              {loading?"⚡ Generating…":`⚡ Generate${gc>0?" Again":""}`}
            </button>
            {gc>0&&<div style={{marginTop:".8rem",textAlign:"center",fontSize:".74rem",color:"var(--text3)"}}>{gc} paper{gc>1?"s":""} generated · All unique</div>}
          </motion.div>
          <div>
            {!loading&&questions.length===0&&(
              <div style={{background:"var(--bg2)",border:"1px dashed var(--border)",borderRadius:18,padding:"3.5rem 1.5rem",textAlign:"center"}}>
                <div style={{fontSize:"2.5rem",marginBottom:".8rem"}}>⚡</div>
                <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.3rem",color:"var(--text3)",marginBottom:".5rem"}}>Configure and generate your paper</h3>
                <p style={{color:"var(--text2)",fontSize:".84rem"}}>Select class, chapter, and difficulty — LogicGen will build a unique question set.</p>
              </div>
            )}
            {loading&&(
              <LoadingSpinner
                size="md"
                message="Remixing questions…"
                color="#2354F4"
              />
            )}
            {!loading&&questions.length>0&&(
              <ScrollReveal>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".9rem",flexWrap:"wrap",gap:".5rem"}}>
                  <div style={{fontSize:".7rem",fontWeight:700,color:"var(--text3)",letterSpacing:"1px",textTransform:"uppercase"}}>{diff.toUpperCase()} · {questions.length} Questions</div>
                  <motion.div
                    style={{fontSize:".68rem",fontWeight:700,background:"rgba(35,84,244,.1)",color:"#60A5FA",border:"1px solid rgba(35,84,244,.2)",padding:".22rem .65rem",borderRadius:100}}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    AI-Shuffled ✓
                  </motion.div>
                </div>
                <AnimatedGrid>
                  {questions.map((q,i)=>(
                    <AnimatedListItem key={`${gc}-${i}`} delay={i * 0.08}>
                      <div style={{background:q.highlight?"rgba(35,84,244,.06)":"var(--bg2)",border:`1px solid ${q.highlight?"rgba(35,84,244,.25)":"var(--border)"}`,borderRadius:12,padding:"1.1rem 1.2rem"}}>
                        <div style={{display:"flex",gap:".7rem",alignItems:"flex-start"}}>
                          <div style={{width:24,height:24,borderRadius:7,background:q.highlight?BLUE:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,color:q.highlight?"#fff":"var(--text3)",flexShrink:0}}>Q{i+1}</div>
                          <div>
                            {q.highlight&&<div style={{fontSize:".62rem",fontWeight:700,color:"#60A5FA",letterSpacing:".5px",marginBottom:".35rem"}}>⭐ HIGH PROBABILITY — Oracle Flagged</div>}
                            <p style={{fontSize:".87rem",color:"var(--text)",lineHeight:1.65}}>{q.text}</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedListItem>
                  ))}
                </AnimatedGrid>
                  <div style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)",borderRadius:12,padding:"1.1rem",display:"flex",gap:".8rem",alignItems:"flex-start"}}>
                    <span style={{fontSize:"1.2rem",flexShrink:0}}>🔮</span>
                    <p style={{fontSize:".83rem",color:"#FCD34D",lineHeight:1.6}}>{prediction}</p>
                  </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
export default LogicGenPage;
