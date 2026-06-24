import { useState, useEffect } from 'react'
import {
  FileText, Sparkles, Download, CheckCircle, Clock, Wand2, FileSearch,
  AlertTriangle, Printer, RefreshCw, Pencil, Save, X, Send, ChevronDown,
  ChevronUp, Trash2, BookOpen, Zap, ClipboardList, Users, XCircle, BarChart2,
} from 'lucide-react'
import { generatePaperAsync } from '../../data/oracleData'
import { savePaper, getPapersByTeacher, deletePaper, getTeacherClassAssignment, getTestSubmissions, unassignPaper } from '../../services/schoolService'
import { CLASS_OPTIONS, STREAMS, hasStream, subjectsFor } from '../../data/academics'

const boards = ['CBSE', 'ICSE', 'RBSE', 'UPMSP', 'State Board']
const classes = CLASS_OPTIONS  // Class 10 & Class 12 only

const PAPER_TYPES = [
  { id: 'full_exam',  label: 'Full Exam',   desc: 'Complete board-pattern paper', icon: FileText },
  { id: 'unit_test',  label: 'Unit Test',   desc: 'Chapter-focused, 40–50 marks', icon: ClipboardList },
  { id: 'quick_quiz', label: 'Quick Quiz',  desc: 'Short MCQ quiz, 20 mins',      icon: Zap },
]

