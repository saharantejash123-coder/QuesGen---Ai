import { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, Calendar, Clock, ArrowUpRight, FileText, Brain, Play, CheckCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../../context/LanguageContext'
import { getPapersForStudent, getMCQPapersForStudent, getSubmissionByStudent, countMCQQuestions } from '../../services/schoolService'

const PALETTE = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
const VISIT_KEY = 'questra_student_activity'

function recordVisit(email) {
  if (!email) return
  try {
    const all = JSON.parse(localStorage.getItem(VISIT_KEY) || '{}')
    const today = new Date().toDateString()
    const arr = all[email] || []
    if (!arr.includes(today)) {
      all[email] = [...arr, today].slice(-90)
      localStorage.setItem(VISIT_KEY, JSON.stringify(all))
    }
  } catch {}
}

function computeStreak(email) {
  if (!email) return 0
  try {
    const all = JSON.parse(localStorage.getItem(VISIT_KEY) || '{}')
    const visitSet = new Set(all[email] || [])
    const now = new Date()
    let streak = 0
    for (let i = 0; i < 90; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      if (visitSet.has(d.toDateString())) streak++
      else if (i > 0) break
    }
    return streak
  } catch { return 0 }
}

function loadAdaptiveHistory(email) {
  if (!email) return []
  try {
    return JSON.parse(localStorage.getItem(`q_adaptive_history_${email}`) || '[]')
  } catch { return [] }
}

function buildWeeklyData(adaptiveHistory) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    const dateStr = d.toDateString()
    const tests = adaptiveHistory.filter(r => r.timestamp && new Date(r.timestamp).toDateString() === dateStr).length
    return { day: labels[d.getDay()], score: tests }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card" style={{ padding: '.5rem .75rem' }}>
        <p style={{ fontSize: '.75rem', color: 'var(--text3)' }}>{label}</p>
        <p style={{ fontSize: '.85rem', fontWeight: 700, color: '#a855f7' }}>
          {payload[0].value} test{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }
  return null
}

