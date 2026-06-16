import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const STATS = [
  {
    icon: Users,
    value: '2,50,000+',
    label: 'landing.stats.students',
    iconColor: '#2354F4',
    iconBg: 'rgba(35,84,244,0.1)',
    glow: 'rgba(35,84,244,0.12)',
  },
  {
    icon: BookOpen,
    value: '4,28,500+',
    label: 'landing.stats.vaultQuestions',
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.1)',
    glow: 'rgba(124,58,237,0.10)',
  },
  {
    icon: Award,
    value: '7+',
    label: 'landing.stats.boardsCovered',
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.1)',
    glow: 'rgba(5,150,105,0.10)',
  },
  {
    icon: TrendingUp,
    value: '92%',
    label: 'landing.stats.improvementRate',
    iconColor: '#D97706',
    iconBg: 'rgba(217,119,6,0.1)',
    glow: 'rgba(217,119,6,0.10)',
  },
];

export default function StatsSection() {
  const { t } = useLanguage();

  return (
    <section style={{ padding: '4rem 0', background: 'var(--bg)' }}>
      {/* Top divider */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem',
        borderTop: '1px solid var(--border)', paddingTop: '4rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
        }}
          className="stats-grid"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                padding: '1.6rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                cursor: 'default',
                boxShadow: `0 4px 24px ${stat.glow}`,
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: stat.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <stat.icon size={24} color={stat.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--text3)',
                  marginTop: '0.3rem',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}>
                  {t(stat.label)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.85rem !important; }
        }
      `}</style>
    </section>
  );
}