export default function StudioQ({ user }) {
  const [generating, setGenerating] = useState(false)
  const [paper, setPaper]           = useState(null)
  const [error, setError]           = useState('')
  const [formData, setFormData]     = useState({
    class: 'Class 10', subject: 'Science', board: 'CBSE', stream: 'Science',
    difficulty: 'Mixed', paperType: 'full_exam',
    numQuestions: '', timeMinutes: '',
  })

  // My Papers
  const [myPapers, setMyPapers]     = useState([])
  const [showMyPapers, setShowMyPapers] = useState(false)

  // Inline editing
  const [editingQ, setEditingQ]     = useState(null) // { sIdx, qIdx }
  const [editText, setEditText]     = useState('')
  const [editOpts, setEditOpts]     = useState([])

  // Assign
  const [assignedClasses, setAssignedClasses] = useState([])
  const [teacherClasses, setTeacherClasses]   = useState([])
  const [assignSuccess, setAssignSuccess]     = useState(false)
  const [paperId, setPaperId]                 = useState(null)
  const [saved, setSaved]                     = useState(false)
  const [resultsModal, setResultsModal]       = useState(null) // paper object
  const [expandedSub, setExpandedSub]         = useState(null) // studentEmail being drilled into

  const teacherEmail = user?.email || ''
  const teacherName  = user?.name || user?.firstName || 'Teacher'
  const schoolName   = user?.schoolName || ''

  useEffect(() => {
    if (!teacherEmail) return
    const papers = getPapersByTeacher(teacherEmail)
    setMyPapers(papers)

    const assignment = getTeacherClassAssignment(teacherEmail)
    if (assignment?.classNames?.length) {
      setTeacherClasses(assignment.classNames)
    }
  }, [teacherEmail])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    setError('')
    setPaper(null)
    setSaved(false)
    setAssignedClasses([])
    setAssignSuccess(false)
    setEditingQ(null)
    try {
      const generated = await generatePaperAsync(formData.board, formData.class, formData.subject, {
        numQuestions: formData.numQuestions,
        timeMinutes: formData.timeMinutes,
      })
      const id = 'paper_' + Date.now()
      setPaperId(id)
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
    setSaved(false)
    setAssignedClasses([])
    setAssignSuccess(false)
    setEditingQ(null)
    setPaperId(null)
  }

  // ── Editing ────────────────────────────────────────────────────────────────

  const startEdit = (sIdx, qIdx, q) => {
    setEditingQ({ sIdx, qIdx })
    setEditText(q.text)
    setEditOpts(Array.isArray(q.options) ? [...q.options] : (q.options ? Object.values(q.options) : []))
  }

  const commitEdit = () => {
    if (!editingQ) return
    const { sIdx, qIdx } = editingQ
    setPaper(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.sections[sIdx].questions[qIdx].text = editText
      if (editOpts.length) next.sections[sIdx].questions[qIdx].options = editOpts
      return next
    })
    setEditingQ(null)
  }

  const cancelEdit = () => setEditingQ(null)

  // ── Save & Assign ─────────────────────────────────────────────────────────

  const handleSavePaper = () => {
    if (!paper) return
    const rec = {
      id: paperId,
      teacherEmail,
      teacherName,
      schoolName,
      board: formData.board,
      class: formData.class,
      subject: formData.subject,
      difficulty: formData.difficulty,
      paperType: formData.paperType,
      totalMarks: paper.metadata?.totalMarks,
      timeMinutes: paper.metadata?.timeMinutes,
      sections: paper.sections,
      metadata: paper.metadata,
      assignedClasses: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
    savePaper(rec)
    setMyPapers(getPapersByTeacher(teacherEmail))
    setSaved(true)
  }

  const toggleClass = (cls) => {
    setAssignedClasses(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    )
  }

  const handleAssign = () => {
    if (!assignedClasses.length || !paperId) return
    const existing = myPapers.find(p => p.id === paperId)
    const rec = {
      ...(existing || {}),
      id: paperId,
      teacherEmail,
      teacherName,
      schoolName,
      board: formData.board,
      class: formData.class,
      subject: formData.subject,
      difficulty: formData.difficulty,
      paperType: formData.paperType,
      totalMarks: paper.metadata?.totalMarks,
      timeMinutes: paper.metadata?.timeMinutes,
      sections: paper.sections,
      metadata: paper.metadata,
      assignedClasses,
      status: 'assigned',
      createdAt: existing?.createdAt || new Date().toISOString(),
    }
    savePaper(rec)
    setMyPapers(getPapersByTeacher(teacherEmail))
    setSaved(true)
    setAssignSuccess(true)
  }

  const handleDeleteSaved = (id) => {
    deletePaper(id)
    setMyPapers(getPapersByTeacher(teacherEmail))
  }

  const handleUnassign = (id) => {
    unassignPaper(id)
    setMyPapers(getPapersByTeacher(teacherEmail))
  }

  // ── HTML generation ────────────────────────────────────────────────────────

  const buildPaperHTML = () => {
    if (!paper) return ''
    const timeStr = `${Math.floor(paper.metadata.timeMinutes / 60)} Hours${paper.metadata.timeMinutes % 60 > 0 ? ` ${paper.metadata.timeMinutes % 60} Minutes` : ''}`
    const sectionsHTML = paper.sections.map((sec) => {
      const questionsHTML = sec.questions.map((q, qi) => {
        const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])
        const optionsHTML = opts.length > 0
          ? `<div class="options">${opts.map((opt, i) =>
              `<span>(${String.fromCharCode(97 + i)}) ${typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}</span>`
            ).join('')}</div>` : ''
        return `<div class="question"><span class="q-num">Q${qi + 1}.</span><div class="q-body"><div class="q-header"><span class="q-text">${q.text}</span><span class="marks">[${sec.marksPerQuestion}]</span></div>${optionsHTML}</div></div>`
      }).join('')
      return `<div class="section"><div class="sec-title">${sec.name}</div>${questionsHTML}</div>`
    }).join('')
    const instrHTML = paper.sections.map(s =>
      `<li>${s.name} consists of ${s.count} questions of ${s.marksPerQuestion} mark${s.marksPerQuestion > 1 ? 's' : ''} each.</li>`
    ).join('')
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${formData.board} ${formData.class} ${formData.subject}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Times New Roman',serif;background:#fff;color:#000;padding:36px;max-width:860px;margin:0 auto;font-size:14px;line-height:1.65}.doc-header{text-align:center;border-bottom:2.5px solid #000;padding-bottom:16px;margin-bottom:22px}.doc-header h1{font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}.doc-header h2{font-size:16px;font-weight:bold;margin-bottom:4px}.meta{display:flex;justify-content:space-between;margin-top:14px;font-weight:bold;font-size:13px}.instructions{margin-bottom:22px}.instructions h4{font-weight:bold;margin-bottom:8px}.instructions ol{padding-left:22px}.section{margin-bottom:26px;page-break-inside:avoid}.sec-title{text-align:center;font-weight:bold;font-size:15px;margin-bottom:14px;border-bottom:1px solid #ccc;padding-bottom:6px}.question{display:flex;gap:10px;margin-bottom:16px;page-break-inside:avoid}.q-num{font-weight:bold;min-width:30px;flex-shrink:0}.q-body{flex:1}.q-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}.q-text{flex:1}.marks{font-weight:bold;white-space:nowrap}.options{display:grid;grid-template-columns:1fr 1fr;gap:5px 16px;margin-left:8px;margin-top:4px}.footer{text-align:center;margin-top:40px;font-style:italic;border-top:1px solid #ccc;padding-top:14px;color:#555}@page{margin:18mm 20mm}@media print{body{padding:0}}</style></head><body><div class="doc-header"><h1>${formData.board} BOARD EXAMINATION — 2025-26</h1><h2>${formData.class} — ${formData.subject} (${formData.paperType === 'unit_test' ? 'Unit Test' : formData.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Examination'})</h2><div class="meta"><span>Time: ${timeStr}</span><span>Max Marks: ${paper.metadata.totalMarks}</span></div></div><div class="instructions"><h4>General Instructions:</h4><ol><li>This question paper has ${paper.sections.length} sections.</li><li>All questions are compulsory.</li>${instrHTML}</ol></div>${sectionsHTML}<div class="footer">*** END OF PAPER *** — Generated by QuesGen AI • Teacher: ${teacherName}</div></body></html>`
  }

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes')
    win.document.write(buildPaperHTML())
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  const handleDownload = () => {
    const html = buildPaperHTML()
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `${formData.board}_${formData.class}_${formData.subject.replace(/\s+/g, '_')}_Paper.html`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  const typeIcon = (t) => PAPER_TYPES.find(p => p.id === t)?.label || 'Full Exam'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Studio-Q Paper Generator</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Generate, edit, and assign exam papers with AI</p>
        </div>

        {/* My Papers toggle */}
        <button
          onClick={() => setShowMyPapers(!showMyPapers)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <BookOpen className="w-4 h-4" />
          My Papers
          <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
            {myPapers.length}
          </span>
          {showMyPapers ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* My Papers List */}
      {showMyPapers && (
        <div className="card p-4 space-y-2">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Saved Papers ({myPapers.length})</h3>
          {myPapers.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text3)' }}>No papers saved yet. Generate and save a paper below.</p>
          ) : (
            myPapers.map(p => {
              const submissions = p.status === 'assigned' ? getTestSubmissions(p.id) : []
              return (
                <div key={p.id} className="rounded-xl border p-3 space-y-2" style={{ background: 'var(--bg3)', borderColor: p.status === 'assigned' ? 'rgba(16,185,129,0.25)' : 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{p.subject} — {p.class}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                        {p.board} · {typeIcon(p.paperType)} · {p.totalMarks} marks
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text3)' }}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <button onClick={() => handleDeleteSaved(p.id)} className="p-1.5 rounded-lg shrink-0" style={{ color: 'rgba(239,68,68,0.7)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {p.status === 'assigned' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                        Assigned to {p.assignedClasses?.join(', ')}
                      </span>
                      <button
                        onClick={() => setResultsModal(p)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}
                      >
                        <BarChart2 className="w-3 h-3" />
                        Results ({submissions.length})
                      </button>
                      <button
                        onClick={() => handleUnassign(p.id)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <XCircle className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Results Modal */}
      {resultsModal && (() => {
        const subs = getTestSubmissions(resultsModal.id)

        // Extract only MCQ questions (matching TakeTest logic)
        const mcqQs = []
        ;(resultsModal.sections || []).forEach(sec => {
          (sec.questions || []).forEach(q => {
            const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])
            if (opts.length < 2) return
            mcqQs.push({
              text: q.text || q.q || q.question || '',
              options: opts.map(o => typeof o === 'string' ? o.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : String(o)),
              answer: q.answer ?? null,
            })
          })
        })

        const sortedSubs = [...subs].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <div style={{ background: 'var(--bg)', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,.3)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Results — {resultsModal.subject} ({resultsModal.class})</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>
                    {subs.length} student{subs.length !== 1 ? 's' : ''} attempted · {mcqQs.length} MCQ questions · {resultsModal.totalMarks} marks
                  </p>
                </div>
                <button onClick={() => { setResultsModal(null); setExpandedSub(null) }}
                  style={{ padding: '.4rem', borderRadius: 8, background: 'var(--bg3)', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {subs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No submissions yet. Students haven't taken this test.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    {sortedSubs.map((sub, i) => {
                      const pct = sub.percentage || 0
                      const barColor = pct >= 75 ? '#10B981' : pct >= 45 ? '#F59E0B' : '#EF4444'
                      const isExpanded = expandedSub === sub.studentEmail
                      const answers = sub.answers || {}

                      const correctCount = mcqQs.filter((q, qi) => answers[qi] === q.answer).length
                      const wrongCount   = mcqQs.filter((q, qi) => answers[qi] !== undefined && answers[qi] !== q.answer).length
                      const skipCount    = mcqQs.filter((_, qi) => answers[qi] === undefined).length

                      return (
                        <div key={i} style={{ borderRadius: 14, border: `1px solid ${isExpanded ? 'rgba(59,130,246,.35)' : 'var(--border)'}`, overflow: 'hidden', background: 'var(--bg3)', transition: 'border-color .2s' }}>
                          {/* Summary row */}
                          <div style={{ padding: '.85rem 1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.75rem', marginBottom: '.4rem' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                  <span className="text-xs mr-1" style={{ color: 'var(--text3)' }}>#{i + 1}</span>
                                  {sub.studentName || sub.studentEmail}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text3)' }}>
                                  {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', flexShrink: 0 }}>
                                <div style={{ textAlign: 'right' }}>
                                  <p className="text-sm font-bold" style={{ color: barColor }}>{sub.score}/{sub.total}</p>
                                  <p className="text-xs font-bold" style={{ color: barColor }}>{pct}%</p>
                                </div>
                                <button
                                  onClick={() => setExpandedSub(isExpanded ? null : sub.studentEmail)}
                                  className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
                                  style={{ background: isExpanded ? 'rgba(59,130,246,.12)' : 'var(--bg2)', color: isExpanded ? '#3B82F6' : 'var(--text3)', border: `1px solid ${isExpanded ? 'rgba(59,130,246,.3)' : 'var(--border)'}`, cursor: 'pointer' }}
                                >
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  {isExpanded ? 'Hide' : 'Details'}
                                </button>
                              </div>
                            </div>

                            {/* Score bar */}
                            <div style={{ height: 4, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden', marginBottom: '.4rem' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4 }} />
                            </div>

                            {/* Quick dot strip ✓ ✗ – per question */}
                            {mcqQs.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '.2rem', flexWrap: 'wrap', marginBottom: '.35rem' }}>
                                {mcqQs.map((q, qi) => {
                                  const chosen  = answers[qi]
                                  const isRight = chosen === q.answer
                                  const skipped = chosen === undefined
                                  return (
                                    <span key={qi}
                                      title={`Q${qi + 1}: ${isRight ? 'Correct' : skipped ? 'Skipped' : 'Wrong'}`}
                                      style={{
                                        width: 17, height: 17, borderRadius: '50%',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '.52rem', fontWeight: 800, flexShrink: 0, cursor: 'default',
                                        background: isRight ? 'rgba(16,185,129,.18)' : skipped ? 'rgba(245,158,11,.15)' : 'rgba(239,68,68,.18)',
                                        color: isRight ? '#10B981' : skipped ? '#D97706' : '#EF4444',
                                        border: `1px solid ${isRight ? 'rgba(16,185,129,.35)' : skipped ? 'rgba(245,158,11,.3)' : 'rgba(239,68,68,.35)'}`,
                                      }}
                                    >
                                      {isRight ? '✓' : skipped ? '–' : '✗'}
                                    </span>
                                  )
                                })}
                                <span className="text-[10px] ml-1 font-semibold" style={{ color: 'var(--text3)' }}>
                                  {correctCount}✓ {wrongCount}✗{skipCount > 0 ? ` ${skipCount}–` : ''}
                                </span>
                              </div>
                            )}

                            {/* AI feedback */}
                            {sub.aiFeedback && (
                              <div style={{ padding: '.35rem .55rem', borderRadius: 8, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)' }}>
                                <p className="text-[10px] font-bold mb-0.5" style={{ color: '#7C3AED' }}>✨ AI Feedback</p>
                                <p className="text-xs" style={{ color: 'var(--text3)', lineHeight: 1.5 }}>{sub.aiFeedback}</p>
                              </div>
                            )}
                          </div>

                          {/* Expanded: per-question breakdown */}
                          {isExpanded && (
                            <div style={{ borderTop: '1px solid var(--border)', padding: '.75rem 1rem', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
                              <p className="text-xs font-bold uppercase" style={{ color: 'var(--text3)', letterSpacing: '.4px', marginBottom: '.1rem' }}>
                                Question-by-question breakdown
                              </p>
                              {mcqQs.map((q, qi) => {
                                const chosen  = answers[qi]
                                const correct = q.answer
                                const isRight = chosen === correct
                                const skipped = chosen === undefined
                                return (
                                  <div key={qi} style={{
                                    padding: '.6rem .75rem', borderRadius: 10,
                                    background: isRight ? 'rgba(16,185,129,.06)' : skipped ? 'rgba(245,158,11,.05)' : 'rgba(239,68,68,.06)',
                                    border: `1px solid ${isRight ? 'rgba(16,185,129,.2)' : skipped ? 'rgba(245,158,11,.18)' : 'rgba(239,68,68,.2)'}`,
                                  }}>
                                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text)', lineHeight: 1.45 }}>
                                      <span style={{ fontWeight: 800 }}>Q{qi + 1}.</span>{' '}
                                      {q.text.length > 110 ? q.text.slice(0, 110) + '…' : q.text}
                                    </p>
                                    <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                                      {q.options.map((opt, oi) => {
                                        const isCorrectOpt = oi === correct
                                        const isChosenWrong = oi === chosen && !isCorrectOpt
                                        return (
                                          <span key={oi} style={{
                                            padding: '.18rem .5rem', borderRadius: 6, fontSize: '.69rem',
                                            fontWeight: isCorrectOpt || isChosenWrong ? 700 : 400,
                                            display: 'inline-flex', alignItems: 'center', gap: '.2rem',
                                            background: isCorrectOpt ? 'rgba(16,185,129,.15)' : isChosenWrong ? 'rgba(239,68,68,.13)' : 'var(--bg3)',
                                            border: isCorrectOpt ? '1.5px solid rgba(16,185,129,.45)' : isChosenWrong ? '1.5px solid rgba(239,68,68,.4)' : '1px solid var(--border)',
                                            color: isCorrectOpt ? '#10B981' : isChosenWrong ? '#EF4444' : 'var(--text3)',
                                          }}>
                                            <span style={{ fontWeight: 800, opacity: .65 }}>{String.fromCharCode(65 + oi)}.</span>
                                            {opt.length > 30 ? opt.slice(0, 30) + '…' : opt}
                                            {isCorrectOpt && <span>✓</span>}
                                            {isChosenWrong && <span>✗</span>}
                                          </span>
                                        )
                                      })}
                                      {skipped && (
                                        <span style={{ padding: '.18rem .5rem', borderRadius: 6, fontSize: '.69rem', fontWeight: 600, background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)', color: '#D97706' }}>
                                          — Skipped
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6">
            <h3 style={{ color: 'var(--text)' }} className="font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-500" />
              Configure Paper
            </h3>
            <form onSubmit={handleGenerate} className="space-y-4">

              {/* Paper Type */}
              <div>
                <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-2 block">Paper Type</label>
                <div className="space-y-1.5">
                  {PAPER_TYPES.map(pt => {
                    const active = formData.paperType === pt.id
                    return (
                      <button
                        key={pt.id} type="button"
                        onClick={() => setFormData(f => ({ ...f, paperType: pt.id }))}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all"
                        style={{
                          borderColor: active ? 'rgba(59,130,246,0.4)' : 'var(--border)',
                          background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                        }}
                      >
                        <pt.icon className="w-4 h-4 shrink-0" style={{ color: active ? '#3B82F6' : 'var(--text3)' }} />
                        <div>
                          <div className="text-xs font-bold" style={{ color: active ? '#3B82F6' : 'var(--text)' }}>{pt.label}</div>
                          <div className="text-[10px]" style={{ color: 'var(--text3)' }}>{pt.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Board</label>
                <select style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none border"
                  value={formData.board} onChange={e => setFormData(f => ({ ...f, board: e.target.value }))}>
                  {boards.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Class</label>
                  <select style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none border"
                    value={formData.class} onChange={e => setFormData(f => { const opts = subjectsFor(e.target.value, f.stream); return { ...f, class: e.target.value, subject: opts.includes(f.subject) ? f.subject : opts[0] } })}>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {hasStream(formData.class) && (
                  <div>
                    <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Stream</label>
                    <select style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none border"
                      value={formData.stream} onChange={e => setFormData(f => { const opts = subjectsFor(f.class, e.target.value); return { ...f, stream: e.target.value, subject: opts.includes(f.subject) ? f.subject : opts[0] } })}>
                      {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Subject</label>
                  <select style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none border"
                    value={formData.subject} onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}>
                    {subjectsFor(formData.class, formData.stream).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy','Mixed','Hard'].map(d => (
                    <button key={d} type="button"
                      onClick={() => setFormData(f => ({ ...f, difficulty: d }))}
                      className="py-2 rounded-xl text-xs font-bold transition-all border"
                      style={{
                        borderColor: formData.difficulty === d ? 'rgba(59,130,246,0.3)' : 'var(--border)',
                        background:  formData.difficulty === d ? 'rgba(59,130,246,0.1)' : 'transparent',
                        color:       formData.difficulty === d ? '#3B82F6' : 'var(--text3)',
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom question count + time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">No. of Questions</label>
                  <input
                    type="number" min="5" max="60"
                    placeholder="Auto (blueprint)"
                    value={formData.numQuestions}
                    onChange={e => setFormData(f => ({ ...f, numQuestions: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)', borderWidth: 1, borderStyle: 'solid', borderRadius: 12, padding: '.55rem .75rem', fontSize: '.85rem', fontFamily: "'DM Sans',sans-serif", outline: 'none' }}
                  />
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>Generates all-MCQ when set</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold mb-1.5 block">Time (minutes)</label>
                  <input
                    type="number" min="5" max="180"
                    placeholder="Auto (blueprint)"
                    value={formData.timeMinutes}
                    onChange={e => setFormData(f => ({ ...f, timeMinutes: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)', borderWidth: 1, borderStyle: 'solid', borderRadius: 12, padding: '.55rem .75rem', fontSize: '.85rem', fontFamily: "'DM Sans',sans-serif", outline: 'none' }}
                  />
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>Shown to students on test</p>
                </div>
              </div>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} /> {error}
                </div>
              )}

              <button type="submit" disabled={generating}
                className="w-full btn-p py-3! flex items-center justify-center gap-2 mt-4">
                {generating
                  ? <><Clock className="w-4 h-4 animate-spin" /> Generating with AI…</>
                  : <><Sparkles className="w-4 h-4" /> Generate Paper</>}
              </button>
            </form>
          </div>

          {/* Assign to Class panel (shows after paper is ready) */}
          {paper && teacherClasses.length > 0 && (
            <div className="card p-5 space-y-3" style={{ borderColor: assignSuccess ? 'rgba(16,185,129,0.3)' : 'var(--border)' }}>
              <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Send className="w-4 h-4 text-emerald-500" /> Assign to Class
              </h4>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>Select classes to receive this paper</p>
              <div className="flex flex-wrap gap-2">
                {teacherClasses.map(cls => (
                  <button key={cls} type="button"
                    onClick={() => toggleClass(cls)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                    style={{
                      borderColor: assignedClasses.includes(cls) ? '#10B981' : 'var(--border)',
                      background:  assignedClasses.includes(cls) ? 'rgba(16,185,129,0.1)' : 'var(--bg3)',
                      color:       assignedClasses.includes(cls) ? '#10B981' : 'var(--text2)',
                    }}>
                    {assignedClasses.includes(cls) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    Class {cls}
                  </button>
                ))}
              </div>
              {assignSuccess ? (
                <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#10B981' }}>
                  <CheckCircle className="w-4 h-4" /> Assigned to {assignedClasses.join(', ')}
                </div>
              ) : (
                <button type="button" onClick={handleAssign}
                  disabled={!assignedClasses.length}
                  className="w-full py-2 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    background: assignedClasses.length ? 'rgba(16,185,129,0.1)' : 'transparent',
                    borderColor: assignedClasses.length ? '#10B981' : 'var(--border)',
                    color: assignedClasses.length ? '#10B981' : 'var(--text3)',
                    cursor: assignedClasses.length ? 'pointer' : 'not-allowed',
                  }}>
                  Assign Paper →
                </button>
              )}
            </div>
          )}

          {paper && teacherClasses.length === 0 && (
            <div className="card p-4" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>
                No classes assigned to you yet. Ask your school admin to assign classes from the School Portal.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Preview ── */}
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
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <h3 style={{ color: 'var(--text)' }} className="font-bold text-lg mb-2">QuesGen AI is creating your paper…</h3>
              <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>This may take up to 60 seconds. Please wait.</p>
            </div>
          ) : paper ? (
            <div className="card p-0 overflow-hidden animate-slide-up">
              {/* Toolbar */}
              <div className="p-4 border-b flex items-center justify-between gap-2 flex-wrap"
                style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text)' }} className="text-sm font-bold">AI Generated Paper</h4>
                    <p style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold">
                      {formData.subject} · {formData.board} · {formData.class} · {typeIcon(formData.paperType)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {saved ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      <CheckCircle className="w-3 h-3" /> Saved
                    </span>
                  ) : (
                    <button onClick={handleSavePaper} className="btn-g py-2! px-3! text-xs flex items-center gap-1">
                      <Save className="w-3 h-3" /> Save Paper
                    </button>
                  )}
                  <button onClick={handleReset} className="btn-g py-2! px-3! text-xs flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> New
                  </button>
                  <button onClick={handleDownload} className="btn-g py-2! px-3! text-xs flex items-center gap-1">
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button onClick={handlePrint} className="btn-p py-2! px-3! text-xs flex items-center gap-1">
                    <Printer className="w-3 h-3" /> Print
                  </button>
                </div>
              </div>

              {/* Paper Content with inline editing */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 640, background: 'var(--bg2)', color: 'var(--text)' }}>
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Header */}
                  <div className="text-center border-b pb-6" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold uppercase tracking-widest">{formData.board} — {formData.class}</h2>
                    <h3 className="text-lg font-medium">{formData.subject} — {typeIcon(formData.paperType)}</h3>
                    <div className="flex justify-between text-xs mt-4 font-bold" style={{ color: 'var(--text3)' }}>
                      <span>TIME: {Math.floor(paper.metadata.timeMinutes / 60)} HRS</span>
                      <span>MAX MARKS: {paper.metadata.totalMarks}</span>
                    </div>
                  </div>

                  {/* Edit hint */}
                  <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                    style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', color: '#A78BFA' }}>
                    <Pencil className="w-3 h-3 shrink-0" />
                    Click the pencil icon next to any question to edit it manually.
                  </div>

                  {/* Sections */}
                  {paper.sections.map((sec, sIdx) => (
                    <div key={sec.id} className="space-y-4">
                      <p className="font-bold text-blue-500 uppercase text-sm">{sec.name}</p>
                      <div className="space-y-4 pl-2">
                        {sec.questions.map((q, qIdx) => {
                          const isEditing = editingQ?.sIdx === sIdx && editingQ?.qIdx === qIdx
                          const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])
                          return (
                            <div key={q.id || qIdx} className="rounded-xl p-3 border transition-all"
                              style={{ background: isEditing ? 'rgba(139,92,246,0.04)' : 'transparent', borderColor: isEditing ? 'rgba(139,92,246,0.3)' : 'transparent' }}>
                              <div className="flex gap-3 text-sm">
                                <span className="font-bold shrink-0">Q{qIdx + 1}.</span>
                                <div className="flex-1">
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={editText}
                                        onChange={e => setEditText(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none border"
                                        style={{ background: 'var(--bg3)', borderColor: 'rgba(139,92,246,0.4)', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}
                                      />
                                      {editOpts.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2">
                                          {editOpts.map((opt, oi) => (
                                            <div key={oi} className="flex items-center gap-2">
                                              <span className="text-xs font-bold shrink-0" style={{ color: 'var(--text3)' }}>({String.fromCharCode(97 + oi)})</span>
                                              <input
                                                value={typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}
                                                onChange={e => {
                                                  const next = [...editOpts]
                                                  next[oi] = e.target.value
                                                  setEditOpts(next)
                                                }}
                                                className="flex-1 rounded-lg px-2 py-1 text-xs focus:outline-none border"
                                                style={{ background: 'var(--bg3)', borderColor: 'rgba(139,92,246,0.3)', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      <div className="flex gap-2">
                                        <button onClick={commitEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                                          <Save className="w-3 h-3" /> Save
                                        </button>
                                        <button onClick={cancelEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                          style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                                          <X className="w-3 h-3" /> Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-start gap-2">
                                        <p className="mb-2">{q.text}</p>
                                        <div className="flex items-center gap-1 shrink-0">
                                          <span className="font-bold text-xs" style={{ color: 'var(--text3)' }}>[{sec.marksPerQuestion}]</span>
                                          <button onClick={() => startEdit(sIdx, qIdx, q)}
                                            className="p-1 rounded-md hover:bg-purple-500/10 transition-colors"
                                            style={{ color: 'rgba(139,92,246,0.6)' }}
                                            title="Edit question">
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                      {opts.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 ml-2 text-xs" style={{ color: 'var(--text2)' }}>
                                          {opts.map((opt, oi) => (
                                            <div key={oi}>({String.fromCharCode(97 + oi)}) {typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}</div>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
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
