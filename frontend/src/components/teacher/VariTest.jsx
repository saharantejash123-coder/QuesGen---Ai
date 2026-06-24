import { useState, useEffect } from 'react'
import { Shield, Layers, RefreshCw, Check, Copy, Download, Share2, AlertCircle } from 'lucide-react'
import { getPapersByTeacher } from '../../services/schoolService'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildVariants(paper) {
  if (!paper) return {}
  const allQs = (paper.sections || []).flatMap(sec =>
    (sec.questions || []).map(q => ({
      text: q.text || q.q || q.question || '(Question text)',
      options: q.options || [],
      marks: sec.marksPerQ || q.marks || 1,
    }))
  )
  if (allQs.length === 0) return {}
  const sets = {}
  ;['A', 'B', 'C', 'D'].forEach(letter => {
    sets[`Set ${letter}`] = shuffleArray(allQs)
  })
  return sets
}

export default function VariTest({ user }) {
  const [basePaper, setBasePaper]   = useState(null)
  const [variants, setVariants]     = useState({})
  const [activeSet, setActiveSet]   = useState('Set A')
  const [splitting, setSplitting]   = useState(false)
  const [copied, setCopied]         = useState(false)

  useEffect(() => {
    const email = user?.email
    if (!email) return
    const all = getPapersByTeacher(email)
    if (all.length > 0) {
      const latest = all[all.length - 1]
      setBasePaper(latest)
      setVariants(buildVariants(latest))
    }
  }, [user])

  const handleSplit = () => {
    setSplitting(true)
    setTimeout(() => {
      if (basePaper) setVariants(buildVariants(basePaper))
      setSplitting(false)
    }, 1500)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const setNames       = Object.keys(variants)
  const activeSetQs    = variants[activeSet] || []
  const totalQuestions = (basePaper?.sections || []).reduce((s, sec) => s + (sec.questions?.length || 0), 0)
  const paperTitle     = basePaper
    ? `${basePaper.subject || 'Paper'} — ${basePaper.paperType === 'unit_test' ? 'Unit Test' : basePaper.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Full Exam'}`
    : ''

  if (!basePaper) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Vari-Test Anti-Cheat</h1>
        </div>
        <p style={{ color: 'var(--text3)' }} className="text-sm">Generate multi-set variants of your paper to prevent copying</p>
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 mb-4" style={{ color: 'var(--text3)', opacity: 0.35 }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>No Base Paper Found</h3>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text3)' }}>
            Generate and save a paper in Studio-Q first. Vari-Test will automatically create shuffled A/B/C/D sets from your saved paper.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Vari-Test Anti-Cheat</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Multi-set variants of your paper — question order shuffled per set</p>
        </div>
        <button onClick={handleSplit} disabled={splitting} className="btn-p flex items-center gap-2">
          {splitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
          Reshuffle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Base Paper Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
            <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-3">Active Base Paper</h3>
            <div className="space-y-3">
              {[
                { label: 'Paper Title',      value: paperTitle },
                { label: 'Total Questions',  value: `${totalQuestions} Questions` },
                { label: 'Board',            value: basePaper.board || 'CBSE' },
                { label: 'Total Marks',      value: `${basePaper.totalMarks || 0} marks` },
              ].map(row => (
                <div key={row.label} className="p-3 rounded-lg border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <p style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold">{row.label}</p>
                  <p style={{ color: 'var(--text)' }} className="text-sm mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <p className="text-amber-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Anti-Cheat Strategy
            </p>
            <p style={{ color: 'var(--text2)' }} className="text-xs leading-relaxed">
              Vari-Test shuffles question order across {setNames.length} sets. Every student gets a different set making copying impossible.
            </p>
          </div>
        </div>

        {/* Set Tabs & Preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {setNames.map(setName => (
              <button
                key={setName}
                onClick={() => setActiveSet(setName)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all border"
                style={{
                  borderColor: activeSet === setName ? 'rgba(245,158,11,0.3)' : 'var(--border)',
                  color: activeSet === setName ? '#f59e0b' : 'var(--text3)',
                  background: activeSet === setName ? 'rgba(245,158,11,0.05)' : 'transparent',
                }}
              >
                {setName}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden flex flex-col p-0 relative" style={{ minHeight: 400 }}>
            <div className={`p-6 flex-1 space-y-6 ${splitting ? 'opacity-30 blur-sm pointer-events-none' : ''} transition-all duration-300`}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h3 style={{ color: 'var(--text)' }} className="font-bold text-lg">{activeSet} Preview</h3>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2 rounded-lg border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button className="p-2 rounded-lg border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 max-w-2xl">
                {activeSetQs.length === 0 ? (
                  <p style={{ color: 'var(--text3)' }} className="text-sm">No questions found in this paper's sections.</p>
                ) : (
                  activeSetQs.map((item, i) => (
                    <div key={i} className="group relative">
                      <div className="absolute -left-6 top-0 text-amber-500/10 font-black text-4xl group-hover:text-amber-500/20 transition-colors select-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="pl-6 space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
                            Q{i + 1}. {item.text}
                          </p>
                          <span className="text-xs px-2 py-1 rounded font-bold shrink-0 ml-4" style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
                            [{item.marks} M]
                          </span>
                        </div>
                        {item.options?.length > 0 && (
                          <div className="pl-4 space-y-1">
                            {item.options.map((opt, oi) => (
                              <p key={oi} className="text-sm" style={{ color: 'var(--text3)' }}>
                                ({String.fromCharCode(65 + oi)}) {opt}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {splitting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-amber-500 text-sm font-bold uppercase tracking-wider">Reshuffling Sets...</p>
              </div>
            )}

            <div className="p-4 border-t flex justify-center" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
              <p style={{ color: 'var(--text3)' }} className="text-[10px] font-bold uppercase tracking-widest">
                {paperTitle} · {totalQuestions} questions · {setNames.length} sets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
