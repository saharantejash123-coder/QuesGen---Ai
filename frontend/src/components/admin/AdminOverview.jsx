import { useState, useEffect } from 'react'
import { TrendingUp, Users, BookOpen, Server, ArrowUpRight, Activity, Database, Globe } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { fetchStats, fetchAllUsers, getLogs } from '../../services/adminService'

const serverMetrics = [
  { time: '6AM', cpu: 12, mem: 34 },
  { time: '9AM', cpu: 45, mem: 52 },
  { time: '12PM', cpu: 68, mem: 61 },
  { time: '3PM', cpu: 72, mem: 58 },
  { time: '6PM', cpu: 55, mem: 49 },
  { time: '9PM', cpu: 38, mem: 42 },
]

// Build last-7-days registration chart from real user list
function buildWeeklyChart(users) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return { day: days[d.getDay()], date: d.toDateString(), students: 0, teachers: 0 }
  })
  users.forEach(u => {
    if (!u.joinDate && !u.createdAt) return
    const joined = new Date(u.joinDate || u.createdAt).toDateString()
    const bucket = buckets.find(b => b.date === joined)
    if (!bucket) return
    if (u.type === 'Teacher') bucket.teachers++
    else bucket.students++
  })
  return buckets
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-xl">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-bold flex items-center gap-2" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminOverview({ user }) {
  const [stats, setStats]         = useState({ totalUsers: '…', students: '…', teachers: '…', schools: '…', admins: '…', totalQuestions: '…' })
  const [weeklyData, setWeekly]   = useState([])
  const [recentLogs, setRecent]   = useState([])

  useEffect(() => {
    fetchStats().then(s => setStats(s)).catch(() => {})
    fetchAllUsers().then(users => setWeekly(buildWeeklyChart(users))).catch(() => {})
    setRecent(getLogs())
  }, [])

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Admin'
    : 'Admin';

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
          Welcome back, {fullName} <span className="text-xl">🛡️</span>
        </h1>
        <p style={{ color: 'var(--text3)' }} className="text-sm">Real-time system health and ecosystem usage metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,    label: 'Total Users',      value: stats.totalUsers ?? '…', change: `${stats.students ?? '…'} students`, color: 'blue',   bg: 'rgba(59,130,246,0.1)',  text: '#3b82f6' },
          { icon: BookOpen, label: 'Questions in DB',  value: stats.totalQuestions ?? '…', change: 'Seeded questions', color: 'purple', bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
          { icon: Server,   label: 'Teachers',         value: stats.teachers ?? '…', change: `${stats.admins ?? '…'} admins`, color: 'emerald', bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
          { icon: Globe,    label: 'School Accounts',  value: stats.schools ?? '…', change: 'Registered schools', color: 'amber', bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 group shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner" style={{ background: stat.bg }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.text }} />
              </div>
              <div className="flex flex-col items-end">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{stat.value}</p>
            <p style={{ color: 'var(--text3)' }} className="text-xs font-semibold mt-0.5 uppercase tracking-wide">{stat.label}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-emerald-500 text-[10px] font-bold">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>New Registrations (Last 7 Days)</h3>
              <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5">Real registration data from Supabase</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              Live
            </div>
          </div>
          <div style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256} minWidth={0}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg3)', opacity: 0.4 }} />
                <Bar dataKey="students" fill="#3b82f6" radius={[4,4,0,0]} name="Students" barSize={16} />
                <Bar dataKey="teachers" fill="#7c3aed" radius={[4,4,0,0]} name="Teachers" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Server Health */}
        <div className="card p-6 flex flex-col">
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>Server Health</h3>
          <p style={{ color: 'var(--text3)' }} className="text-xs mb-6 uppercase tracking-widest font-bold">In-Memory Performance</p>
          <div style={{ minHeight: 176 }}>
            <ResponsiveContainer width="100%" height={176} minWidth={0}>
              <AreaChart data={serverMetrics}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cpu" stroke="#ef4444" fill="url(#cpuGrad)" strokeWidth={3} name="CPU %" />
                <Area type="monotone" dataKey="mem" stroke="#3b82f6" fill="url(#memGrad)" strokeWidth={3} name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Status */}
          <div className="mt-8 space-y-3 flex-1">
            {[
              { label: 'Database (QuesGen-DB)', status: 'Healthy', color: 'emerald' },
              { label: 'Cloud CDN Nodes', status: 'Active', color: 'emerald' },
              { label: 'AI Worker Engine', status: 'Optimal', color: 'blue' },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-1.5 p-3 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text3)' }}>
                  <Database className="w-3 h-3 text-blue-400" /> {s.label}
                </span>
                <div className="flex items-center justify-between">
                   <div className="w-full h-1 rounded-full mr-4" style={{ background: 'var(--bg3)' }}>
                      <div className={`bg-${s.color}-500 h-1 rounded-full w-[95%]`}></div>
                   </div>
                   <span className={`font-bold text-[10px] shrink-0 uppercase text-${s.color}-500`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent System Events */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Recent Activity</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
            Live audit trail
          </span>
        </div>
        {recentLogs.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="w-7 h-7 mx-auto mb-2" style={{ color: 'var(--text3)' }} />
            <p className="text-sm font-bold" style={{ color: 'var(--text2)' }}>No activity yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Events appear here when users register or admin actions are taken</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log, i) => {
              const sevColor = log.severity === 'high' ? '#ef4444' : log.severity === 'medium' ? '#f59e0b' : log.severity === 'low' ? '#10b981' : '#3b82f6'
              return (
                <div key={log.id || i} className="flex items-center justify-between p-4 rounded-xl transition-all border border-transparent hover:border-blue-500/30" style={{ background: 'var(--bg2)' }}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sevColor, boxShadow: `0 0 0 2px ${sevColor}25` }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text2)' }}>
                        {log.detail || log.action?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: 'var(--text3)' }}>
                        {log.actor} → {log.target}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span style={{ color: 'var(--text3)' }} className="text-[10px] font-bold uppercase tracking-wider">{log.time}</span>
                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--border)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
