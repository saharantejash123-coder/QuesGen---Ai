import { useState } from 'react'
import { FileText, Sparkles, Download, CheckCircle, Clock, ChevronRight, Wand2, FileSearch } from 'lucide-react'

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology']
const boards = ['CBSE', 'ICSE', 'RBSE', 'JEE', 'NEET']
const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12']

export default function StudioQ() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [formData, setFormData] = useState({
    class: 'Class 12',
    subject: 'Physics',
    board: 'CBSE',
    questions: 25,
    difficulty: 'Mixed'
  })

  const handleGenerate = (e) => {
    e.preventDefault()
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 4000)
  }

  const handleReset = () => {
    setGenerated(false)
    setGenerating(false)
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
                  onChange={(e) => setFormData({...formData, board: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
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
                      onClick={() => setFormData({...formData, difficulty: d})}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        formData.difficulty === d 
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
                          : 'bg-transparent text-slate-500'
                      }`}
                      style={{ 
                        borderColor: formData.difficulty === d ? 'rgba(59,130,246,0.3)' : 'var(--border)',
                        color: formData.difficulty === d ? '#3B82F6' : 'var(--text3)'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={generating}
                className="w-full btn-p py-3! flex items-center justify-center gap-2 mt-4"
              >
                {generating ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Paper
                  </>
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
          {!generating && !generated ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center h-full min-h-400px">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <FileSearch className="w-8 h-8 text-blue-500" />
              </div>
              <h3 style={{ color: 'var(--text)' }} className="font-semibold text-lg">No Paper Generated Yet</h3>
              <p style={{ color: 'var(--text3)' }} className="text-sm max-w-sm mt-2">
                Configure the settings on the left and click "Generate Paper" to create your first AI-assisted exam.
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
              <h3 style={{ color: 'var(--text)' }} className="font-bold text-lg mb-2">Creating Your Paper</h3>
              <div className="space-y-3 w-full max-w-xs capitalize">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text3)' }}>Selecting {formData.subject} PYQs</span>
                  <span className="text-emerald-500 font-bold">Complete</span>
                </div>
                <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text3)' }}>Balancing difficulty: {formData.difficulty}</span>
                  <span className="text-blue-500 font-bold animate-pulse">Processing...</span>
                </div>
                <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                  <div className="h-full bg-blue-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden animate-slide-up h-full">
              <div className="p-4 border-b flex items-center justify-between" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text)' }} className="text-sm font-bold">Paper_Preview_Full.pdf</h4>
                    <p style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold">{formData.subject} · {formData.board} · UNIT TEST</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={handleReset} className="btn-p py-2! px-4! text-xs">Finalize Paper</button>
                </div>
              </div>
              
              <div className="p-8 backdrop-blur-3xl h-500px overflow-y-auto custom-scrollbar italic text-sm" style={{ background: 'var(--bg2)', color: 'var(--text2)' }}>
                <div className="max-w-2xl mx-auto space-y-8 non-italic" style={{ color: 'var(--text)' }}>
                  <div className="text-center border-b pb-6" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold uppercase tracking-widest">{formData.board} - {formData.class}</h2>
                    <h3 className="text-lg font-medium">{formData.subject} - Mock Examination</h3>
                    <div className="flex justify-between text-xs mt-4 font-bold" style={{ color: 'var(--text3)' }}>
                      <span>TIME: 3 HOURS</span>
                      <span>MAX MARKS: 70</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="font-bold text-blue-500">SECTION A (OBJECTIVE TYPE QUESTIONS)</p>
                      <div className="space-y-4 text-sm pl-2">
                        <div className="flex gap-3">
                          <span className="font-bold">Q1.</span>
                          <p>Which of the following is the dimensional formula for electrical conductivity?</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold">Q2.</span>
                          <p>A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 40 cm. The power of the combination is...</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold">Q3.</span>
                          <p>The work done in bringing a unit positive charge from infinity to a point in an electric field is called...</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-bold text-blue-500">SECTION B (SHORT ANSWER QUESTIONS)</p>
                      <div className="space-y-4 text-sm pl-2">
                        <div className="flex gap-3">
                          <span className="font-bold">Q11.</span>
                          <p>State and explain Gauss's Law in electrostatics. Mention one of its applications.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold">Q12.</span>
                          <p>Derive an expression for the energy stored in a capacitor of capacitance C charged to potential V.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
