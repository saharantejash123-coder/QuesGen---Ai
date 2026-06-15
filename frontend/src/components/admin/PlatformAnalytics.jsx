import { BarChart3, TrendingUp, BookOpen, Target, Award } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'

const monthlyGrowth = [
  { month: 'Jan', users: 3200 }, { month: 'Feb', users: 4100 },
  { month: 'Mar', users: 5800 }, { month: 'Apr', users: 7200 },
  { month: 'May', users: 9400 }, { month: 'Jun', users: 12847 },
]

const boardDistribution = [
  { name: 'CBSE', value: 42, color: '#3b82f6' },
  { name: 'RBSE', value: 28, color: '#a855f7' },
  { name: 'ICSE', value: 15, color: '#10b981' },
  { name: 'JEE/NEET', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#64748b' },
]

const subjectPerformance = [
  { subject: 'Physics', avgScore: 72, papers: 2140 },
  { subject: 'Chemistry', avgScore: 68, papers: 1980 },
  { subject: 'Maths', avgScore: 78, papers: 2560 },
  { subject: 'Biology', avgScore: 74, papers: 1611 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-xl">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-bold flex items-center gap-2" style={{ color: p.color || '#3b82f6' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || '#3b82f6' }} />
            {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PlatformAnalytics() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
          <BarChart3 className="w-7 h-7 text-purple-500" /> Platform Analytics
        </h1>
        <p style={{ color: 'var(--text3)' }} className="text-sm">Deep insights into platform usage, performance, and demographic growth</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Questions Solved', value: '2.4M', icon: BookOpen, change: '+186K this month', color: 'blue' },
          { label: 'Oracle Accuracy', value: '89.2%', icon: Target, change: '+2.1% growth', color: 'emerald' },
          { label: 'Papers Today', value: '8,291', icon: Award, change: '+1,205 vs yesterday', color: 'purple' },
          { label: 'Growth YTD', value: '+301%', icon: TrendingUp, change: 'Target: 400%', color: 'amber' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{kpi.value}</p>
            <p style={{ color: 'var(--text2)' }} className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{kpi.label}</p>
            <p className="text-emerald-500 text-[10px] font-bold mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>User Growth (2026)</h3>
          <p style={{ color: 'var(--text3)' }} className="text-xs mb-6 uppercase tracking-widest font-bold">Monthly registrations</p>
          <div style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256} minWidth={0}>
              <AreaChart data={monthlyGrowth}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Board Distribution Pie */}
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Board Distribution</h3>
          <p style={{ color: 'var(--text3)' }} className="text-xs mb-6 uppercase tracking-widest font-bold">Market penetration</p>
          <div style={{ minHeight: 208 }}>
            <ResponsiveContainer width="100%" height={208} minWidth={0}>
              <PieChart>
                <Pie data={boardDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {boardDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {boardDistribution.map(b => (
              <div key={b.name} className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-2 uppercase tracking-tight" style={{ color: 'var(--text2)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name}
                </span>
                <span style={{ color: 'var(--text)' }}>{b.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Subject Performance</h3>
            <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5 uppercase tracking-widest font-bold">Scores & Volume by Discipline</p>
          </div>
        </div>
        <div style={{ minHeight: 288 }}>
          <ResponsiveContainer width="100%" height={288} minWidth={0}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="subject" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" />
              <Bar dataKey="avgScore" fill="#a855f7" radius={[4,4,0,0]} name="Avg Proficiency %" barSize={24} />
              <Bar dataKey="papers" fill="#3b82f680" radius={[4,4,0,0]} name="Volume (Papers)" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
