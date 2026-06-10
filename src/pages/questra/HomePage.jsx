import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, BookOpen, Trophy, Sparkles, FileText, Calculator,
  Lightbulb, Target, Zap, Star, ArrowRight, ChevronRight,
  Check, Users, TrendingUp, Shield, Globe,
} from 'lucide-react';

const BLUE = "#2354F4", AMBER = "#D97706", TEAL = "#0891B2", VIOLET = "#7C3AED", GREEN = "#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import StaggerContainer from '../../components/animations/StaggerContainer';
import HoverCard from '../../components/animations/HoverCard';
import TextAnimator from '../../components/animations/TextAnimator';
import NumberCounter from '../../components/animations/NumberCounter';
import FloatingElement from '../../components/animations/FloatingElement';
import ParallaxSection from '../../components/animations/ParallaxSection';
import { easings, staggerContainerVariants, staggerChildVariants } from '../../utils/animationConfig';
import { useIsMobile } from '../../hooks/useIsMobile';

function HomePage({ setPage }) {
  const isMobile = useIsMobile();

  const stats = [
    { n: "12500+", l: "Papers archived" },
    { n: "15",     l: "Years PYQ data"  },
    { n: "7+",     l: "Boards covered"  },
    { n: "4890+",  l: "Papers Generated"},
  ];

  const modules = [
    { icon: "🗄️",  name: "Vault-15",        desc: "15-year indexed archive of original board exam papers across 7+ boards.", color: VIOLET  },
    { icon: "🔮",  name: "Exam Generator",    desc: "AI predicts upcoming exam topics with Confidence Scores from 15-year analysis.", color: BLUE    },
    { icon: "🔄",  name: "LogicGen",         desc: "Rebuilds PYQs with fresh variables — forces structural mastery, not rote memory.", color: AMBER   },
    { icon: "🧠",  name: "Adaptive Testing", desc: "Dynamic AI-generated tests that adapt to your weak areas in real-time.", color: TEAL    },
    { icon: "✍️",  name: "Script-Lab",       desc: "AI reads your handwriting and gives tiny, achievable improvement nudges.", color: "#D97706"},
    { icon: "💡",  name: "Clarity AI",       desc: "Dense textbook jargon converted to fluid Hindi & English for faster comprehension.", color: GREEN   },
    { icon: "📄",  name: "Briefs",           desc: "Every chapter compressed to a 1-page Core-Sheet for 5-minute pre-exam revision.", color: BLUE    },
    { icon: "🗺️", name: "Navigator",        desc: "Self-correcting study calendar — auto-redistributes missed sessions without punishing you.", color: TEAL    },
  ];

  const moduleIcons = [Brain, Trophy, Zap, BookOpen, FileText, Lightbulb, Target, Globe];

  const handleModuleClick = (name) => {
    const map = {
      "Script-Lab":       "scriptlab",
      "Vault-15":         "vault15",
      "LogicGen":         "logicgen",
      "Exam Generator":    "oracle",
      "Adaptive Testing": "adaptive",
    };
    if (map[name]) { setPage(map[name]); window.scrollTo(0, 0); }
  };

  /* ─── MOBILE HERO ─── */
  const MobileHero = () => (
    <section style={{
      minHeight: '100svh',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
      flexDirection: 'column',
      padding: '5.5rem 1.3rem 2.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background gradient orbs — subtle, not distracting */}
      <div style={{
        position: 'absolute', top: '5%', right: '-10%',
        width: '280px', height: '280px',
        background: 'radial-gradient(circle, rgba(124,58,237,.18), transparent 65%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '-5%',
        width: '220px', height: '220px',
        background: 'radial-gradient(circle, rgba(35,84,244,.15), transparent 65%)',
        borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--nav-border) 1px,transparent 1px),linear-gradient(90deg,var(--nav-border) 1px,transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.5,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Accent line above headline */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.5, delay: 0.2, ease: easings.smooth }}
          style={{
            height: 4, borderRadius: 4,
            background: 'linear-gradient(90deg, #2354F4, #7C3AED)',
            marginBottom: '1.2rem',
          }}
        />

        {/* Headline — left aligned */}
        <motion.h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(2.6rem, 11vw, 3.8rem)',
            lineHeight: 1.02, letterSpacing: '-1.5px',
            color: 'var(--text)', marginBottom: '1rem',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: easings.smooth }}
        >
          Stop guessing.<br />
          <span style={{ color: BLUE }}>Start knowing.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{
            fontSize: '0.93rem',
            color: 'var(--text3)', lineHeight: 1.75,
            marginBottom: '1.8rem',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easings.smooth }}
        >
          QuesGen centralises 15 years of examination intelligence — predicting your next paper, improving your handwriting, and saving teachers 15 hours every week.
        </motion.p>

        {/* CTA — full-width stacked */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: easings.smooth }}
        >
          <button
            className="btn-p"
            onClick={() => { setPage('features'); window.scrollTo(0, 0); }}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.92rem', padding: '0.85rem 1.8rem' }}
          >
            Explore Platform <ArrowRight size={15} style={{ marginLeft: 4 }} />
          </button>
          <button
            className="btn-g"
            onClick={() => { setPage('vault15'); window.scrollTo(0, 0); }}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.92rem', padding: '0.85rem 1.8rem' }}
          >
            Open Vault-15 🗄️
          </button>
        </motion.div>

        {/* Trust chips — horizontal scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '1.5rem',
            overflowX: 'auto', flexWrap: 'nowrap',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {["12,500+ Papers", "15 Years", "7+ Boards", "AI-Powered"].map((item, i) => (
            <span
              key={i}
              style={{
                flexShrink: 0,
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.3px',
                padding: '0.3rem 0.7rem', borderRadius: 100,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                color: 'var(--text2)', whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Stats row — card strip at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: easings.smooth }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', marginTop: '2.5rem',
          display: 'flex', flexDirection: 'row',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: '0 0 auto',
            padding: '1rem 1.2rem',
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            minWidth: 100,
          }}>
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
              color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1,
            }}>
              <NumberCounter value={parseInt(s.n)} suffix={s.n.includes('+') ? '+' : ''} duration={2} delay={i * 0.1} />
            </div>
            <div style={{
              fontSize: '0.6rem', color: 'var(--text3)', marginTop: '0.2rem',
              letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {s.l}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );

  /* ─── DESKTOP HERO ─── */
  const DesktopHero = () => (
    <section style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center",
      padding: "9rem 5% 5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <FloatingElement duration={8} distance={30} delay={0} direction="diagonal">
        <div style={{
          position: "absolute", top: "12%", left: "10%",
          width: "min(480px,80vw)", height: "min(480px,80vw)",
          background: "radial-gradient(circle,rgba(35,84,244,.15),transparent 65%)",
          borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
        }} />
      </FloatingElement>
      <FloatingElement duration={10} distance={25} delay={0.5} direction="diagonal">
        <div style={{
          position: "absolute", bottom: "8%", right: "8%",
          width: "min(360px,70vw)", height: "min(360px,70vw)",
          background: "radial-gradient(circle,rgba(124,58,237,.1),transparent 65%)",
          borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
        }} />
      </FloatingElement>

      {/* Floating icon bubbles */}
      {[
        { Icon: Brain,      color: BLUE,   top: "14%",   left:  "6%",   size: 22, dur: 7,   delay: 0,    label: "Oracle AI"  },
        { Icon: Trophy,     color: AMBER,  top: "10%",   right: "8%",   size: 20, dur: 9,   delay: 1.2,  label: "Top Ranks"  },
        { Icon: BookOpen,   color: TEAL,   top: "38%",   left:  "2.5%", size: 20, dur: 8.5, delay: 0.6,  label: "15yr PYQs"  },
        { Icon: Sparkles,   color: VIOLET, top: "30%",   right: "3%",   size: 20, dur: 7.5, delay: 2,    label: "AI Magic"   },
        { Icon: Calculator, color: GREEN,  bottom:"28%", left:  "5%",   size: 18, dur: 10,  delay: 1.5,  label: "Maths"      },
        { Icon: FileText,   color: BLUE,   bottom:"22%", right: "6%",   size: 18, dur: 8,   delay: 0.9,  label: "Papers"     },
        { Icon: Lightbulb,  color: AMBER,  top: "60%",   left:  "1.5%", size: 17, dur: 9.5, delay: 3,    label: "Clarity"    },
        { Icon: Target,     color: TEAL,   top: "55%",   right: "2%",   size: 17, dur: 8,   delay: 2.5,  label: "Focus"      },
        { Icon: Zap,        color: VIOLET, bottom:"40%", right: "8%",   size: 16, dur: 6.5, delay: 1.8,  label: "Fast"       },
        { Icon: Star,       color: GREEN,  top: "22%",   left:  "14%",  size: 16, dur: 11,  delay: 0.4,  label: "Excellence" },
      ].map(({ Icon, color, size, dur, delay, label, ...pos }, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", pointerEvents: "none", zIndex: 0, ...pos }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay * 0.4 + 0.3, duration: 0.6, type: "spring", stiffness: 180, damping: 20 }}
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}
          >
            <div style={{
              width: size + 22, height: size + 22, borderRadius: "50%",
              background: `${color}12`, border: `1.5px solid ${color}25`,
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 20px ${color}18`,
            }}>
              <Icon size={size} color={color} strokeWidth={1.8} />
            </div>
            <span style={{
              fontSize: "9px", fontWeight: 700, color: color,
              opacity: 0.7, letterSpacing: "0.5px", textTransform: "uppercase",
              textShadow: `0 0 12px ${color}40`,
            }}>{label}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* Grid parallax */}
      <ParallaxSection speed={0.2} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          backgroundImage: "linear-gradient(var(--nav-border) 1px,transparent 1px),linear-gradient(90deg,var(--nav-border) 1px,transparent 1px)",
          backgroundSize: "56px 56px", width: "100%", height: "100%",
        }} />
      </ParallaxSection>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easings.smooth }}
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", marginBottom: "1.6rem" }}
        />

        <motion.h1
          style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: "clamp(3rem,8vw,6rem)",
            lineHeight: 1.0, letterSpacing: "-2px",
            color: "var(--text)", marginBottom: "1.4rem",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easings.smooth }}
        >
          <TextAnimator text="Stop guessing." delay={0.4} mode="words" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ color: BLUE }}
          >
            <TextAnimator text="Start knowing." delay={1} mode="words" />
          </motion.div>
        </motion.h1>

        <ScrollReveal delay={0.3}>
          <p style={{
            fontSize: "clamp(.95rem,2.5vw,1.12rem)",
            color: "var(--text3)", lineHeight: 1.85,
            marginBottom: "2.4rem", maxWidth: 560, margin: "0 auto 2.4rem",
          }}>
            QuesGen centralises 15 years of examination intelligence — predicting your next paper, improving your handwriting one step at a time, and saving teachers 15 hours every week.
          </p>
        </ScrollReveal>

        <motion.div
          className="fr"
          style={{ justifyContent: "center", gap: "0.85rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: easings.smooth }}
        >
          <motion.button className="btn-p"
            onClick={() => { setPage("features"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ fontSize: "0.92rem", padding: "0.8rem 1.8rem" }}
          >
            Explore Platform <ArrowRight size={15} style={{ marginLeft: 2 }} />
          </motion.button>
          <motion.button className="btn-g"
            onClick={() => { setPage("vault15"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ fontSize: "0.92rem", padding: "0.8rem 1.8rem" }}
          >
            Open Vault-15 🗄️
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.6rem", marginTop: "2.2rem", flexWrap: "wrap",
            fontSize: "0.75rem", color: "var(--text3)", fontWeight: 600,
            letterSpacing: "0.3px",
          }}
        >
          {["12,500+ Papers", "15 Years", "7+ Boards", "AI-Powered"].map((item, i) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              {i < 3 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text3)", opacity: 0.5, display: "inline-block" }} />}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <StaggerContainer
        className="fr"
        style={{
          position: "relative", zIndex: 1,
          display: "flex", gap: "clamp(2rem,5vw,4rem)",
          marginTop: "5rem", flexWrap: "wrap", justifyContent: "center",
        }}
        containerVariants={staggerContainerVariants}
        childVariants={staggerChildVariants}
      >
        {stats.map((s, i) => (
          <motion.div key={i} style={{ textAlign: "center" }} whileHover={{ scale: 1.08, y: -5 }} transition={{ duration: 0.3 }}>
            <div style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: "clamp(1.6rem,4vw,2.2rem)",
              color: "var(--text)", letterSpacing: "-1px",
            }}>
              <NumberCounter value={parseInt(s.n)} suffix={s.n.includes('+') ? '+' : ''} duration={2.5} delay={i * 0.15} />
            </div>
            <div style={{ fontSize: ".72rem", color: "var(--text2)", marginTop: ".25rem", letterSpacing: ".6px", textTransform: "uppercase", fontWeight: 600 }}>
              {s.l}
            </div>
          </motion.div>
        ))}
      </StaggerContainer>
    </section>
  );

  /* ─── MOBILE MODULE CAROUSEL ─── */
  const MobileModuleCarousel = () => (
    <div style={{
      margin: '0 -1.3rem',
      overflowX: 'auto',
      display: 'flex',
      flexDirection: 'row',
      gap: '0.7rem',
      padding: '0.5rem 1.3rem 1.2rem',
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
    }}>
      {modules.map((m, i) => {
        const ModIcon = moduleIcons[i];
        const isClickable = ["Vault-15","Exam Generator","LogicGen","Adaptive Testing","Script-Lab"].includes(m.name);
        return (
          <motion.div
            key={i}
            onClick={() => isClickable && handleModuleClick(m.name)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: easings.smooth }}
            style={{
              flex: '0 0 195px',
              scrollSnapAlign: 'start',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              cursor: isClickable ? 'pointer' : 'default',
            }}
          >
            {/* Color bar */}
            <div style={{
              height: 4,
              background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
            }} />
            <div style={{ padding: '1rem' }}>
              {/* Icon */}
              <div style={{
                width: 40, height: 40,
                background: `${m.color}14`,
                border: `1px solid ${m.color}28`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
              }}>
                {m.icon}
              </div>
              {/* Name */}
              <div style={{
                fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)',
                marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                {m.name}
                {(m.name === "Vault-15" || m.name === "Script-Lab") && (
                  <span style={{
                    fontSize: '0.5rem', background: `${VIOLET}22`, color: VIOLET,
                    padding: '0.1rem 0.4rem', borderRadius: 100, fontWeight: 700,
                    border: `1px solid ${VIOLET}30`,
                  }}>NEW</span>
                )}
              </div>
              {/* Desc */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.55 }}>
                {m.desc}
              </div>
              {/* Arrow hint */}
              {isClickable && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.2rem',
                  marginTop: '0.7rem', fontSize: '0.7rem', fontWeight: 700,
                  color: m.color, opacity: 0.85,
                }}>
                  Open <ChevronRight size={12} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  /* ─── DESKTOP MODULE GRID ─── */
  const DesktopModuleGrid = () => (
    <motion.div
      className="g3"
      style={{ gap: "1rem" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainerVariants}
    >
      {modules.map((m, i) => {
        const ModIcon = moduleIcons[i];
        return (
          <motion.div key={i} variants={staggerChildVariants} whileHover={{ y: -6 }} transition={{ duration: 0.28 }}>
            <HoverCard
              className="card"
              style={{ padding: "0", cursor: "pointer", height: "100%", overflow: "hidden" }}
              onClick={() => handleModuleClick(m.name)}
            >
              <div style={{
                height: 4,
                background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
                borderRadius: "20px 20px 0 0",
              }} />
              <div style={{ padding: "1.2rem" }}>
                <motion.div
                  style={{
                    width: 44, height: 44,
                    background: `${m.color}14`, border: `1px solid ${m.color}28`,
                    borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "0.9rem",
                  }}
                  whileHover={{ scale: 1.18, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModIcon size={20} color={m.color} strokeWidth={1.8} />
                </motion.div>

                <div style={{
                  fontWeight: 700, fontSize: ".92rem", color: "var(--text)",
                  marginBottom: ".3rem", display: "flex", alignItems: "center", gap: ".4rem",
                }}>
                  {m.name}
                  {(m.name === "Vault-15" || m.name === "Script-Lab") && (
                    <motion.span
                      style={{
                        fontSize: ".56rem", background: `${VIOLET}22`, color: VIOLET,
                        padding: ".1rem .45rem", borderRadius: 100, fontWeight: 700,
                        border: `1px solid ${VIOLET}30`,
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      NEW
                    </motion.span>
                  )}
                </div>

                <div style={{ fontSize: ".81rem", color: "var(--text3)", lineHeight: 1.6 }}>{m.desc}</div>

                {["Vault-15","Exam Generator","LogicGen","Adaptive Testing","Script-Lab"].includes(m.name) && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    marginTop: "0.8rem", fontSize: ".75rem", fontWeight: 600,
                    color: m.color, opacity: 0.85,
                  }}>
                    Open <ChevronRight size={13} />
                  </div>
                )}
              </div>
            </HoverCard>
          </motion.div>
        );
      })}
    </motion.div>
  );

  /* ─── MOBILE CTA SECTION ─── */
  const MobileCtaSection = () => (
    <section style={{
      padding: '3.5rem 1.3rem',
      background: 'linear-gradient(135deg, rgba(35,84,244,.06) 0%, rgba(124,58,237,.04) 50%, rgba(8,145,178,.03) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Icon grid — 2x2 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem',
        marginBottom: '1.8rem',
      }}>
        {[
          { Icon: Users,     color: BLUE,   label: "Students" },
          { Icon: Shield,    color: VIOLET, label: "Trusted"  },
          { Icon: TrendingUp,color: GREEN,  label: "Results"  },
          { Icon: Globe,     color: TEAL,   label: "Offline"  },
        ].map(({ Icon, color, label }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.85rem', borderRadius: 16,
              background: 'var(--bg2)', border: '1px solid var(--border)',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `${color}10`, border: `1px solid ${color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color={color} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)' }}>{label}</span>
          </motion.div>
        ))}
      </div>

      <motion.h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(1.75rem, 7vw, 2.4rem)',
          color: 'var(--text)', marginBottom: '0.85rem', lineHeight: 1.1,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Built for every student.<br />
        <em style={{ color: '#60A5FA' }}>From village to Kota.</em>
      </motion.h2>

      <motion.p
        style={{ color: 'var(--text3)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.6rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Full platform works offline in under 1 MB. Because rural Rajasthan deserves the same preparation quality as the best coaching centres.
      </motion.p>

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <button
          className="btn-p"
          onClick={() => { setPage('pricing'); window.scrollTo(0, 0); }}
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.85rem' }}
        >
          See Pricing <ArrowRight size={15} style={{ marginLeft: 4 }} />
        </button>
        <button
          className="btn-g"
          onClick={() => { setPage('logicgen'); window.scrollTo(0, 0); }}
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.85rem' }}
        >
          Try LogicGen Demo
        </button>
      </motion.div>
    </section>
  );

  /* ─── DESKTOP CTA SECTION ─── */
  const DesktopCtaSection = () => (
    <section style={{
      padding: "7rem 5%",
      background: "linear-gradient(135deg, rgba(35,84,244,.07) 0%, rgba(124,58,237,.05) 50%, rgba(8,145,178,.04) 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(600px,90vw)", height: "min(400px,60vw)",
        background: "radial-gradient(ellipse, rgba(35,84,244,.08), transparent 70%)",
        pointerEvents: "none",
      }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easings.smooth }} viewport={{ once: true }}
        style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <motion.div
          style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }}
        >
          {[
            { Icon: Users,     color: BLUE,   label: "Students" },
            { Icon: Shield,    color: VIOLET, label: "Trusted"  },
            { Icon: TrendingUp,color: GREEN,  label: "Results"  },
            { Icon: Globe,     color: TEAL,   label: "Offline"  },
          ].map(({ Icon, color, label }, i) => (
            <motion.div key={i} style={{ textAlign: "center" }} whileHover={{ y: -4, scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${color}10`, border: `1px solid ${color}22`,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.35rem",
              }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: "clamp(1.9rem,4vw,3rem)",
            color: "var(--text)", marginBottom: "1rem", lineHeight: 1.1,
          }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }} viewport={{ once: true }}
        >
          Built for every student.<br />
          <motion.em
            style={{ color: "#60A5FA" }}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }} viewport={{ once: true }}
          >
            From village to Kota.
          </motion.em>
        </motion.h2>

        <motion.p
          style={{ color: "var(--text3)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 520, margin: "0 auto 2.5rem" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }}
        >
          Full platform works offline in under 1 MB. Because rural Rajasthan deserves the same preparation quality as the best coaching centres.
        </motion.p>

        <motion.div
          className="fr" style={{ justifyContent: "center", gap: "0.9rem" }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }} viewport={{ once: true }}
        >
          <motion.button className="btn-p"
            onClick={() => { setPage("pricing"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ fontSize: "0.92rem", padding: "0.8rem 1.8rem" }}
          >
            See Pricing <ArrowRight size={15} style={{ marginLeft: 2 }} />
          </motion.button>
          <motion.button className="btn-g"
            onClick={() => { setPage("logicgen"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ fontSize: "0.92rem", padding: "0.8rem 1.8rem" }}
          >
            Try LogicGen Demo
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );

  /* ─── VAULT SECTION (shared, layout differs per breakpoint via CSS g2) ─── */
  const VaultSection = () => (
    <section style={{ padding: isMobile ? "3rem 1.3rem" : "6rem 5%", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <div className="g2">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.smooth }} viewport={{ once: true }}
            >
              <div className="tag tag-v" style={{ marginBottom: "1.2rem" }}>🗄️ Vault-15 — New Feature</div>
              <h2 className="st">
                15 years of exam<br /><em>intelligence, indexed.</em>
              </h2>
              <p className="ss" style={{ marginTop: "1rem" }}>
                Vault-15 is the largest archived collection of original board exam papers ever built for Indian boards — 12,500+ papers across 7+ boards, spanning 2010–2025.
              </p>
            </motion.div>

            <motion.div
              style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={staggerContainerVariants}
            >
              {[
                { icon: "📦", t: "12,500+ Papers",   d: "Every board, every class, 2010–2025 — fully archived"     },
                { icon: "🏷️", t: "Complete Papers",  d: "Original format · All sections · Full instructions"        },
                { icon: "📊", t: "Answer Keys",       d: "Verified answer keys for papers from 2015 onwards"         },
                { icon: "🔌", t: "Edge-Sync Offline", d: "Full archive synced under 1 MB for rural access"           },
              ].map((item, i) => (
                <motion.div key={i} variants={staggerChildVariants} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <motion.div
                    style={{
                      width: 40, height: 40,
                      background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.2)",
                      borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem", flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }} transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".93rem", color: "var(--text)" }}>{item.t}</div>
                    <div style={{ fontSize: ".83rem", color: "var(--text3)", marginTop: ".15rem" }}>{item.d}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              className="btn-p"
              style={{
                marginTop: "2.2rem",
                background: "linear-gradient(135deg,#7C3AED,#A78BFA)",
                boxShadow: "0 4px 24px rgba(124,58,237,.35)",
                ...(isMobile ? { width: '100%', justifyContent: 'center' } : {}),
              }}
              onClick={() => { setPage("vault15"); window.scrollTo(0, 0); }}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            >
              Explore Vault-15 <ArrowRight size={15} style={{ marginLeft: 2 }} />
            </motion.button>
          </div>

          {/* Right column — mock browser (hidden on mobile via g2 → 1col) */}
          <HoverCard style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "1.6rem",
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: easings.smooth }} viewport={{ once: true }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginBottom: "1.2rem" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: ".72rem", color: "var(--text2)", marginLeft: ".4rem", fontFamily: "'JetBrains Mono',monospace" }}>vault-15 · browser</span>
              </div>
              <div style={{
                background: "var(--bg3)", border: "1px solid var(--border2)",
                borderRadius: 10, padding: ".6rem 1rem",
                display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1rem",
              }}>
                <span style={{ color: "var(--text2)", fontSize: ".85rem" }}>🔍</span>
                <span style={{ fontSize: ".82rem", color: "var(--text3)" }}>CBSE Class 10 · Physics · Lens Formula</span>
                <span style={{
                  marginLeft: "auto", fontSize: ".68rem",
                  background: "rgba(124,58,237,.15)", color: "#7c3aed",
                  padding: ".2rem .5rem", borderRadius: 6, fontWeight: 700,
                }}>247 results</span>
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainerVariants}>
                {[
                  { yr: "2024", q: "An object is placed 25 cm in front of a convex lens of focal length 15 cm...", diff: "Med",  freq: 8,  conf: 92, bloom: "Apply"    },
                  { yr: "2023", q: "State and prove the mirror formula. Draw a labelled ray diagram...",             diff: "Hard", freq: 11, conf: 87, bloom: "Evaluate" },
                  { yr: "2022", q: "Define refractive index. Calculate the speed of light in glass...",             diff: "Easy", freq: 14, conf: 95, bloom: "Remember" },
                ].map((q, i) => (
                  <motion.div key={i} variants={staggerChildVariants}
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border2)", borderRadius: 12, padding: ".9rem", marginBottom: ".6rem" }}
                    whileHover={{ scale: 1.02, x: 4 }} transition={{ duration: 0.2 }}
                  >
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginBottom: ".5rem" }}>
                      <span style={{
                        fontSize: ".68rem", fontWeight: 700, color: "#7c3aed",
                        background: "rgba(124,58,237,.15)", padding: ".15rem .5rem", borderRadius: 5, flexShrink: 0,
                      }}>{q.yr}</span>
                      <p style={{ fontSize: ".78rem", color: "var(--text2)", lineHeight: 1.5 }}>{q.q}</p>
                    </div>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: ".62rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: 5,
                        background: q.diff === "Easy" ? "rgba(16,185,129,.15)" : q.diff === "Med" ? "rgba(245,158,11,.15)" : "rgba(239,68,68,.15)",
                        color: q.diff === "Easy" ? "#059669" : q.diff === "Med" ? "#d97706" : "#dc2626",
                      }}>{q.diff}</span>
                      <span style={{ fontSize: ".62rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: 5, background: "rgba(35,84,244,.15)", color: "#2354F4" }}>Freq: {q.freq}×</span>
                      <span style={{ fontSize: ".62rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: 5, background: "rgba(16,185,129,.12)", color: "#059669" }}>Oracle: {q.conf}%</span>
                      <span style={{ fontSize: ".62rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: 5, background: "rgba(100,116,139,.12)", color: "var(--text3)" }}>{q.bloom}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </HoverCard>
        </div>
      </ScrollReveal>
    </section>
  );

  /* ════════════════════════════════════════════
      RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="page-enter">

      {/* Hero — completely different on mobile vs desktop */}
      {isMobile ? <MobileHero /> : <DesktopHero />}

      {/* Vault-15 Section */}
      <VaultSection />

      {/* 8 Modules */}
      <section style={{
        padding: isMobile ? "3.5rem 1.3rem" : "5rem 5%",
        background: "rgba(35,84,244,0.02)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ScrollReveal>
            <motion.div
              style={{ textAlign: isMobile ? 'left' : "center", marginBottom: "2.5rem" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.smooth }} viewport={{ once: true }}
            >
              <motion.div
                className="tag"
                style={{ display: "inline-flex", marginBottom: "0.8rem" }}
                whileHover={!isMobile ? { scale: 1.05 } : {}}
              >
                Student Ecosystem
              </motion.div>
              <h2 className="st">
                {isMobile ? "8 Intelligent Modules" : <TextAnimator text="8 Intelligent Modules" delay={0.2} mode="words" />}
              </h2>
              <p className="ss" style={{ margin: ".8rem auto 0", textAlign: isMobile ? 'left' : "center" }}>
                Every feature built to eliminate anxiety and replace it with certainty.
              </p>

              {/* Mobile scroll hint */}
              {isMobile && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  marginTop: '0.7rem', fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 600,
                }}>
                  <span>← Swipe to explore →</span>
                </div>
              )}
            </motion.div>
          </ScrollReveal>

          {isMobile ? <MobileModuleCarousel /> : <DesktopModuleGrid />}
        </div>
      </section>

      {/* CTA Section — completely different on mobile */}
      {isMobile ? <MobileCtaSection /> : <DesktopCtaSection />}

    </div>
  );
}

export default HomePage;
