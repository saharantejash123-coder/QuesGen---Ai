import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, BookOpen, Trophy, FileText,
  Lightbulb, Target, Zap, ArrowRight, ChevronRight,
  Check, Users, TrendingUp, Shield, Globe,
} from 'lucide-react';

const BLUE = "#2354F4", AMBER = "#D97706", TEAL = "#0891B2", VIOLET = "#7C3AED", GREEN = "#059669";

import ScrollReveal from '../../components/animations/ScrollReveal';
import StaggerContainer from '../../components/animations/StaggerContainer';
import HoverCard from '../../components/animations/HoverCard';
import TextAnimator from '../../components/animations/TextAnimator';
import NumberCounter from '../../components/animations/NumberCounter';
import { easings, staggerContainerVariants, staggerChildVariants } from '../../utils/animationConfig';
import { useIsMobile } from '../../hooks/useIsMobile';
import ModuleSwiper from '../../components/landing/ModuleSwiper';
import ProfileCard from '../../components/landing/ProfileCard';

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
    { icon: "🏆",  name: "Exam Generator",    desc: "AI predicts upcoming exam topics with Confidence Scores from 15-year analysis.", color: BLUE    },
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
          borderRadius: 18, overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
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
      flexDirection: "column",
      padding: "9rem 5% 5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Flashy drifting aurora */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="lp-aurora" style={{ position: "absolute", top: "-15%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,84,244,0.16) 0%, transparent 68%)", filter: "blur(10px)" }} />
        <div className="lp-aurora" style={{ position: "absolute", bottom: "-12%", left: "-8%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 68%)", filter: "blur(10px)", animationDelay: "-7s", animationDuration: "22s" }} />
        <div className="lp-aurora" style={{ position: "absolute", top: "28%", left: "42%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(8,145,178,0.10) 0%, transparent 70%)", filter: "blur(12px)", animationDelay: "-12s", animationDuration: "26s" }} />
      </div>
      {/* Two-column hero */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(3rem,6vw,7rem)",
          alignItems: "center",
        }}>

          {/* ── LEFT: text ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easings.smooth }}
          >
            <motion.h1
              style={{
                fontFamily: "'Instrument Serif',serif",
                fontSize: "clamp(3rem,5.5vw,6.5rem)",
                lineHeight: 1.0, letterSpacing: "-3px",
                color: "var(--text)", marginBottom: "1.6rem",
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
                fontSize: "clamp(.95rem,1.4vw,1.2rem)",
                color: "var(--text3)", lineHeight: 1.85,
                maxWidth: 520, marginBottom: "2.4rem",
              }}>
                QuesGen centralises 15 years of examination intelligence — predicting your next paper, improving your handwriting one step at a time, and saving teachers 15 hours every week.
              </p>
            </ScrollReveal>

            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "clamp(0.7rem,1.5vw,1.2rem)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: easings.smooth }}
            >
              <motion.button className="btn-p"
                onClick={() => { setPage("features"); window.scrollTo(0, 0); }}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ fontSize: "clamp(0.9rem,1.1vw,1rem)", padding: "0.9rem 2rem" }}
              >
                Explore Platform <ArrowRight size={16} style={{ marginLeft: 4 }} />
              </motion.button>
              <motion.button className="btn-g"
                onClick={() => { setPage("vault15"); window.scrollTo(0, 0); }}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ fontSize: "clamp(0.9rem,1.1vw,1rem)", padding: "0.9rem 2rem" }}
              >
                Open Vault-15 🗄️
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.6rem", marginTop: "2rem" }}
            >
              {["12,500+ Papers", "15 Years", "7+ Boards", "AI-Powered"].map((item, i) => (
                <motion.span
                  key={i}
                  className="lp-glass"
                  whileHover={{ y: -2 }}
                  style={{ padding: "0.42rem 0.95rem", borderRadius: 100, fontSize: "clamp(0.72rem,0.8vw,0.82rem)", fontWeight: 700, color: "var(--text2)", letterSpacing: "0.2px" }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: big logo ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.18 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{
              position: "relative",
              width: "min(380px,32vw)", height: "min(380px,32vw)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* radial glow */}
              <div style={{ position: "absolute", inset: "-10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(35,84,244,0.22) 0%, rgba(124,58,237,0.10) 45%, transparent 70%)", pointerEvents: "none" }} />
              {/* rotating conic light-sweep ring */}
              <div style={{ position: "absolute", inset: "-4%", borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0deg 210deg, rgba(35,84,244,0.5) 300deg, rgba(124,58,237,0.65) 345deg, transparent 360deg)", WebkitMask: "radial-gradient(circle, transparent 62%, #000 63%)", mask: "radial-gradient(circle, transparent 62%, #000 63%)", animation: "lp-orbit 14s linear infinite", pointerEvents: "none" }} />
              {/* dashed counter-rotating ring */}
              <div style={{ position: "absolute", inset: "5%", borderRadius: "50%", border: "1.5px dashed rgba(124,58,237,0.25)", animation: "lp-orbit-rev 32s linear infinite", pointerEvents: "none" }} />
              {/* orbiting accent dot */}
              <div style={{ position: "absolute", inset: "-4%", animation: "lp-orbit 9s linear infinite", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "-1.5%", left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg,#2354F4,#7C3AED)", boxShadow: "0 0 18px rgba(35,84,244,0.9)" }} />
              </div>
              {/* floating logo */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "78%", height: "78%", position: "relative", zIndex: 1 }}
              >
                <img
                  src="/logo.png"
                  alt="QuesGen AI"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                    display: "block",
                    filter: "drop-shadow(0 14px 34px rgba(35,84,244,0.35))",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row — single responsive row with dividers */}
        <StaggerContainer
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            marginTop: "clamp(3rem,5vw,5rem)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
          containerVariants={staggerContainerVariants}
          childVariants={staggerChildVariants}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ background: "var(--bg2)" }}
              transition={{ duration: 0.2 }}
              style={{
                textAlign: "center",
                padding: "clamp(1.2rem,2.5vw,2rem) clamp(0.5rem,1vw,1rem)",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{
                fontFamily: "'Instrument Serif',serif",
                fontSize: "clamp(1.4rem,3vw,2.4rem)",
                letterSpacing: "-1px", lineHeight: 1,
                background: "linear-gradient(135deg, var(--text), #2354F4)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                <NumberCounter value={parseInt(s.n)} suffix={s.n.includes('+') ? '+' : ''} duration={2.5} delay={i * 0.15} />
              </div>
              <div style={{ fontSize: "clamp(0.68rem,0.8vw,0.82rem)", color: "var(--text3)", marginTop: ".45rem", letterSpacing: ".6px", textTransform: "uppercase", fontWeight: 600 }}>
                {s.l}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
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
      className="modules-grid"
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
                height: "clamp(4px,0.4vw,6px)",
                background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
                borderRadius: "20px 20px 0 0",
              }} />
              <div style={{ padding: "clamp(1.2rem,1.8vw,1.8rem)" }}>
                <motion.div
                  style={{
                    width: "clamp(44px,4vw,56px)",
                    height: "clamp(44px,4vw,56px)",
                    background: `${m.color}14`, border: `1px solid ${m.color}28`,
                    borderRadius: "clamp(13px,1.2vw,16px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "clamp(0.9rem,1.2vw,1.2rem)",
                  }}
                  whileHover={{ scale: 1.18, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModIcon size="clamp(20px,1.8vw,26px)" color={m.color} strokeWidth={1.8} />
                </motion.div>

                <div style={{
                  fontWeight: 700, fontSize: "clamp(.92rem,1.2vw,1.1rem)", color: "var(--text)",
                  marginBottom: ".3rem", display: "flex", alignItems: "center", gap: ".4rem",
                }}>
                  {m.name}
                  {(m.name === "Vault-15" || m.name === "Script-Lab") && (
                    <motion.span
                      style={{
                        fontSize: "clamp(.56rem,0.55vw,.65rem)", background: `${VIOLET}22`, color: VIOLET,
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

                <div style={{ fontSize: "clamp(.81rem,1vw,.92rem)", color: "var(--text3)", lineHeight: 1.6 }}>{m.desc}</div>

                {["Vault-15","Exam Generator","LogicGen","Adaptive Testing","Script-Lab"].includes(m.name) && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    marginTop: "clamp(0.8rem,1vw,1rem)", fontSize: "clamp(.75rem,0.85vw,.85rem)", fontWeight: 600,
                    color: m.color, opacity: 0.85,
                  }}>
                    Open <ChevronRight size="clamp(13px,1vw,15px)" />
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
      <div className="r2" style={{ marginBottom: '1.8rem' }}>
        {[
          { Icon: Users,     color: BLUE,   label: "Students" },
          { Icon: Shield,    color: VIOLET, label: "Trusted"  },
          { Icon: TrendingUp,color: GREEN,  label: "Results"  },
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
      padding: "clamp(7rem,10vw,12rem) 5%",
      background: "linear-gradient(135deg, rgba(35,84,244,.07) 0%, rgba(124,58,237,.05) 50%, rgba(8,145,178,.04) 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(800px,80vw)", height: "min(600px,60vw)",
        background: "radial-gradient(ellipse, rgba(35,84,244,.1), rgba(124,58,237,.05) 40%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "15%", right: "8%",
        width: "clamp(200px,18vw,350px)", height: "clamp(200px,18vw,350px)",
        background: "radial-gradient(circle, rgba(16,185,129,.06), transparent 65%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "5%",
        width: "clamp(180px,15vw,300px)", height: "clamp(180px,15vw,300px)",
        background: "radial-gradient(circle, rgba(124,58,237,.06), transparent 65%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easings.smooth }} viewport={{ once: true }}
        style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <motion.div
          style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem,2vw,2rem)", marginBottom: "2.5rem" }}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }}
        >
          {[
            { Icon: Users,     color: BLUE,   label: "Students" },
            { Icon: Shield,    color: VIOLET, label: "Trusted"  },
            { Icon: TrendingUp,color: GREEN,  label: "Results"  },
          ].map(({ Icon, color, label }, i) => (
            <motion.div key={i} style={{ textAlign: "center" }} whileHover={{ y: -6, scale: 1.08 }} transition={{ duration: 0.25 }}>
              <div style={{
                width: "clamp(48px,4vw,64px)", height: "clamp(48px,4vw,64px)", borderRadius: "clamp(14px,1.2vw,18px)",
                background: `${color}10`, border: `1px solid ${color}22`,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem",
              }}>
                <Icon size="clamp(20px,1.8vw,26px)" color={color} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: "clamp(0.65rem,0.7vw,0.78rem)", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: "clamp(1.9rem,5vw,3.8rem)",
            color: "var(--text)", marginBottom: "1.2rem", lineHeight: 1.08, letterSpacing: "-1.5px",
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



        <motion.div
          className="fr" style={{ justifyContent: "center", gap: "clamp(0.9rem,1.5vw,1.5rem)" }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }} viewport={{ once: true }}
        >
          <motion.button className="btn-p"
            onClick={() => { setPage("pricing"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ fontSize: "clamp(0.92rem,1.1vw,1.05rem)", padding: "clamp(0.8rem,1.2vw,1rem) clamp(1.8rem,2.5vw,2.4rem)" }}
          >
            See Pricing <ArrowRight size="clamp(15px,1.2vw,18px)" style={{ marginLeft: 2 }} />
          </motion.button>
          <motion.button className="btn-g"
            onClick={() => { setPage("logicgen"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ fontSize: "clamp(0.92rem,1.1vw,1.05rem)", padding: "clamp(0.8rem,1.2vw,1rem) clamp(1.8rem,2.5vw,2.4rem)" }}
          >
            Try LogicGen Demo
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );

  /* ─── VAULT SECTION (shared, layout differs per breakpoint via CSS g2) ─── */
  const VaultSection = () => (
    <section style={{ padding: isMobile ? "3rem 1.3rem" : "clamp(6rem,8vw,10rem) 5%", maxWidth: 1400, margin: "0 auto" }}>
      <ScrollReveal>
        <div className="g2" style={!isMobile ? { gap: 'clamp(2rem,5vw,5rem)' } : {}}>
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
    <div className="page-enter" style={{ position: 'relative' }}>

      {/* Full-page grid — big screens only, spans the entire landing page behind every section */}
      {!isMobile && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(var(--nav-border) 1px,transparent 1px),linear-gradient(90deg,var(--nav-border) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero — completely different on mobile vs desktop */}
      {isMobile ? <MobileHero /> : <DesktopHero />}

      {/* Vault-15 Section */}
      <VaultSection />

      {/* 8 Modules */}
      <section style={{
        padding: isMobile ? "3.5rem 1.3rem" : "clamp(5rem,7vw,8rem) 5%",
        background: "rgba(35,84,244,0.02)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <ScrollReveal>
            <motion.div
              style={{ textAlign: isMobile ? 'left' : "center", marginBottom: "clamp(2.5rem,3vw,4rem)" }}
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

          <ModuleSwiper
            items={modules.map((m, i) => ({
              Icon: moduleIcons[i],
              name: m.name,
              desc: m.desc,
              color: m.color,
              badge: (m.name === 'Vault-15' || m.name === 'Script-Lab') ? 'NEW' : null,
              onOpen: ['Vault-15', 'Exam Generator', 'LogicGen', 'Adaptive Testing', 'Script-Lab'].includes(m.name) ? handleModuleClick : null,
            }))}
          />
        </div>
      </section>

      {/* Team — morphing profile cards */}
      <section style={{ padding: isMobile ? '3.5rem 1.3rem' : 'clamp(5rem,7vw,8rem) 5%', background: 'transparent' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,3vw,3.5rem)' }}>
            <span className="lp-eyebrow" style={{ marginBottom: '1rem' }}><span className="lp-dot" /> Our Team</span>
            <h2 className="st">The minds behind <span className="text-gradient">QuesGen</span></h2>
            <p className="ss" style={{ margin: '.8rem auto 0' }}>
              A focused team of engineers, designers, and researchers — hover a card to meet them.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(1.5rem,3vw,2.5rem)' }}>
            {[
              { name: 'Tejash', about: 'Founder & Developer',    img: '/team.jpg' },
              { name: 'Shiva',  about: 'Co-Founder & Developer', img: '/team.jpg' },
            ].map((m) => (
              <ProfileCard key={m.name} name={m.name} about={m.about} img={m.img} linkedin="#" github="#" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — completely different on mobile */}
      {isMobile ? <MobileCtaSection /> : <DesktopCtaSection />}

      </div>
    </div>
  );
}

export default HomePage;
