import { Brain, Shuffle, Camera, FileText, BarChart3, Shield, Eye, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Trophy,
    title: 'Exam Generator',
    desc: 'AI predicts exam topics with probability scores. Know exactly what to study.',
    color: '#2354F4',
    bg: 'rgba(35,84,244,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: Shuffle,
    title: 'LogicGen Shuffler',
    desc: 'Dynamically alters PYQ parameters so no two questions feel the same.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: Brain,
    title: 'Adaptive Testing',
    desc: 'AI-powered MCQ papers that adapt to your performance, weighting weak areas 2–4×.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
  {
    icon: FileText,
    title: 'Studio-Q Papers',
    desc: 'Generate complete exam papers with answer keys in under 10 seconds.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Shield,
    title: 'Vari-Test Anti-Cheat',
    desc: 'One-click paper variants (Set A/B/C) for cheat-proof, fair exams.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Eye,
    title: 'Vision-Grade OCR',
    desc: 'Auto-grade handwritten answer sheets with AI-powered OCR technology.',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Pilot Dashboard',
    desc: 'Class-wide heatmaps pinpointing weak areas with bridge reports to parents.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.08)',
    tag: 'Teacher',
    tagColor: '#059669',
    tagBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Camera,
    title: 'SnapSolve AI',
    desc: 'Photograph any question and get a step-by-step AI solution instantly.',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
    tag: 'Student',
    tagColor: '#2354F4',
    tagBg: 'rgba(35,84,244,0.08)',
  },
];

export default function FeaturesSection() {
  return (
    <section style={{ padding: '5.5rem 0', background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.9rem', borderRadius: 100,
            background: 'rgba(35,84,244,0.08)', border: '1px solid rgba(35,84,244,0.18)',
            fontSize: '0.75rem', fontWeight: 700, color: '#2354F4',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Platform Features
          </span>
          <h2 className="st" style={{ marginBottom: '0.75rem', marginTop: '0.75rem' }}>
            Every tool you need.{' '}
            <span className="text-gradient">Nothing you don't.</span>
          </h2>
          <p className="ss" style={{ margin: '0 auto' }}>
            8 student modules and 4 teacher tools — from predictive analytics to instant paper generation.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.1rem',
        }} className="feat-grid">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: (i % 4) * 0.08, type: 'spring', stiffness: 190, damping: 22 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                padding: '1.5rem',
                cursor: 'default',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${feat.color}40`;
                e.currentTarget.style.boxShadow = `0 8px 32px ${feat.bg.replace('0.08', '0.15')}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Subtle top gradient */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${feat.color}, transparent)`,
                opacity: 0, transition: 'opacity 0.25s ease',
              }} className="feat-topbar" />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: feat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                }}>
                  <feat.icon size={20} color={feat.color} strokeWidth={1.8} />
                </div>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem', borderRadius: 100,
                  background: feat.tagBg,
                  color: feat.tagColor,
                  border: `1px solid ${feat.tagColor}25`,
                }}>
                  {feat.tag}
                </span>
              </div>

              <h3 style={{
                fontWeight: 700, fontSize: '0.92rem',
                color: 'var(--text)', marginBottom: '0.45rem',
                lineHeight: 1.3,
              }}>
                {feat.title}
              </h3>
              <p style={{
                fontSize: '0.8rem', color: 'var(--text3)',
                lineHeight: 1.6, margin: 0,
              }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .feat-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
