import { TrendingUp, BookOpen, Target, Calendar, Clock, Award, ArrowUpRight, Flame } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../../context/LanguageContext'

const weeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 91 },
]

const subjectProgress = [
  { name: 'Physics', value: 82, fill: '#a855f7' },
  { name: 'Chemistry', value: 75, fill: '#3b82f6' },
  { name: 'Maths', value: 91, fill: '#10b981' },
]

const recentActivity = [
  { subject: 'Mathematics', topic: 'Trigonometry Ch.3', score: '18/20', time: '2 hrs ago', trend: 'up' },
  { subject: 'Physics', topic: 'Kinematics PYQ Set', score: '15/20', time: '5 hrs ago', trend: 'up' },
  { subject: 'Chemistry', topic: 'Organic Reactions', score: '12/20', time: '1 day ago', trend: 'down' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '.5rem .75rem' }}>
        <p style={{ fontSize: '.75rem', color: 'var(--text3)' }}>{label}</p>
        <p style={{ fontSize: '.85rem', fontWeight: 700, color: '#a855f7' }}>{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function DashboardOverview({ setActiveTab, user }) {
  const { t } = useLanguage();
  
  // Extract user's full name - combine firstName and lastName
  const fullName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Student'
    : 'Student';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>
          {t('dashboard.welcome').replace('{name}', fullName)}
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>{t('dashboard.overview')}</p>
      </div>

      {/* Quick Stats */}
      <div className="g4">
        {[
          { icon: '🔥', labelKey: 'dashboard.studyStreak', value: '12 Days', changeKey: 'dashboard.thisWeek', color: '#D97706' },
          { icon: '🎯', labelKey: 'dashboard.weakAreaFix', value: '92%', changeKey: 'dashboard.thisWeek', color: '#059669' },
          { icon: '📚', labelKey: 'dashboard.questionsCompleted', value: '1,247', changeKey: 'dashboard.today', color: '#7C3AED' },
          { icon: '🏆', labelKey: 'dashboard.oracleScore', value: '87/100', changeKey: 'dashboard.topRank', color: '#2354F4', action: 'oracle' },
        ].map((stat) => (
          <div key={stat.labelKey} className="card" style={{ padding: '1.2rem', cursor: stat.action ? 'pointer' : 'default' }} onClick={() => stat.action && setActiveTab ? setActiveTab(stat.action) : null}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{stat.icon}</div>
              <ArrowUpRight style={{ width: 16, height: 16, color: '#059669' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>{stat.value}</p>
            <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginTop: '.2rem' }}>{t(stat.labelKey)}</p>
            <p style={{ color: '#059669', fontSize: '.75rem', marginTop: '.2rem' }}>+{t(stat.changeKey)}</p>
          </div>
        ))}
      </div>

      <div className="g2 dash-analytics" style={{ alignItems: 'start' }}>
        {/* Performance Chart */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text)', fontWeight: 600 }}>{t('dashboard.performanceTrend')}</h3>
              <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginTop: '.15rem' }}>{t('dashboard.trendDescription')}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.25rem .7rem', borderRadius: 8, background: 'rgba(5,150,105,.1)', color: '#059669', fontSize: '.75rem', fontWeight: 600 }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              +26%
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12 }} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12 }} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '.25rem' }}>Subject Mastery</h3>
          <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginBottom: '1rem' }}>Chapter completion rate</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {subjectProgress.map((subj) => (
              <div key={subj.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '.35rem' }}>
                  <span style={{ color: 'var(--text2)' }}>{subj.name}</span>
                  <span style={{ fontWeight: 600, color: subj.fill }}>{subj.value}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${subj.value}%`, height: '100%', backgroundColor: subj.fill, borderRadius: 4, transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Scheduled Test Card */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,.08), rgba(35,84,244,.06))', border: '1px solid rgba(124,58,237,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.4rem' }}>
              <Calendar style={{ width: 16, height: 16, color: '#7C3AED' }} />
              <span style={{ color: '#7C3AED', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' }}>Upcoming Test</span>
            </div>
            <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '.9rem' }}>Weekly Scheduled Test</p>
            <p style={{ color: 'var(--text3)', fontSize: '.78rem', marginTop: '.2rem' }}>Physics · Kinematics & Dynamics</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text3)' }}>
              <Clock style={{ width: 14, height: 14 }} />
              <span>Tomorrow, 10:00 AM · 90 mins</span>
            </div>
            <button className="btn-p" style={{ marginTop: '.75rem', width: '100%', justifyContent: 'center', fontSize: '.8rem', padding: '.55rem', background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', boxShadow: '0 4px 16px rgba(124,58,237,.25)' }}>
              Start Preparation
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: '1.3rem' }}>
        <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {recentActivity.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', borderRadius: 12, background: 'var(--bg3)', transition: 'all .2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: i === 0 ? 'rgba(168,85,247,.1)' : i === 1 ? 'rgba(59,130,246,.1)' : 'rgba(16,185,129,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen style={{ width: 20, height: 20, color: i === 0 ? '#a855f7' : i === 1 ? '#3b82f6' : '#10b981' }} />
                </div>
                <div>
                  <p style={{ color: 'var(--text)', fontSize: '.88rem', fontWeight: 500 }}>{item.topic}</p>
                  <p style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{item.subject}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '.88rem', fontWeight: 700, color: item.trend === 'up' ? '#10b981' : '#f59e0b' }}>{item.score}</p>
                <p style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
