import { useState } from 'react'
import { FileText, Sparkles, Download, CheckCircle, Clock, Wand2, FileSearch, AlertTriangle, Printer, RefreshCw } from 'lucide-react'
import { generatePaperAsync } from '../../data/oracleData'

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science', 'English', 'Social Science', 'Hindi']
const boards = ['CBSE', 'ICSE', 'RBSE']
const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12']

export default function StudioQ() {
  const [generating, setGenerating] = useState(false)
  const [paper, setPaper] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    class: 'Class 12',
    subject: 'Physics',
    board: 'CBSE',
    difficulty: 'Mixed',
  })

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    setError('')
    setPaper(null)
    try {
      const generated = await generatePaperAsync(formData.board, formData.class, formData.subject)
      setPaper(generated)
    } catch (err) {
      setError(err.message || 'Failed to generate paper. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setPaper(null)
    setError('')
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Studio-Q Paper Generator</h1>
        </div>
        <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Generate beautifully formatted exam papers with AI in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6">
            <h3 style={{ color: 'var(--text)' }} className="font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-500" />
              Configure Paper
            </h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Board</label>
                <select
                  style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                >
                  {boards.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Class</label>
                  <select
                    style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Subject</label>
                  <select
                    style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Difficulty Profile</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Mixed', 'Hard'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: d })}
                      className="py-2 rounded-xl text-xs font-bold transition-all border"
                      style={{
                        borderColor: formData.difficulty === d ? 'rgba(59,130,246,0.3)' : 'var(--border)',
                        background: formData.difficulty === d ? 'rgba(59,130,246,0.1)' : 'transparent',
                        color: formData.difficulty === d ? '#3B82F6' : 'var(--text3)',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={generating}
                className="w-full btn-p py-3! flex items-center justify-center gap-2 mt-4"
              >
                {generating ? (
                  <><Clock className="w-4 h-4 animate-spin" /> Generating with AI…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Paper</>
                )}
              </button>
            </form>
          </div>

          <div className="card p-4" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 style={{ color: 'var(--text)' }} className="text-sm font-semibold">Smart Select Active</h4>
                <p style={{ color: 'var(--text3)' }} className="text-xs mt-0.5">AI is prioritizing high-probability Oracle topics for {formData.board} {formData.class}.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Preview */}
        <div className="lg:col-span-2">
          {!generating && !paper ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center h-full min-h-400px">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <FileSearch className="w-8 h-8 text-blue-500" />
              </div>
              <h3 style={{ color: 'var(--text)' }} className="font-semibold text-lg">No Paper Generated Yet</h3>
              <p style={{ color: 'var(--text3)' }} className="text-sm max-w-sm mt-2">
                Configure the settings on the left and click "Generate Paper" to create your AI-powered exam paper.
              </p>
            </div>
          ) : generating ? (
            <div className="card p-12 flex flex-col items-center justify-center h-full min-h-400px">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <h3 style={{ color: 'var(--text)' }} className="font-bold text-lg mb-2">QuesGen AI is creating your paper…</h3>
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>This may take up to 60 seconds. Please wait.</p>
            </div>
          ) : paper ? (
            <div className="card p-0 overflow-hidden animate-slide-up h-full">
              {/* Toolbar */}
              <div className="p-4 border-b flex items-center justify-between" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text)' }} className="text-sm font-bold">AI Generated Paper</h4>
                    <p style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold">{formData.subject} · {formData.board} · {formData.class}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="btn-g py-2! px-3! text-xs flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> New Paper
                  </button>
                  <button onClick={() => window.print()} className="btn-p py-2! px-3! text-xs flex items-center gap-1">
                    <Printer className="w-3 h-3" /> Print
                  </button>
                </div>
              </div>

              {/* Paper Content */}
              <div className="p-8 overflow-y-auto" style={{ maxHeight: 600, background: 'var(--bg2)', color: 'var(--text)' }}>
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Header */}
                  <div className="text-center border-b pb-6" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold uppercase tracking-widest">{formData.board} — {formData.class}</h2>
                    <h3 className="text-lg font-medium">{formData.subject} — Mock Examination</h3>
                    <div className="flex justify-between text-xs mt-4 font-bold" style={{ color: 'var(--text3)' }}>
                      <span>TIME: {Math.floor(paper.metadata.timeMinutes / 60)} HOURS</span>
                      <span>MAX MARKS: {paper.metadata.totalMarks}</span>
                    </div>
                  </div>

                  {/* Sections */}
                  {paper.sections.map((sec) => (
                    <div key={sec.id} className="space-y-4">
                      <p className="font-bold text-blue-500 uppercase text-sm">{sec.name}</p>
                      <div className="space-y-5 pl-2">
                        {sec.questions.map((q, qi) => (
                          <div key={q.id || qi} className="flex gap-3 text-sm">
                            <span className="font-bold shrink-0">Q{qi + 1}.</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-start gap-2">
                                <p className="mb-2">{q.text}</p>
                                <span className="font-bold shrink-0 text-xs" style={{ color: 'var(--text3)' }}>[{sec.marksPerQuestion}]</span>
                              </div>
                              {q.options && (
                                <div className="grid grid-cols-2 gap-1 ml-2 text-xs" style={{ color: 'var(--text2)' }}>
                                  {(Array.isArray(q.options)
                                    ? q.options
                                    : Object.values(q.options)
                                  ).map((opt, oi) => (
                                    <div key={oi}>({String.fromCharCode(97 + oi)}) {typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="text-center text-sm italic pt-4" style={{ borderTop: '1px solid var(--border)', color: 'var(--text3)' }}>
                    — End of Paper — Generated by QuesGen AI
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