export default function DashboardOverview({ setActiveTab, user }) {
  const { t } = useLanguage()
  const [papers, setPapers] = useState([])
  const [mcqPapers, setMcqPapers] = useState([])
  const [adaptiveHistory, setAdaptiveHistory] = useState([])
  const [streak, setStreak] = useState(0)

  const refreshData = () => {
    if (!user?.email) return
    setPapers(getPapersForStudent(user.className || '', user.schoolName || ''))
    setMcqPapers(getMCQPapersForStudent(user.className || '', user.schoolName || ''))
  }

  useEffect(() => {
    if (!user?.email) return
    recordVisit(user.email)
    setStreak(computeStreak(user.email))
    setAdaptiveHistory(loadAdaptiveHistory(user.email))
    refreshData()
  }, [user])

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Student'
    : 'Student'

  const totalPapers = papers.length
  const totalQuestionsAttempted = adaptiveHistory.reduce((s, r) => s + (r.total || 0), 0)
  const avgScore = adaptiveHistory.length > 0
    ? Math.round(adaptiveHistory.reduce((s, r) => s + (r.percentage || 0), 0) / adaptiveHistory.length)
    : null

  // Subject mastery: blend adaptive tests + assigned papers
  const adaptiveSubjects = [...new Set(adaptiveHistory.map(r => r.subject).filter(Boolean))]
  const paperSubjects = [...new Set(papers.map(p => p.subject).filter(Boolean))]
  const combinedSubjects = [...new Set([...adaptiveSubjects, ...paperSubjects])].slice(0, 4)

  const subjectMastery = combinedSubjects.map((name, i) => {
    const subjTests = adaptiveHistory.filter(r => r.subject === name)
    const avgPct = subjTests.length > 0
      ? Math.round(subjTests.reduce((s, r) => s + (r.percentage || 0), 0) / subjTests.length)
      : null
    const paperCount = papers.filter(p => p.subject === name).length
    const value = avgPct !== null ? avgPct : Math.min(100, paperCount * 25)
    return { name, value, fill: PALETTE[i % PALETTE.length], sessions: subjTests.length }
  })

  // Recent activity: merge both sources, newest first
  const recentActivity = [
    ...adaptiveHistory.slice(-5).reverse().map(r => ({
      type: 'adaptive',
      label: `${r.subject || 'Test'} · Adaptive`,
      sub: r.board ? `${r.board}${r.cls ? ` · ${r.cls}` : ''}` : 'AI Generated',
      meta: `${r.score}/${r.total} · ${Math.round(r.percentage || 0)}%`,
      time: r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-IN') : '—',
      color: '#7C3AED',
      ts: r.timestamp ? new Date(r.timestamp).getTime() : 0,
    })),
    ...papers.slice().reverse().slice(0, 3).map(p => ({
      type: 'paper',
      label: `${p.subject || 'Paper'} · ${p.paperType === 'unit_test' ? 'Unit Test' : p.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Full Exam'}`,
      sub: p.subject || 'Assigned Paper',
      meta: `${p.sections?.reduce((s, sec) => s + (sec.questions?.length || 0), 0) || 0} Qs`,
      time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '—',
      color: '#2354F4',
      ts: p.createdAt ? new Date(p.createdAt).getTime() : 0,
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 4)

  const weeklyData = buildWeeklyData(adaptiveHistory)
  const upcomingPaper = papers.find(p => p.status === 'assigned') || papers[papers.length - 1] || null

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const subtitleParts = [
    user?.className,
    user?.schoolName,
    memberSince ? `Member since ${memberSince}` : null,
  ].filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>
          {t('dashboard.welcome').replace('{name}', fullName)}
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>
          {subtitleParts.join(' · ') || t('dashboard.overview')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="g4">
        {[
          {
            icon: '🔥', label: 'Study Streak',
            value: streak > 0 ? `${streak} Day${streak !== 1 ? 's' : ''}` : '0 Days',
            sub: streak > 0 ? 'Keep it up!' : 'Start studying today',
            color: '#D97706',
          },
          {
            icon: '📋', label: 'Papers Assigned',
            value: totalPapers,
            sub: totalPapers > 0 ? 'from your teacher' : 'none assigned yet',
            color: '#059669',
          },
          {
            icon: '🎯', label: 'Questions Attempted',
            value: totalQuestionsAttempted > 0 ? totalQuestionsAttempted.toLocaleString('en-IN') : '0',
            sub: adaptiveHistory.length > 0
              ? `${adaptiveHistory.length} adaptive test${adaptiveHistory.length !== 1 ? 's' : ''}`
              : 'via Adaptive Testing',
            color: '#7C3AED',
            action: 'adaptive',
          },
          {
            icon: '🏆', label: 'AI Score',
            value: avgScore !== null ? `${avgScore}%` : '—',
            sub: avgScore !== null ? 'avg across all tests' : 'Take a test first',
            color: '#2354F4',
            action: 'adaptive',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: '1.2rem', cursor: stat.action ? 'pointer' : 'default' }}
            onClick={() => stat.action && setActiveTab ? setActiveTab(stat.action) : null}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                {stat.icon}
              </div>
              <ArrowUpRight style={{ width: 16, height: 16, color: '#059669' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>{stat.value}</p>
            <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginTop: '.2rem' }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: '.72rem', marginTop: '.2rem', opacity: 0.8 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="g2 dash-analytics" style={{ alignItems: 'start' }}>
        {/* Weekly Activity Chart */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text)', fontWeight: 600 }}>Weekly Test Activity</h3>
              <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginTop: '.15rem' }}>Adaptive tests taken per day (last 7 days)</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.25rem .7rem', borderRadius: 8, background: 'rgba(5,150,105,.1)', color: '#059669', fontSize: '.75rem', fontWeight: 600 }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              Live
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12 }} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12 }} allowDecimals={false} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {adaptiveHistory.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '.78rem', marginTop: '.75rem' }}>
              No tests yet — try <strong>Adaptive Testing</strong> to see your activity here.
            </p>
          )}
        </div>

        {/* Subject Mastery + Upcoming Paper */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '.25rem' }}>Subject Mastery</h3>
          <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginBottom: '1rem' }}>
            {subjectMastery.length > 0 ? 'Based on adaptive tests & assigned papers' : 'Complete a test to see your mastery'}
          </p>

          {subjectMastery.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subjectMastery.map((subj) => (
                <div key={subj.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '.35rem' }}>
                    <span style={{ color: 'var(--text2)' }}>{subj.name}</span>
                    <span style={{ fontWeight: 600, color: subj.fill }}>{subj.value}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${subj.value}%`, height: '100%', backgroundColor: subj.fill, borderRadius: 4, transition: 'width 1s' }} />
                  </div>
                  {subj.sessions > 0 && (
                    <p style={{ color: 'var(--text3)', fontSize: '.7rem', marginTop: '.15rem' }}>
                      {subj.sessions} session{subj.sessions !== 1 ? 's' : ''} completed
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)' }}>
              <Brain style={{ width: 32, height: 32, opacity: 0.25, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '.8rem' }}>Take an adaptive test to track your subject mastery.</p>
            </div>
          )}

          {/* Next Paper Card */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,.08), rgba(35,84,244,.06))', border: '1px solid rgba(124,58,237,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.4rem' }}>
              <Calendar style={{ width: 16, height: 16, color: '#7C3AED' }} />
              <span style={{ color: '#7C3AED', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' }}>
                {upcomingPaper ? 'Assigned Paper' : 'No Paper Yet'}
              </span>
            </div>
            <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '.9rem' }}>
              {upcomingPaper
                ? `${upcomingPaper.subject || 'Paper'} — ${upcomingPaper.paperType === 'unit_test' ? 'Unit Test' : upcomingPaper.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Full Exam'}`
                : 'Waiting for assignment'}
            </p>
            <p style={{ color: 'var(--text3)', fontSize: '.78rem', marginTop: '.2rem' }}>
              {upcomingPaper
                ? `${upcomingPaper.board || 'CBSE'} · ${upcomingPaper.totalMarks || 0} marks`
                : 'Your teacher will assign papers here'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text3)' }}>
              <Clock style={{ width: 14, height: 14 }} />
              <span>{upcomingPaper?.createdAt ? new Date(upcomingPaper.createdAt).toLocaleDateString('en-IN') : '—'}</span>
            </div>
            {upcomingPaper && (
              <button
                className="btn-p"
                style={{ marginTop: '.75rem', width: '100%', justifyContent: 'center', fontSize: '.8rem', padding: '.55rem', background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', boxShadow: '0 4px 16px rgba(124,58,237,.25)' }}
              >
                Start Preparation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* My Tests — quick summary, links to dedicated tab */}
      {papers.length > 0 && (
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text)', fontWeight: 600 }}>My Papers &amp; Tests</h3>
              <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginTop: '.15rem' }}>
                {papers.length} paper{papers.length !== 1 ? 's' : ''} assigned · {mcqPapers.length} with MCQ questions you can attempt online
              </p>
            </div>
            <button
              onClick={() => setActiveTab?.('mytests')}
              style={{ padding: '.4rem .85rem', borderRadius: 20, background: 'rgba(124,58,237,.1)', color: '#7C3AED', fontSize: '.73rem', fontWeight: 700, border: '1px solid rgba(124,58,237,.2)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
            >
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {papers.slice(0, 3).map(p => {
              const sub = getSubmissionByStudent(p.id, user?.email || '')
              const mcqCount = countMCQQuestions(p)
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem .9rem', borderRadius: 12, background: sub ? 'rgba(16,185,129,.05)' : 'var(--bg3)', border: `1px solid ${sub ? 'rgba(16,185,129,.2)' : 'var(--border)'}`, gap: '.6rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '.88rem', marginBottom: '.15rem' }}>
                      {p.subject} — {p.paperType === 'quick_quiz' ? 'Quick Quiz' : p.paperType === 'unit_test' ? 'Unit Test' : 'Full Exam'}
                    </p>
                    <p style={{ color: 'var(--text3)', fontSize: '.73rem' }}>
                      {mcqCount > 0 ? `${mcqCount} MCQ questions` : 'Written paper'} · {p.totalMarks} marks
                      {sub ? ` · Scored ${sub.score}/${sub.total} (${sub.percentage}%)` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab?.('mytests')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.45rem .85rem', borderRadius: 9,
                      background: sub ? 'rgba(16,185,129,.12)' : mcqCount > 0 ? 'linear-gradient(135deg,#7C3AED,#A78BFA)' : 'var(--bg2)',
                      border: sub ? '1px solid rgba(16,185,129,.3)' : mcqCount === 0 ? '1px solid var(--border)' : 'none',
                      color: sub ? '#10B981' : mcqCount > 0 ? '#fff' : 'var(--text3)',
                      fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', flexShrink: 0, fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {sub ? <><CheckCircle style={{ width: 13, height: 13 }} /> View</> : mcqCount > 0 ? <><Play style={{ width: 13, height: 13 }} /> Attend</> : <><FileText style={{ width: 13, height: 13 }} /> Open</>}
                  </button>
                </div>
              )
            })}
            {papers.length > 3 && (
              <button onClick={() => setActiveTab?.('mytests')} style={{ textAlign: 'center', padding: '.5rem', color: '#7C3AED', fontSize: '.78rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                +{papers.length - 3} more — View All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card" style={{ padding: '1.3rem' }}>
        <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
            <BookOpen style={{ width: 36, height: 36, opacity: 0.25, margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '.82rem' }}>No activity yet. Try Adaptive Testing or wait for your teacher to assign papers.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', borderRadius: 12, background: 'var(--bg3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.type === 'adaptive'
                      ? <Brain style={{ width: 20, height: 20, color: item.color }} />
                      : <BookOpen style={{ width: 20, height: 20, color: item.color }} />
                    }
                  </div>
                  <div>
                    <p style={{ color: 'var(--text)', fontSize: '.88rem', fontWeight: 500 }}>{item.label}</p>
                    <p style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{item.sub}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#10b981' }}>{item.meta}</p>
                  <p style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
