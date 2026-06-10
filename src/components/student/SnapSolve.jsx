import { useState, useRef } from 'react'
import { Camera, Upload, FileText, Download, CheckCircle, ArrowRight, X, Image } from 'lucide-react'

const sampleSolution = {
  question: 'Find the value of k for which the quadratic equation 2x² + kx + 3 = 0 has two equal real roots.',
  steps: [
    { step: 1, title: 'Identify the condition', content: 'For equal roots, discriminant D = b² - 4ac = 0' },
    { step: 2, title: 'Substitute values', content: 'Here a = 2, b = k, c = 3. So D = k² - 4(2)(3) = 0' },
    { step: 3, title: 'Solve for k', content: 'k² - 24 = 0 → k² = 24 → k = ±2√6' },
    { step: 4, title: 'Final Answer', content: 'k = 2√6 or k = -2√6 ≈ ±4.899' },
  ],
}

const briefs = [
  { title: 'Trigonometry Core Sheet', subject: 'Mathematics', pages: '1 page', formulas: 24, color: 'purple' },
  { title: 'Kinematics Quick Review', subject: 'Physics', pages: '1 page', formulas: 18, color: 'blue' },
  { title: 'Organic Reactions Map', subject: 'Chemistry', pages: '1 page', formulas: 32, color: 'emerald' },
  { title: 'Calculus Essentials', subject: 'Mathematics', pages: '1 page', formulas: 20, color: 'amber' },
  { title: 'Electrostatics Cheatsheet', subject: 'Physics', pages: '1 page', formulas: 15, color: 'cyan' },
  { title: 'Periodic Table Trends', subject: 'Chemistry', pages: '1 page', formulas: 22, color: 'rose' },
]

export default function SnapSolve() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [solving, setSolving] = useState(false)
  const [solved, setSolved] = useState(false)
  const fileRef = useRef(null)

  const handleUpload = () => {
    setSolving(true)
    setUploaded(true)
    setTimeout(() => {
      setSolving(false)
      setSolved(true)
    }, 2000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload()
  }

  const handleReset = () => {
    setUploaded(false)
    setSolving(false)
    setSolved(false)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>SnapSolve & Briefs</h1>
        </div>
        <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Upload a question photo for instant AI solutions, or grab a 5-minute review sheet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <div className="space-y-4">
          <h3 style={{ color: 'var(--text)' }} className="font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            SnapSolve — Instant Solutions
          </h3>

          {!uploaded ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => handleUpload()}
              className={`card rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[250px] border-dashed border-2 ${
                isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'hover:border-primary/30'
              }`}
              style={{ borderColor: isDragging ? 'var(--accent)' : 'var(--border)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-primary" />
              </div>
              <p style={{ color: 'var(--text)' }} className="font-medium mb-1">Drag & drop your question photo here</p>
              <p style={{ color: 'var(--text3)' }} className="text-sm mb-4">or click to browse files</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>JPG</span>
                <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>PNG</span>
                <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>PDF</span>
                <span style={{ color: 'var(--text3)' }}>up to 10MB</span>
              </div>
            </div>
          ) : solving ? (
            <div className="card rounded-2xl p-10 flex flex-col items-center justify-center min-h-[250px] animate-fade-in">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" style={{ borderTopColor: 'transparent' }}></div>
              <p style={{ color: 'var(--text)' }} className="font-medium">Analyzing your question...</p>
              <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">AI is processing the image</p>
            </div>
          ) : solved ? (
            <div className="card rounded-2xl p-6 animate-fade-in" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold text-sm">Solution Found</span>
                </div>
                <button onClick={handleReset} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: 'var(--text3)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl mb-4 border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-xs uppercase tracking-wider font-semibold mb-1">Question Detected</p>
                <p style={{ color: 'var(--text)' }} className="text-sm">{sampleSolution.question}</p>
              </div>

              <div className="space-y-3">
                {sampleSolution.steps.map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: 'var(--primary-bg)', color: 'var(--accent)' }}>
                      {s.step}
                    </div>
                    <div>
                      <p style={{ color: 'var(--text)' }} className="text-sm font-medium">{s.title}</p>
                      <p style={{ color: 'var(--text2)' }} className="text-sm mt-0.5">{s.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleReset} className="mt-4 btn-g flex items-center gap-2 !py-2 text-sm w-full justify-center">
                <Upload className="w-4 h-4" />
                Upload Another Question
              </button>
            </div>
          ) : null}
        </div>

        {/* Briefs Section */}
        <div className="space-y-4">
          <h3 style={{ color: 'var(--text)' }} className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            Core-Sheet Briefs — 5-Minute Review
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {briefs.map((brief, i) => (
              <div key={i} className="card rounded-xl p-4 transition-all group cursor-pointer hover:border-primary/20">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: 'var(--bg3)' }}>
                    <FileText className="w-4 h-4" style={{ color: `var(--text2)` }} />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-lg border ml-2" style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <h4 style={{ color: 'var(--text)' }} className="text-sm font-medium mb-1">{brief.title}</h4>
                <p style={{ color: 'var(--text3)' }} className="text-xs">{brief.subject} · {brief.formulas} formulas</p>
                <div className="mt-2 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  View Brief <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
