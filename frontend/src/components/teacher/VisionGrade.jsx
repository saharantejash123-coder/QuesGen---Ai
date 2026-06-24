import { useState, useEffect } from 'react'
import { Eye, Upload, CheckCircle, AlertCircle, BarChart3, TrendingDown, Thermometer, FileText, Zap, Info } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { getTeacherClassAssignment, getStudentsBySchool, getPapersByTeacher } from '../../services/schoolService'

const PLACEHOLDER_HEATMAP = [
  { topic: 'Chapter 1', score: 0 },
  { topic: 'Chapter 2', score: 0 },
  { topic: 'Chapter 3', score: 0 },
  { topic: 'Chapter 4', score: 0 },
]

export default function VisionGrade({ user }) {
  const [scannedSheets, setScannedSheets] = useState([])
  const [classes, setClasses]             = useState([])
  const [papers, setPapers]               = useState([])

  useEffect(() => {
    const email = user?.email
    const school = user?.schoolName
    if (!email) return
    const asgn = getTeacherClassAssignment(email)
    setClasses(asgn?.classNames || [])
    setPapers(getPapersByTeacher(email))
    // Scanned sheets would come from a real grading service — start empty
    setScannedSheets([])
  }, [user])
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
    if (score > 0) return '#f43f5e'
    return 'var(--border)'
  }

  const noData = papers.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Vision-Grade OCR</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">
            {noData
              ? 'AI-powered grading of handwritten papers'
              : `${papers.length} paper${papers.length !== 1 ? 's' : ''} · ${classes.length} class${classes.length !== 1 ? 'es' : ''} · ${scannedSheets.length} sheets graded`}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-g py-2.5! flex items-center gap-2">
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
        {/* Heatmap */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ color: 'var(--text)' }} className="font-bold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Class Performance Heatmap
              </h3>
              <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5">
                {noData ? 'Score data will appear after grading answer sheets' : 'Average score by topic (from graded sheets)'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Mastery</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Average</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> Weak</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={PLACEHOLDER_HEATMAP}>
                <XAxis dataKey="topic" stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 10 }} />
                <YAxis stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="card px-3 py-2">
                          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{payload[0].payload.topic}</p>
                          <p className="text-[10px] font-bold mt-1" style={{ color: 'var(--text3)' }}>No data yet</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {PLACEHOLDER_HEATMAP.map((_, index) => (
                    <Cell key={index} fill="var(--bg3)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p style={{ color: 'var(--text)' }} className="text-sm font-semibold">How heatmaps work</p>
              <p style={{ color: 'var(--text2)' }} className="text-xs mt-0.5">
                Upload scanned answer sheets using Batch Grade. After OCR grading, this chart will fill with real topic-wise performance data.
              </p>
            </div>
          </div>
        </div>

        {/* Scan Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div
            onClick={handleScan}
            className={`card rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all border-dashed border-2 ${
              scanning ? 'border-primary' : 'hover:border-primary/30'
            }`}
            style={{ minHeight: 180, borderColor: scanning ? 'var(--accent)' : 'var(--border)' }}
          >
            {scanning ? (
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            <div className="card p-4" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-[10px]">✓</div>
                <span style={{ color: 'var(--text)' }} className="font-bold text-xs uppercase tracking-wider">Scan Complete</span>
              </div>
              <p style={{ color: 'var(--text3)' }} className="text-xs">Sheet graded successfully. Results will appear in the heatmap.</p>
              <button onClick={() => setShowResult(false)} className="w-full mt-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                Dismiss
              </button>
            </div>
          )}

          <div className="card p-5">
            <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-4">Recent Graded Sheets</h3>
            {scannedSheets.length === 0 ? (
              <div className="text-center py-6" style={{ color: 'var(--text3)' }}>
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-25" />
                <p className="text-xs">No graded sheets yet.</p>
                <p className="text-[10px] mt-1">Upload answer sheets to start grading.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scannedSheets.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p style={{ color: 'var(--text)' }} className="text-xs font-bold">{scan.student}</p>
                        <p style={{ color: 'var(--text3)' }} className="text-[10px] uppercase">{scan.time}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${scan.status === 'Flagged' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {scan.status === 'Flagged' ? 'Flagged' : `${scan.score}/${scan.max}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
