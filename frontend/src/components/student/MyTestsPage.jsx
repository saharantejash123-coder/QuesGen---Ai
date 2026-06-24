import { useState, useEffect } from 'react'
import {
  FileText, Play, CheckCircle, ChevronDown, ChevronUp,
  BookOpen, Clock, Award, Eye, AlertCircle,
} from 'lucide-react'
import {
  getPapersForStudent, getSubmissionByStudent, countMCQQuestions,
} from '../../services/schoolService'
import TakeTest from './TakeTest'

const TYPE_LABEL = { quick_quiz: 'Quick Quiz', unit_test: 'Unit Test', full_exam: 'Full Exam' }
const TYPE_COLOR = { quick_quiz: '#7C3AED', unit_test: '#2354F4', full_exam: '#059669' }

function PaperViewer({ paper }) {
  return (
    <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {(paper.sections || []).map((sec, si) => (
        <div key={si}>
          <p style={{ fontWeight: 700, fontSize: '.78rem', letterSpacing: '.5px', textTransform: 'uppercase', color: '#7C3AED', marginBottom: '.6rem' }}>
            {sec.name || sec.title || `Section ${si + 1}`}
            {sec.marksPerQuestion ? ` · ${sec.marksPerQuestion} mark${sec.marksPerQuestion !== 1 ? 's' : ''} each` : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            {(sec.questions || []).map((q, qi) => {
              const opts = Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])
              const isMCQ = opts.length >= 2
              return (
                <div key={qi} style={{ padding: '.75rem .9rem', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '.86rem', color: 'var(--text)', lineHeight: 1.55, marginBottom: isMCQ ? '.5rem' : 0 }}>
                    <span style={{ fontWeight: 700 }}>Q{qi + 1}. </span>
                    {q.text || q.q || q.question || ''}
                  </p>
                  {isMCQ && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.25rem .75rem' }}>
                      {opts.map((opt, oi) => (
                        <p key={oi} style={{ fontSize: '.78rem', color: 'var(--text3)' }}>
                          ({String.fromCharCode(65 + oi)}) {typeof opt === 'string' ? opt.replace(/^\s*[\(\[]?[a-dA-D][\)\].]\s*/i, '') : opt}
                        </p>
                      ))}
                    </div>
                  )}
                  {!isMCQ && (
                    <p style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '.25rem', fontStyle: 'italic' }}>
                      [{sec.type || 'Written answer'} — not attempted online]
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function PaperCard({ paper, user, onRefresh }) {
  const [viewOpen, setViewOpen] = useState(false)
  const [testModal, setTestModal] = useState(false)
  const [sub, setSub] = useState(() => getSubmissionByStudent(paper.id, user?.email || ''))

  const mcqCount = countMCQQuestions(paper)
  const totalQ = (paper.sections || []).reduce((s, sec) => s + (sec.questions?.length || 0), 0)
  const typeColor = TYPE_COLOR[paper.paperType] || '#2354F4'
  const typeLabel = TYPE_LABEL[paper.paperType] || 'Paper'

  const pct = sub?.percentage ?? null
  const barColor = pct === null ? typeColor : pct >= 75 ? '#10B981' : pct >= 45 ? '#F59E0B' : '#EF4444'

  const handleClose = () => {
    setTestModal(false)
    const fresh = getSubmissionByStudent(paper.id, user?.email || '')
    setSub(fresh)
    onRefresh?.()
  }

  return (
    <>
      <div style={{ borderRadius: 16, background: 'var(--card-bg, var(--bg2))', border: `1px solid ${sub ? 'rgba(16,185,129,.25)' : 'var(--border)'}`, overflow: 'hidden', transition: 'box-shadow .2s' }}>

        {/* Card header */}
        <div style={{ padding: '1rem 1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.3rem' }}>
                <span style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>
                  {paper.subject || 'Paper'}
                </span>
                <span style={{ padding: '.15rem .55rem', borderRadius: 20, fontSize: '.65rem', fontWeight: 800, letterSpacing: '.4px', textTransform: 'uppercase', background: `${typeColor}14`, color: typeColor, border: `1px solid ${typeColor}25` }}>
                  {typeLabel}
                </span>
                {mcqCount > 0 && (
                  <span style={{ padding: '.15rem .55rem', borderRadius: 20, fontSize: '.65rem', fontWeight: 700, background: 'rgba(124,58,237,.1)', color: '#7C3AED', border: '1px solid rgba(124,58,237,.2)' }}>
                    {mcqCount} MCQ{mcqCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.74rem', color: 'var(--text3)', fontWeight: 600 }}>
                  📋 {paper.board || 'CBSE'} · {totalQ} questions · {paper.totalMarks || totalQ} marks
                </span>
                {paper.timeMinutes && (
                  <span style={{ fontSize: '.74rem', color: 'var(--text3)', fontWeight: 600 }}>
                    <Clock style={{ width: 11, height: 11, display: 'inline', marginRight: 2 }} />
                    {Math.floor(paper.timeMinutes / 60)}h {paper.timeMinutes % 60 > 0 ? `${paper.timeMinutes % 60}m` : ''}
                  </span>
                )}
                <span style={{ fontSize: '.74rem', color: 'var(--text3)', fontWeight: 600 }}>
                  📅 {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString('en-IN') : '—'}
                </span>
              </div>
            </div>

            {/* Score badge */}
            {sub && (
              <div style={{ textAlign: 'center', background: `${barColor}10`, border: `1px solid ${barColor}30`, borderRadius: 12, padding: '.5rem .75rem', flexShrink: 0 }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: barColor, lineHeight: 1 }}>{sub.score}/{sub.total}</p>
                <p style={{ fontSize: '.65rem', color: barColor, fontWeight: 700 }}>{pct}%</p>
              </div>
            )}
          </div>

          {/* Score bar */}
          {sub && (
            <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', marginBottom: '.75rem' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 1s' }} />
            </div>
          )}

          {/* AI feedback preview */}
          {sub?.aiFeedback && (
            <div style={{ padding: '.5rem .7rem', borderRadius: 10, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)', marginBottom: '.75rem' }}>
              <p style={{ fontSize: '.7rem', fontWeight: 800, color: '#7C3AED', marginBottom: '.15rem' }}>✨ AI Feedback</p>
              <p style={{ fontSize: '.78rem', color: 'var(--text3)', lineHeight: 1.55 }}>{sub.aiFeedback}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {mcqCount > 0 && (
              <button
                onClick={() => setTestModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.4rem',
                  padding: '.55rem 1.1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '.83rem', fontFamily: "'DM Sans',sans-serif",
                  background: sub ? 'rgba(16,185,129,.12)' : 'linear-gradient(135deg,#7C3AED,#A78BFA)',
                  color: sub ? '#10B981' : '#fff',
                  border: sub ? '1px solid rgba(16,185,129,.3)' : 'none',
                }}
              >
                {sub
                  ? <><Award style={{ width: 14, height: 14 }} /> View Score &amp; Feedback</>
                  : <><Play style={{ width: 14, height: 14 }} /> Attend MCQ Test</>
                }
              </button>
            )}
            {mcqCount === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem .8rem', borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', fontSize: '.78rem', color: '#D97706', fontWeight: 600 }}>
                <AlertCircle style={{ width: 13, height: 13 }} />
                No MCQ questions in this paper
              </div>
            )}
            <button
              onClick={() => setViewOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.4rem',
                padding: '.55rem .9rem', borderRadius: 10, cursor: 'pointer',
                background: 'var(--bg3)', border: '1px solid var(--border)',
                color: 'var(--text2)', fontWeight: 600, fontSize: '.83rem', fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {viewOpen
                ? <><ChevronUp style={{ width: 14, height: 14 }} /> Hide Paper</>
                : <><Eye style={{ width: 14, height: 14 }} /> View Paper</>
              }
            </button>
          </div>
        </div>

        {/* Collapsible paper viewer */}
        {viewOpen && <PaperViewer paper={paper} />}
      </div>

      {testModal && (
        <TakeTest
          paper={paper}
          user={user}
          existingSubmission={sub}
          onClose={handleClose}
          onSubmitted={() => {
            const fresh = getSubmissionByStudent(paper.id, user?.email || '')
            setSub(fresh)
            onRefresh?.()
          }}
        />
      )}
    </>
  )
}

export default function MyTestsPage({ user }) {
  const [papers, setPapers] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')

  const load = () => {
    if (!user?.email) return
    setPapers(getPapersForStudent(user.className || '', user.schoolName || ''))
  }

  useEffect(load, [user])

  const submittedIds = new Set(
    papers.filter(p => !!getSubmissionByStudent(p.id, user?.email || '')).map(p => p.id)
  )

  const filtered = papers.filter(p => {
    if (filterStatus === 'pending') return !submittedIds.has(p.id)
    if (filterStatus === 'done') return submittedIds.has(p.id)
    return true
  })

  if (!user) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.25rem' }}>
          <FileText style={{ width: 22, height: 22, color: '#7C3AED' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>My Papers &amp; Tests</h1>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: '.85rem' }}>
          Papers assigned by your teacher · MCQ sections can be attempted online
        </p>
      </div>

      {/* Filter pills */}
      {papers.length > 0 && (
        <div style={{ display: 'flex', gap: '.4rem' }}>
          {[
            { id: 'all', label: `All (${papers.length})` },
            { id: 'pending', label: `Pending (${papers.length - submittedIds.size})` },
            { id: 'done', label: `Submitted (${submittedIds.size})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterStatus(f.id)}
              style={{
                padding: '.35rem .85rem', borderRadius: 20, cursor: 'pointer',
                border: `1px solid ${filterStatus === f.id ? '#7C3AED' : 'var(--border)'}`,
                background: filterStatus === f.id ? 'rgba(124,58,237,.1)' : 'var(--bg3)',
                color: filterStatus === f.id ? '#7C3AED' : 'var(--text3)',
                fontSize: '.76rem', fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Papers list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text3)' }}>
          <BookOpen style={{ width: 40, height: 40, opacity: .2, margin: '0 auto .75rem' }} />
          <p style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '.25rem' }}>
            {papers.length === 0 ? 'No papers assigned yet' : 'No papers in this category'}
          </p>
          <p style={{ fontSize: '.8rem' }}>
            {papers.length === 0
              ? 'Your teacher will assign papers here. Check back later.'
              : 'Try switching the filter above.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
          {filtered.map(p => (
            <PaperCard key={p.id} paper={p} user={user} onRefresh={load} />
          ))}
        </div>
      )}
    </div>
  )
}
