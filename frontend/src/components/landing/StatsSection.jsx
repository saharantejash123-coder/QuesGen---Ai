import { useState, useEffect } from 'react'
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

function readRealStats() {
  try {
    const registered = JSON.parse(localStorage.getItem('questra_registered') || '[]')
    const papers     = JSON.parse(localStorage.getItem('questra_papers') || '[]')
    const students   = registered.filter(u => u.role === 'student').length
    const totalQ     = papers.reduce((s, p) =>
      s + (p.sections || []).reduce((ss, sec) => ss + (sec.questions?.length || 0), 0), 0)
    const boardSet   = new Set(papers.map(p => p.board).filter(Boolean))
    return {
      students: students > 0 ? `${students.toLocaleString('en-IN')}+` : null,
      questions: totalQ > 0 ? `${totalQ.toLocaleString('en-IN')}+` : null,
      boards: boardSet.size > 0 ? `${boardSet.size}+` : null,
    }
  } catch {
    return { students: null, questions: null, boards: null }
  }
}

export default function StatsSection() {
  const { t } = useLanguage()
  const [real, setReal] = useState({ students: null, questions: null, boards: null })

  useEffect(() => {
    setReal(readRealStats())
  }, [])

  const STATS = [
    {
      icon: Users,
      value: real.students || '2,50,000+',
      label: 'landing.stats.students',
      iconColor: '#2354F4',
      iconBg: 'rgba(35,84,244,0.1)',
      glow: 'rgba(35,84,244,0.12)',
    },
    {
      icon: BookOpen,
      value: real.questions || '4,28,500+',
      label: 'landing.stats.vaultQuestions',
      iconColor: '#7C3AED',
      iconBg: 'rgba(124,58,237,0.1)',
      glow: 'rgba(124,58,237,0.10)',
    },
    {
      icon: Award,
      value: real.boards || '7+',
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
  ]

  return (
    <section style={{ padding: '4rem 0', background: 'var(--bg)' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem',
        borderTop: '1px solid var(--border)', paddingTop: '4rem',
      }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1.25rem',
          }}
          className="stats-grid lp-grid-safe"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="lp-glass lp-gborder lp-spot"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              style={{
                borderRadius: 18,
                padding: '1.7rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                cursor: 'default',
                boxShadow: `0 6px 28px ${stat.glow}`,
                ['--spot']: stat.glow.replace(/0\.\d+/, '0.18'),
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 15,
                background: `linear-gradient(145deg, ${stat.iconBg}, transparent)`,
                border: `1px solid ${stat.iconColor}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 14px ${stat.glow}`,
              }}>
                <stat.icon size={24} color={stat.iconColor} strokeWidth={1.9} />
              </div>
              <div>
                <div style={{
                  fontSize: 'clamp(1.7rem, 3vw, 2.35rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  background: `linear-gradient(135deg, var(--text), ${stat.iconColor})`,
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
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
  )
}
