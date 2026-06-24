import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Send, Trophy, Sparkles, Loader, Timer } from 'lucide-react'
import { submitTestAnswers, updateSubmissionFeedback } from '../../services/schoolService'
import { analyzeTestResultWithLLM } from '../../services/llmService'

function flattenQuestions(paper) {
  const questions = []
  ;(paper.sections || []).forEach((sec, sIdx) => {
    (sec.questions || []).forEach((q, qIdx) => {
      const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])
      // Only include questions that have at least 2 options (MCQ)
      if (opts.length < 2) return
      questions.push({
        sIdx, qIdx,
        text: q.text || q.q || q.question || '',
        options: opts.map(o => (typeof o === 'string' ? o.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : String(o))),
        answer: q.answer ?? null,
        marks: sec.marksPerQuestion || sec.marksPerQ || q.marks || 1,
        sectionName: sec.name || sec.title || `Section ${sIdx + 1}`,
      })
    })
  })
  return questions
}

function ScoreScreen({ paper, questions, answers, aiFeedback, aiLoading, onClose }) {
  let score = 0, total = 0
  questions.forEach((q, i) => {
    total += q.marks
    if (answers[i] !== undefined && answers[i] === q.answer) score += q.marks
  })
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const grade = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'D'
  const gradeColor = pct >= 75 ? '#10B981' : pct >= 45 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}>
      {/* Score hero */}
      <div style={{ width: 76, height: 76, borderRadius: '50%', background: `${gradeColor}18`, border: `3px solid ${gradeColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Trophy style={{ width: 32, height: 32, color: gradeColor }} />
      </div>
      <div>
        <p style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Instrument Serif',serif", lineHeight: 1 }}>{score}/{total}</p>
        <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>{pct}% · Grade {grade}</p>
      </div>

      {/* AI Feedback */}
      <div style={{ width: '100%', maxWidth: 460, padding: '1rem 1.1rem', borderRadius: 14, background: 'linear-gradient(135deg,rgba(124,58,237,.07),rgba(59,130,246,.05))', border: '1px solid rgba(124,58,237,.2)', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.5rem' }}>
          <Sparkles style={{ width: 14, height: 14, color: '#7C3AED' }} />
          <span style={{ fontSize: '.7rem', fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: '#7C3AED' }}>AI Feedback</span>
        </div>
        {aiLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--text3)', fontSize: '.82rem' }}>
            <Loader style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
            Analysing your performance…
          </div>
        ) : aiFeedback ? (
          <p style={{ color: 'var(--text2)', fontSize: '.85rem', lineHeight: 1.6 }}>{aiFeedback}</p>
        ) : (
          <p style={{ color: 'var(--text3)', fontSize: '.82rem' }}>Result recorded successfully. Keep practising!</p>
        )}
      </div>

      {/* Stats row */}
      <div style={{ width: '100%', maxWidth: 460, display: 'flex', gap: '.5rem' }}>
        {[
          { label: 'Correct', value: questions.filter((q, i) => answers[i] === q.answer).length, color: '#10B981' },
          { label: 'Wrong', value: questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.answer).length, color: '#EF4444' },
          { label: 'Skipped', value: questions.filter((_, i) => answers[i] === undefined).length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: '.7rem', borderRadius: 12, background: `${s.color}09`, border: `1px solid ${s.color}25`, textAlign: 'center' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '.7rem', color: 'var(--text3)', fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Answer review */}
      <div style={{ width: '100%', maxWidth: 500 }}>
        <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '.6rem', textAlign: 'left', fontSize: '.88rem' }}>Answer Review</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', maxHeight: 240, overflowY: 'auto' }}>
          {questions.map((q, i) => {
            const chosen = answers[i]
            const correct = q.answer
            const isRight = chosen === correct
            const skipped = chosen === undefined
            const borderColor = isRight ? 'rgba(16,185,129,.2)' : skipped ? 'rgba(245,158,11,.18)' : 'rgba(239,68,68,.2)'
            const bg = isRight ? 'rgba(16,185,129,.05)' : skipped ? 'rgba(245,158,11,.05)' : 'rgba(239,68,68,.05)'
            return (
              <div key={i} style={{ padding: '.6rem .85rem', borderRadius: 10, background: bg, border: `1px solid ${borderColor}`, textAlign: 'left' }}>
                <p style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '.25rem' }}>Q{i + 1}. {q.text.length > 75 ? q.text.slice(0, 75) + '…' : q.text}</p>
                <div style={{ display: 'flex', gap: '.4rem', fontSize: '.72rem', flexWrap: 'wrap' }}>
                  {!skipped ? (
                    <span style={{ padding: '.12rem .45rem', borderRadius: 5, background: isRight ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: isRight ? '#10B981' : '#EF4444' }}>
                      Your: ({String.fromCharCode(65 + chosen)}) {q.options[chosen]}
                    </span>
                  ) : (
                    <span style={{ padding: '.12rem .45rem', borderRadius: 5, background: 'rgba(245,158,11,.12)', color: '#F59E0B' }}>Skipped</span>
                  )}
                  {!isRight && correct !== null && correct !== undefined && (
                    <span style={{ padding: '.12rem .45rem', borderRadius: 5, background: 'rgba(16,185,129,.1)', color: '#10B981' }}>
                      Correct: ({String.fromCharCode(65 + correct)}) {q.options[correct]}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={onClose} style={{ padding: '.65rem 2rem', borderRadius: 12, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', color: '#fff', fontWeight: 700, fontSize: '.9rem', border: 'none', cursor: 'pointer' }}>
        Done
      </button>
    </div>
  )
}

export default function TakeTest({ paper, user, existingSubmission, onClose, onSubmitted }) {
  const questions = flattenQuestions(paper)
  const [answers, setAnswers] = useState(() => existingSubmission?.answers ?? {})
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(!!existingSubmission)
  const [confirming, setConfirming] = useState(false)
  const [aiFeedback, setAiFeedback] = useState(existingSubmission?.aiFeedback ?? null)
  const [aiLoading, setAiLoading] = useState(false)

  // Countdown timer
  const totalSeconds = paper.timeMinutes ? paper.timeMinutes * 60 : 0
  const [secsLeft, setSecsLeft] = useState(totalSeconds)
  const timerRef = useRef(null)
  const autoSubmitRef = useRef(null)

  useEffect(() => {
    if (!totalSeconds || submitted || existingSubmission) return
    timerRef.current = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          // auto-submit when time is up
          autoSubmitRef.current?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [totalSeconds, submitted])

  const timerColor = secsLeft > 60 ? '#10B981' : secsLeft > 0 ? '#EF4444' : '#EF4444'
  const timerText = totalSeconds
    ? `${Math.floor(secsLeft / 60)}:${String(secsLeft % 60).padStart(2, '0')}`
    : null

  const q = questions[current]
  const totalQ = questions.length

  const handleSelect = (optIdx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [current]: optIdx }))
  }

  const handleSubmit = async () => {
    let score = 0, total = 0
    const wrongQTexts = []
    questions.forEach((q, i) => {
      total += q.marks
      if (answers[i] !== undefined && answers[i] === q.answer) {
        score += q.marks
      } else if (answers[i] !== undefined) {
        wrongQTexts.push(q.text.slice(0, 60))
      }
    })
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Student'

    submitTestAnswers({
      paperId: paper.id,
      studentEmail: user?.email || '',
      studentName: fullName,
      schoolName: user?.schoolName || '',
      answers,
      score,
      total,
      percentage: pct,
    })
    setSubmitted(true)
    setConfirming(false)
    onSubmitted?.()

    // AI analysis (non-blocking)
    setAiLoading(true)
    try {
      const feedback = await analyzeTestResultWithLLM({
        subject: paper.subject || 'this subject',
        paperType: paper.paperType,
        score, total, percentage: pct,
        wrongQuestions: wrongQTexts,
      })
      if (feedback) {
        setAiFeedback(feedback)
        updateSubmissionFeedback(paper.id, user?.email || '', feedback)
      }
    } catch {}
    setAiLoading(false)
  }

  // Keep ref current so timer closure always calls the latest submit
  autoSubmitRef.current = handleSubmit

  const answered = Object.keys(answers).length
  const unanswered = totalQ - answered

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div style={{ background: 'var(--bg)', borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', position: 'relative' }}>

        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.95rem' }}>
              {paper.subject} — {paper.paperType === 'quick_quiz' ? 'Quick Quiz' : paper.paperType === 'unit_test' ? 'Unit Test' : 'Full Exam'}
            </p>
            <p style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{totalQ} questions · {paper.totalMarks || totalQ} marks</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            {/* Countdown timer */}
            {timerText && !submitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.3rem .7rem', borderRadius: 20, background: `${timerColor}12`, border: `1px solid ${timerColor}30` }}>
                <Timer style={{ width: 13, height: 13, color: timerColor }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '.85rem', color: timerColor, minWidth: '3.2ch' }}>
                  {timerText}
                </span>
              </div>
            )}
            <button onClick={onClose} style={{ padding: '.4rem', borderRadius: 8, background: 'var(--bg3)', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {submitted ? (
            <ScoreScreen
              paper={paper}
              questions={questions}
              answers={answers}
              aiFeedback={aiFeedback}
              aiLoading={aiLoading}
              onClose={onClose}
            />
          ) : (
            <div style={{ padding: '1.5rem' }}>
              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                <span style={{ fontSize: '.78rem', color: 'var(--text3)' }}>Question {current + 1} of {totalQ}</span>
                <span style={{ fontSize: '.78rem', color: answered === totalQ ? '#10B981' : 'var(--text3)' }}>{answered}/{totalQ} answered</span>
              </div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 4, marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div style={{ width: `${((current + 1) / totalQ) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#A78BFA)', borderRadius: 4, transition: 'width .3s' }} />
              </div>

              <p style={{ fontSize: '.72rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '.5rem' }}>{q.sectionName} · {q.marks} mark{q.marks !== 1 ? 's' : ''}</p>
              <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>{q.text}</p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.5rem' }}>
                {q.options.map((opt, oi) => {
                  const selected = answers[current] === oi
                  return (
                    <button key={oi} onClick={() => handleSelect(oi)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.75rem',
                        padding: '.85rem 1rem', borderRadius: 12,
                        border: `2px solid ${selected ? '#7C3AED' : 'var(--border)'}`,
                        background: selected ? 'rgba(124,58,237,.09)' : 'var(--bg2)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '.78rem', fontWeight: 800,
                        background: selected ? '#7C3AED' : 'var(--bg3)',
                        color: selected ? '#fff' : 'var(--text3)',
                        border: `1.5px solid ${selected ? '#7C3AED' : 'var(--border)'}`,
                      }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span style={{ color: 'var(--text)', fontSize: '.9rem' }}>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
                <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.6rem .9rem', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: current === 0 ? 'var(--text3)' : 'var(--text)', cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: '.83rem', fontWeight: 600, opacity: current === 0 ? .4 : 1 }}>
                  <ChevronLeft style={{ width: 15, height: 15 }} /> Prev
                </button>

                <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {questions.slice(0, Math.min(totalQ, 10)).map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: `1.5px solid ${i === current ? '#7C3AED' : answers[i] !== undefined ? '#10B981' : 'var(--border)'}`,
                      background: i === current ? '#7C3AED' : answers[i] !== undefined ? 'rgba(16,185,129,.12)' : 'var(--bg3)',
                      color: i === current ? '#fff' : answers[i] !== undefined ? '#10B981' : 'var(--text3)',
                      cursor: 'pointer', fontSize: '.68rem', fontWeight: 700,
                    }}>{i + 1}</button>
                  ))}
                  {totalQ > 10 && <span style={{ fontSize: '.7rem', color: 'var(--text3)', alignSelf: 'center' }}>+{totalQ - 10}</span>}
                </div>

                {current < totalQ - 1 ? (
                  <button onClick={() => setCurrent(c => Math.min(totalQ - 1, c + 1))}
                    style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.6rem .9rem', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '.83rem', fontWeight: 600 }}>
                    Next <ChevronRight style={{ width: 15, height: 15 }} />
                  </button>
                ) : (
                  <button onClick={() => setConfirming(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.6rem 1.1rem', borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '.83rem', fontWeight: 700 }}>
                    <Send style={{ width: 14, height: 14 }} /> Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Confirm overlay */}
        {confirming && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <div style={{ background: 'var(--bg)', borderRadius: 16, padding: '1.75rem', maxWidth: 320, margin: '1rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,.25)' }}>
              {unanswered > 0
                ? <AlertCircle style={{ width: 36, height: 36, color: '#F59E0B', margin: '0 auto .75rem' }} />
                : <CheckCircle style={{ width: 36, height: 36, color: '#10B981', margin: '0 auto .75rem' }} />
              }
              <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '.35rem' }}>Submit Test?</p>
              {unanswered > 0 && (
                <p style={{ color: '#F59E0B', fontSize: '.8rem', marginBottom: '.6rem' }}>{unanswered} question{unanswered !== 1 ? 's' : ''} unanswered — will score 0.</p>
              )}
              <p style={{ color: 'var(--text3)', fontSize: '.8rem', marginBottom: '1.1rem' }}>Cannot change answers after submitting.</p>
              <div style={{ display: 'flex', gap: '.65rem' }}>
                <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: '.6rem', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                <button onClick={handleSubmit} style={{ flex: 1, padding: '.6rem', borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
