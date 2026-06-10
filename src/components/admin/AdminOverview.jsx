import { TrendingUp, Users, BookOpen, Server, ArrowUpRight, Activity, Database, Globe } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const platformData = [
  { day: 'Mon', students: 1240, teachers: 85 },
  { day: 'Tue', students: 1380, teachers: 92 },
  { day: 'Wed', students: 1520, teachers: 88 },
  { day: 'Thu', students: 1410, teachers: 95 },
  { day: 'Fri', students: 1680, teachers: 110 },
  { day: 'Sat', students: 1890, teachers: 78 },
  { day: 'Sun', students: 1020, teachers: 45 },
]

const serverMetrics = [
  { time: '6AM', cpu: 12, mem: 34 },
  { time: '9AM', cpu: 45, mem: 52 },
  { time: '12PM', cpu: 68, mem: 61 },
  { time: '3PM', cpu: 72, mem: 58 },
  { time: '6PM', cpu: 55, mem: 49 },
  { time: '9PM', cpu: 38, mem: 42 },
]

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
  // Extract user's full name - combine firstName and lastName
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
          { icon: Users, label: 'Total Users', value: '12,847', change: '+342 this week', color: 'blue', bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
          { icon: BookOpen, label: 'Papers Generated', value: '8,291', change: '+1,205 today', color: 'purple', bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
          { icon: Server, label: 'Server Uptime', value: '99.97%', change: 'Last 30 days', color: 'emerald', bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
          { icon: Globe, label: 'Active Schools', value: '284', change: '+18 this month', color: 'amber', bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
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
              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Daily Active Users</h3>
              <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5">Student vs Teacher usage distribution</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              +18% growth
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
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
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
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
          <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Recent System Events</h3>
          <button className="text-xs font-bold text-blue-500 hover:underline">View All Logs</button>
        </div>
        <div className="space-y-3">
          {[
            { event: 'New school onboarded: Delhi Public School, Jaipur', time: '2 hrs ago', type: 'success' },
            { event: 'AI Worker #4 restarted due to OOM exception', time: '5 hrs ago', type: 'warning' },
            { event: 'Database nightly backup completed successfully', time: '12 hrs ago', type: 'info' },
            { event: 'Platform update v2.4.1 deployed to production', time: '1 day ago', type: 'info' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl transition-all border border-transparent hover:border-blue-500/30" style={{ background: 'var(--bg2)' }}>
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${item.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : item.type === 'warning' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-500 shadow-blue-500/20'}`} />
                <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>{item.event}</p>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--text3)' }} className="text-[10px] font-bold uppercase tracking-wider">{item.time}</span>
                <Activity className="w-3.5 h-3.5" style={{ color: 'var(--border)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
