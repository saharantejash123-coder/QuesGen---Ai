import { useState } from 'react'
import { Eye, Upload, CheckCircle, AlertCircle, BarChart3, TrendingDown, Thermometer, User, FileText, Zap } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ScatterChart, Scatter, ZAxis } from 'recharts'

const heatmapData = [
  { topic: 'Kinematics', score: 85, freq: 12 },
  { topic: 'Laws of Motion', score: 72, freq: 15 },
  { topic: 'Work & Energy', score: 91, freq: 8 },
  { topic: 'Gravitation', score: 45, freq: 22 },
  { topic: 'Rotational', score: 38, freq: 25 },
  { topic: 'Oscillations', score: 64, freq: 10 },
  { topic: 'Waves', score: 55, freq: 18 },
  { topic: 'Electrostatics', score: 78, freq: 14 },
]

const recentScans = [
  { id: 'S001', student: 'Amit Kumar', score: 28, max: 30, status: 'Success', time: '10 mins ago' },
  { id: 'S002', student: 'Sneha Rao', score: 12, max: 30, status: 'Success', time: '15 mins ago' },
  { id: 'S003', student: 'Rohan Shah', score: 22, max: 30, status: 'Success', time: '22 mins ago' },
  { id: 'S004', student: 'Isha Gupta', score: 0, max: 30, status: 'Flagged', time: '1 hr ago' },
]

export default function VisionGrade() {
  const [scanning, setScanning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setShowResult(true)
    }, 3000)
  }

  const getHeatColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#f43f5e'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Vision-Grade OCR</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">AI-powered grading of handwritten papers with class-wide heatmaps</p>
        </div>
        <div className="flex gap-2">
           <button className="btn-g !py-2.5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Export Insights
          </button>
          <button onClick={handleScan} className="btn-p flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Batch Grade 
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pilot Dashboard Heatmap */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ color: 'var(--text)' }} className="font-bold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Pilot Dashboard Heatmap
              </h3>
              <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5">Class performance by topic (Physics - Unit 2)</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Mastery</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Average</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Weak Point</div>
            </div>
          </div>

          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData}>
                <XAxis dataKey="topic" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 10 }} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="card px-3 py-2">
                          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{payload[0].payload.topic}</p>
                          <p className="text-xl font-black mt-1" style={{color: getHeatColor(payload[0].value)}}>
                            {payload[0].value}%
                          </p>
                          <p className="text-[10px] uppercase font-bold mt-1" style={{ color: 'var(--text3)' }}>Average Score</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getHeatColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)' }}>
            <TrendingDown className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p style={{ color: 'var(--text)' }} className="text-sm font-semibold">Critical Insight: Kinematics Block</p>
              <p style={{ color: 'var(--text2)' }} className="text-xs mt-0.5">
                75% of the class is falling behind in <span className="text-rose-500 font-bold">Rotational Motion</span> and <span className="text-rose-500 font-bold">Gravitation</span>. Recommended action: 15-minute bridge session scheduled for Wednesday.
              </p>
            </div>
          </div>
        </div>

        {/* Scan & Recent Activities */}
        <div className="lg:col-span-1 space-y-4">
          <div 
            onClick={handleScan}
            className={`card rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[180px] border-dashed border-2 ${
              scanning ? 'border-primary' : 'hover:border-primary/30'
            }`}
            style={{ borderColor: scanning ? 'var(--accent)' : 'var(--border)' }}
          >
            {scanning ? (
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p style={{ color: 'var(--text)' }} className="font-bold text-sm">Processing Scan...</p>
                <p style={{ color: 'var(--text3)' }} className="text-xs mt-1">Vision-Grade OCR is reading handwriting</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-indigo-500" />
                </div>
                <p style={{ color: 'var(--text)' }} className="font-bold text-sm">Upload Answer Sheets</p>
                <p style={{ color: 'var(--text3)' }} className="text-xs mt-1">Supports bulk PDF/JPG uploads</p>
              </div>
            )}
          </div>

          {showResult && !scanning && (
            <div className="card p-4 animate-fade-in" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-[10px]">93%</div>
                <span style={{ color: 'var(--text)' }} className="font-bold text-xs uppercase tracking-wider">Last Scan: Amit Kumar</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: 'var(--text3)' }} className="text-sm">Grade Assigned</span>
                  <span style={{ color: 'var(--text)' }} className="font-bold">28/30 (A+)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: 'var(--text3)' }} className="text-sm">AI Accuracy</span>
                  <span className="text-emerald-500 font-bold">99.8% Confidence</span>
                </div>
              </div>
              <button 
                onClick={() => setShowResult(false)} 
                className="w-full mt-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{ background: 'var(--bg3)', color: 'var(--text3)' }}
              >
                View Deduction Notes
              </button>
            </div>
          )}

          <div className="card p-5">
            <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-4">Recent Graded Sheets</h3>
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-slate-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--bg3)' }}>
                       <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p style={{ color: 'var(--text)' }} className="text-xs font-bold">{scan.student}</p>
                      <p style={{ color: 'var(--text3)' }} className="text-[10px] uppercase">{scan.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${scan.status === 'Flagged' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {scan.status === 'Flagged' ? 'Flagged' : `${scan.score}/${scan.max}`}
                    </p>
                    {scan.status === 'Flagged' && <AlertCircle className="w-3 h-3 text-rose-500 ml-auto mt-0.5" />}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-indigo-500 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">
              View All 42 Scans
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
