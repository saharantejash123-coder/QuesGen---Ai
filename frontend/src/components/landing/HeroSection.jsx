import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Brain, Shield, CheckCircle, Tag, Lock,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SPRING = { type: 'spring', stiffness: 220, damping: 22 };

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

/* Trust badges — mirrors Verdora's "Quality Guaranteed · Secure Delivery · Best Offers" row */
const TRUST = [
  { icon: CheckCircle, text: 'Quality Guaranteed', color: '#2354F4' },
  { icon: Lock,        text: 'Secure Platform',    color: '#2354F4' },
  { icon: Tag,         text: 'Best Offers',        color: '#D97706', pill: true },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: 64,               /* exact navbar height */
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Soft background glows ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-5%', right: '-6%',
          width: 660, height: 660, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,84,244,0.09) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '8%', left: '-6%',
          width: 440, height: 440, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
        }} />
        {/* dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(35,84,244,0.045) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
      </div>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '4rem 2rem 5rem', width: '100%' }}>
        <div className="hero-layout">

          {/* ════════════════════════════════
              LEFT — TEXT CONTENT
          ════════════════════════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="hero-text"
          >
            {/* Badge pill — mirrors Verdora's "Farmers' To Fresh Picks, Secure Delivered" */}
            <motion.div variants={item}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.42rem 1.1rem', borderRadius: 100,
                background: 'rgba(35,84,244,0.08)',
                border: '1px solid rgba(35,84,244,0.2)',
                fontSize: '0.82rem', fontWeight: 600, color: '#2354F4',
                marginBottom: '1.5rem',
              }}>
                <motion.span
                  animate={reduce ? {} : { rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity }}
                  style={{ display: 'flex' }}
                >
                  <Sparkles size={13} />
                </motion.span>
                India's Smartest AI Exam Prep Platform
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <motion.h1 variants={item} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              marginBottom: '1.35rem',
            }}>
              Smart Questions,
              <br />
              <span className="text-gradient">
                Direct from AI.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={item} style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: 'var(--text3)',
              lineHeight: 1.78,
              maxWidth: 460,
              marginBottom: '2.2rem',
            }}>
              AI-powered question prediction, adaptive testing, and instant paper generation — all in one platform for Indian board exams.
            </motion.p>

            {/* ── 3 CTA buttons — mirrors Verdora's "Shop Now → | Sign up → | View Offers" ── */}
            <motion.div variants={item} style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
              marginBottom: '2rem',
            }}>
              {/* Primary — solid blue (like Verdora's green "Shop Now") */}
              <Link
                to="/student"
                className="btn-p"
                style={{
                  padding: '0.85rem 1.8rem', fontSize: '0.95rem',
                  borderRadius: 12, gap: '0.5rem',
                  display: 'inline-flex', alignItems: 'center',
                }}
              >
                <Brain size={17} />
                Start Learning
                <motion.span
                  animate={reduce ? {} : { x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ display: 'flex' }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </Link>

              {/* Secondary — solid (like Verdora's "Sign up →") */}
              <Link
                to="/login"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  padding: '0.85rem 1.75rem', fontSize: '0.95rem',
                  borderRadius: 12, fontWeight: 700,
                  background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(35,84,244,0.28)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 26px rgba(35,84,244,0.36)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(35,84,244,0.28)'; }}
              >
                Sign Up
                <ArrowRight size={15} />
              </Link>

              {/* Tertiary — outlined (like Verdora's "View Offers") */}
              <a
                href="#pricing"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.85rem 1.5rem', fontSize: '0.95rem',
                  borderRadius: 12, fontWeight: 600,
                  background: 'transparent', color: 'var(--text)',
                  border: '1.5px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2354F4'; e.currentTarget.style.color = '#2354F4'; e.currentTarget.style.background = 'rgba(35,84,244,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Tag size={15} />
                View Plans
              </a>
            </motion.div>

            {/* ── Trust badges — mirrors Verdora's bottom row ── */}
            <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {TRUST.map((tr, i) => (
                tr.pill ? (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.32rem 0.85rem', borderRadius: 100,
                    background: 'rgba(217,119,6,0.1)', color: '#D97706',
                    border: '1px solid rgba(217,119,6,0.25)',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    <tr.icon size={13} />
                    {tr.text}
                  </span>
                ) : (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.38rem' }}>
                    <tr.icon size={14} color={tr.color} strokeWidth={2.2} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>
                      {tr.text}
                    </span>
                  </div>
                )
              ))}
            </motion.div>
          </motion.div>

          {/* ════════════════════════════════
              RIGHT — CLEAN CIRCULAR LOGO
              (Verdora-style, no floating cards)
          ════════════════════════════════ */}
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.88, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 22, delay: 0.18 }}
          >
            <div style={{
              position: 'relative',
              width: '100%', maxWidth: 420,
              margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              aspectRatio: '1 / 1',
            }}>
              {/* Soft glow behind */}
              <div style={{
                position: 'absolute', inset: '-12%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(35,84,244,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Circular logo — solid blue, Verdora-style */}
              <motion.div
                animate={reduce ? {} : { y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '100%', height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #1a40d4 0%, #2354F4 50%, #4a6fff 100%)',
                  boxShadow:
                    '0 30px 90px rgba(35,84,244,0.38),' +
                    '0 8px 32px rgba(35,84,244,0.2),' +
                    'inset 0 1px 0 rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Subtle top highlight */}
                <div style={{
                  position: 'absolute', top: '8%', left: '15%', right: '15%',
                  height: '35%', borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.16) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <img
                  src="/logo.png"
                  alt="QuesGen AI"
                  style={{
                    width: '62%', height: '62%',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    position: 'relative', zIndex: 1,
                    userSelect: 'none',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .hero-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-text { text-align: left; }
        .hero-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 1280px) {
          .hero-layout {
            grid-template-columns: 5fr 6fr;
          }
        }
        @media (max-width: 960px) {
          .hero-layout {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-text { text-align: center !important; }
          .hero-text > div { justify-content: center !important; }
          .hero-image { order: -1; max-width: 380px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 540px) {
          .hero-layout { gap: 1.8rem !important; }
          .hero-image { max-width: 300px !important; }
        }
      `}</style>
    </section>
  );
}
