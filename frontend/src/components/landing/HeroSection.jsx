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
      {/* ── Drifting aurora background ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="lp-aurora" style={{
          position: 'absolute', top: '-12%', right: '-8%',
          width: 720, height: 720, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,84,244,0.16) 0%, transparent 68%)',
          filter: 'blur(8px)',
        }} />
        <div className="lp-aurora" style={{
          position: 'absolute', bottom: '-6%', left: '-8%',
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 68%)',
          filter: 'blur(8px)', animationDelay: '-6s', animationDuration: '22s',
        }} />
        <div className="lp-aurora" style={{
          position: 'absolute', top: '30%', left: '40%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
          filter: 'blur(10px)', animationDelay: '-11s', animationDuration: '26s',
        }} />
        {/* fine dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(35,84,244,0.05) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)',
        }} />
      </div>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.1rem,4vw,2rem) clamp(3rem,6vw,5rem)', width: '100%' }}>
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
              <span className="lp-glass" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 1.1rem 0.45rem 0.85rem', borderRadius: 100,
                border: '1px solid rgba(35,84,244,0.22)',
                fontSize: '0.82rem', fontWeight: 600, color: '#2354F4',
                marginBottom: '1.5rem',
                boxShadow: '0 6px 20px rgba(35,84,244,0.12)',
              }}>
                {/* live pulse dot */}
                <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                  <motion.span
                    animate={reduce ? {} : { scale: [1, 2.2], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2354F4' }}
                  />
                  <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#2354F4' }} />
                </span>
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
              fontSize: 'clamp(2.15rem, 6vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              marginBottom: '1.35rem',
              overflowWrap: 'break-word',
            }}>
              Smart Questions,
              <br />
              <span className="lp-shine">
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

            {/* ── Social proof — avatar stack + rating ── */}
            <motion.div variants={item} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              marginTop: '1.8rem', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex' }}>
                {[
                  ['#2354F4', '#4a6fff', 'AS'],
                  ['#7C3AED', '#a855f7', 'RK'],
                  ['#059669', '#34d399', 'PM'],
                  ['#D97706', '#f59e0b', 'SN'],
                ].map(([c1, c2, ini], i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    border: '2px solid var(--bg)',
                    marginLeft: i === 0 ? 0 : -12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.62rem', fontWeight: 800, color: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}>{ini}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', gap: 1, color: '#F59E0B' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text2)', fontWeight: 500 }}>
                  Loved by <strong style={{ color: 'var(--text)' }}>2,50,000+</strong> students & teachers
                </span>
              </div>
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
                background: 'radial-gradient(circle, rgba(35,84,244,0.20) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Rotating conic light sweep ring */}
              <div style={{
                position: 'absolute', inset: '-7%', borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 0deg 210deg, rgba(35,84,244,0.45) 300deg, rgba(124,58,237,0.6) 345deg, transparent 360deg)',
                WebkitMask: 'radial-gradient(circle, transparent 59%, #000 60%)',
                mask: 'radial-gradient(circle, transparent 59%, #000 60%)',
                animation: reduce ? 'none' : 'lp-orbit 14s linear infinite',
                pointerEvents: 'none',
              }} />

              {/* Dashed counter-rotating ring */}
              <div style={{
                position: 'absolute', inset: '1%', borderRadius: '50%',
                border: '1.5px dashed rgba(124,58,237,0.22)',
                animation: reduce ? 'none' : 'lp-orbit-rev 32s linear infinite',
                pointerEvents: 'none',
              }} />

              {/* Orbiting accent dot */}
              <div style={{
                position: 'absolute', inset: '-7%',
                animation: reduce ? 'none' : 'lp-orbit 9s linear infinite',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: '-1.5%', left: '50%', transform: 'translateX(-50%)',
                  width: 13, height: 13, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                  boxShadow: '0 0 16px rgba(35,84,244,0.85)',
                }} />
              </div>

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
          gap: clamp(2rem, 4vw, 4rem);
          align-items: center;
        }
        .hero-text { text-align: left; min-width: 0; }
        .hero-image {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
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
          .hero-image { max-width: 260px !important; }
        }
      `}</style>
    </section>
  );
}
