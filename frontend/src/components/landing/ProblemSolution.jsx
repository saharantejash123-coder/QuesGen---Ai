import { XCircle, CheckCircle, Clock, Brain, FileText, BarChart3, AlertTriangle, Sparkles, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  { icon: AlertTriangle, text: '100% syllabus overload — students study everything blindly' },
  { icon: Clock,         text: 'Teachers spend 4–6 hours creating a single question paper' },
  { icon: XCircle,       text: 'No predictive insights — students guess what topics matter' },
  { icon: FileText,      text: 'Manual grading delays — results take weeks to process' },
];

const solutions = [
  { icon: Brain,    text: 'Oracle AI predicts high-weightage topics with 87% accuracy' },
  { icon: Zap,      text: 'Studio-Q generates papers in <10 seconds with full answer keys' },
  { icon: Sparkles, text: 'LogicGen shuffles PYQs to prevent rote memorization' },
  { icon: Shield,   text: 'Vision-Grade OCR auto-grades handwritten papers instantly' },
];

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 190, damping: 22, delay: i * 0.12 },
  }),
};

export default function ProblemSolution() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.9rem', borderRadius: 100,
            background: 'rgba(35,84,244,0.08)', border: '1px solid rgba(35,84,244,0.18)',
            fontSize: '0.75rem', fontWeight: 700, color: '#2354F4',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            marginBottom: '1rem', display: 'inline-flex',
          }}>
            Why QuesGen
          </span>
          <h2 className="st" style={{ marginBottom: '0.75rem', marginTop: '0.75rem' }}>
            The Broken System vs.{' '}
            <span className="text-gradient">1 AI Ecosystem</span>
          </h2>
          <p className="ss" style={{ margin: '0 auto' }}>
            See how QuesGen replaces an entire broken workflow with one intelligent platform.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }} className="ps-grid">

          {/* ── Problems ── */}
          <motion.div
            custom={0}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{
              background: 'var(--card-bg)',
              border: '1.5px solid rgba(239,68,68,0.18)',
              borderRadius: 20,
              padding: '1.75rem',
              boxShadow: '0 4px 24px rgba(239,68,68,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(239,68,68,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <XCircle size={20} color="#ef4444" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#ef4444' }}>
                The Current Problem
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {problems.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                  padding: '0.85rem 1rem', borderRadius: 12,
                  background: 'rgba(239,68,68,0.04)',
                  border: '1px solid rgba(239,68,68,0.1)',
                }}>
                  <p.icon size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                    {p.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Solutions ── */}
          <motion.div
            custom={1}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{
              background: 'var(--card-bg)',
              border: '1.5px solid rgba(5,150,105,0.18)',
              borderRadius: 20,
              padding: '1.75rem',
              boxShadow: '0 4px 24px rgba(5,150,105,0.07)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle gradient shine */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(5,150,105,0.04) 0%, transparent 60%)',
              borderRadius: 20,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(5,150,105,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle size={20} color="#059669" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#059669' }}>
                  The QuesGen Solution
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {solutions.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                    padding: '0.85rem 1rem', borderRadius: 12,
                    background: 'rgba(5,150,105,0.05)',
                    border: '1px solid rgba(5,150,105,0.12)',
                  }}>
                    <s.icon size={16} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
