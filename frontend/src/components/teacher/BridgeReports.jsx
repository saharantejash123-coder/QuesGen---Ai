import { useState, useEffect, useCallback, useRef } from 'react'
import { Send, CheckCircle, Clock, MessageSquare, Phone, Bell, Search, Filter, ShieldCheck, Users, AlertCircle, FileText, TrendingUp, TrendingDown, Minus, FlaskConical } from 'lucide-react'
import { getTeacherClassAssignment, getStudentsBySchool, getPapersByClass } from '../../services/schoolService'
import { getBridgeReports, generateManualReport, sendReports } from '../../services/pipelineService'
import { sendTestNotification } from '../../services/notificationService'
import { toast } from '../Toast'

const SETTINGS_KEY = email => `questra_bridge_settings_${(email || '').toLowerCase()}`

export default function BridgeReports({ user }) {
  const teacherEmail = user?.email || ''
  const schoolName   = user?.schoolName || ''

  // Settings restore synchronously from localStorage on first render
  const loadSettings = () => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY(teacherEmail))) || {} }
    catch { return {} }
  }
  const [automated, setAutomated] = useState(() => loadSettings().automated ?? true)
  const [channels, setChannels]   = useState(() => loadSettings().channels ?? { whatsapp: true, sms: false, email: true })
  const [search, setSearch]       = useState('')
  const [selectedClass, setClass] = useState('All')

  // Roster data reads synchronously from the localStorage data layer; the
  // dashboard remounts per login, so lazy initializers replace a load effect.
  const [classes] = useState(() =>
    teacherEmail ? (getTeacherClassAssignment(teacherEmail)?.classNames || []) : [])
  const [students] = useState(() =>
    classes.flatMap(cls => {
      const ss = getStudentsBySchool(schoolName, cls)
      return ss.map(s => ({
        ...s,
        className: cls,
        displayName: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email?.split('@')[0] || 'Student',
        initials: (`${s.firstName || ''} ${s.lastName || ''}`).trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??',
        papersAssigned: getPapersByClass(cls, schoolName).filter(p => p.status === 'assigned').length,
      }))
    }))
  const [papers] = useState(() => classes.flatMap(cls => getPapersByClass(cls, schoolName)))
  const [reports, setReports] = useState(() =>
    getBridgeReports({ schoolName, classNames: classes.length ? classes : null }))

  const [sending, setSending] = useState(false)
  const [testing, setTesting] = useState(false)
  const autoSendBusy = useRef(false)

  /* Persist automation settings whenever they change */
  useEffect(() => {
    if (!teacherEmail) return
    try { localStorage.setItem(SETTINGS_KEY(teacherEmail), JSON.stringify({ automated, channels })) } catch { /* storage full — non-fatal */ }
  }, [teacherEmail, automated, channels])

  const refreshReports = useCallback((classNames) => {
    setReports(getBridgeReports({ schoolName, classNames: classNames?.length ? classNames : null }))
  }, [schoolName])

  /* ── Zero-touch automation ──
     While automation is ACTIVE, any report the student pipeline queued is
     delivered through the enabled channels automatically. */
  useEffect(() => {
    if (!automated || reports.length === 0 || autoSendBusy.current) return
    const queuedAuto = reports.filter(r => r.status === 'queued' && r.auto)
    if (queuedAuto.length === 0) return
    autoSendBusy.current = true
    ;(async () => {
      try {
        const sent = await sendReports(queuedAuto.map(r => r.id), channels)
        if (sent > 0) {
          refreshReports(classes)
          toast(`Bridge-Reports: ${sent} parent report${sent !== 1 ? 's' : ''} delivered automatically`)
        }
      } finally {
        autoSendBusy.current = false
      }
    })()
  }, [automated, reports, channels, classes, refreshReports])

  /* Manual send: generate a fresh report for every visible student and
     deliver through the active channels. */
  const handleSendNow = async () => {
    if (sending) return
    const targets = displayStudents
    if (targets.length === 0) { toast('No students to report on'); return }
    if (!Object.values(channels).some(Boolean)) { toast('Enable at least one delivery channel'); return }
    setSending(true)
    try {
      const ids = targets.map(s =>
        generateManualReport(s, { schoolName, className: s.className }).id
      )
      const sent = await sendReports(ids, channels)
      refreshReports(classes)
      toast(`${sent} report${sent !== 1 ? 's' : ''} sent to parents`)
    } finally {
      setSending(false)
    }
  }

  /* Mock API trigger: fire a sample notification through the gateway so the
     delivery flow can be tested without a real student submission. */
  const handleTestGateway = async () => {
    if (testing) return
    if (!Object.values(channels).some(Boolean)) { toast('Enable at least one delivery channel'); return }
    setTesting(true)
    try {
      const results = await sendTestNotification(channels)
      const detail = results.map(r => `${r.channel} ✓ ${r.latencyMs}ms`).join(' · ')
      toast(`Test notification delivered — ${detail}`, { duration: 5000 })
    } catch {
      toast('Test delivery failed — check the console')
    } finally {
      setTesting(false)
    }
  }

  const noData = classes.length === 0

  const displayStudents = students.filter(s => {
    const matchClass  = selectedClass === 'All' || s.className === selectedClass
    const matchSearch = !search || s.displayName.toLowerCase().includes(search.toLowerCase()) || s.email?.includes(search.toLowerCase())
    return matchClass && matchSearch
  })

  const reportForStudent = email =>
    reports.find(r => r.studentEmail === (email || '').toLowerCase())

  const TrendIcon = ({ trend }) =>
    trend === 'improving' ? <TrendingUp className="w-3 h-3 text-emerald-500" />
    : trend === 'declining' ? <TrendingDown className="w-3 h-3 text-red-400" />
    : <Minus className="w-3 h-3 text-slate-400" />

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Bridge-Reports</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">
            {noData
              ? 'Automate performance report delivery to parents'
              : `${students.length} students across ${classes.length} class${classes.length !== 1 ? 'es' : ''} · ${papers.filter(p => p.status === 'assigned').length} papers assigned · ${reports.filter(r => r.status === 'sent').length} reports delivered`}
          </p>
        </div>

        <div className="flex items-center gap-3 p-1.5 rounded-2xl border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text3)' }}>Automation</span>
          <button
            onClick={() => setAutomated(!automated)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{
              borderColor: automated ? 'rgba(16,185,129,0.3)' : 'var(--border)',
              color: automated ? '#10B981' : 'var(--text3)',
              background: automated ? 'rgba(16,185,129,0.05)' : 'transparent',
              border: `1px solid ${automated ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
            }}
          >
            {automated ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {automated ? 'ACTIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      {noData ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 mb-4" style={{ color: 'var(--text3)', opacity: 0.35 }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>No Classes Assigned</h3>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text3)' }}>
            Once your school admin assigns classes to you, students will appear here and you can send performance reports to parents.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Delivery Channels
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageSquare, color: 'text-emerald-500' },
                  { id: 'sms',      name: 'Direct SMS',        icon: Phone,         color: 'text-blue-500'    },
                  { id: 'email',    name: 'Cloud Email',       icon: Bell,          color: 'text-purple-500'  },
                ].map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setChannels(prev => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                    style={{
                      background: channels[ch.id] ? 'var(--bg3)' : 'transparent',
                      borderColor: channels[ch.id] ? 'var(--border)' : 'transparent',
                      opacity: channels[ch.id] ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <ch.icon className={`w-4 h-4 ${ch.color}`} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{ch.name}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${channels[ch.id] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${channels[ch.id] ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Mock API trigger — exercises the delivery flow end-to-end */}
              <button
                onClick={handleTestGateway}
                disabled={testing}
                className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all"
                style={{
                  background: 'rgba(124,58,237,0.06)',
                  borderColor: 'rgba(124,58,237,0.3)',
                  color: '#7C3AED',
                  opacity: testing ? 0.6 : 1,
                  cursor: testing ? 'wait' : 'pointer',
                }}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                {testing ? 'Testing gateway…' : 'Send Test Notification'}
              </button>
              <p className="text-[10px] mt-1.5 text-center" style={{ color: 'var(--text3)' }}>
                Mock gateway — simulates WhatsApp/SMS/email delivery
              </p>

              {/* Filter by class */}
              {classes.length > 1 && (
                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p style={{ color: 'var(--text3)' }} className="text-[10px] font-black uppercase mb-3 tracking-widest">Filter by Class</p>
                  <div className="flex flex-col gap-1.5">
                    {['All', ...classes].map(cls => (
                      <button key={cls} onClick={() => setClass(cls)}
                        className="text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                        style={{
                          background: selectedClass === cls ? 'rgba(16,185,129,0.1)' : 'transparent',
                          borderColor: selectedClass === cls ? '#10B981' : 'var(--border)',
                          color: selectedClass === cls ? '#10B981' : 'var(--text3)',
                        }}>
                        {cls === 'All' ? 'All Classes' : `Class ${cls}`}
                        <span className="ml-1 opacity-60">
                          ({cls === 'All' ? students.length : students.filter(s => s.className === cls).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-[10px] font-black uppercase mb-3 tracking-widest">Pipeline Status</p>
                <div className="space-y-2">
                  {[
                    { label: 'Reports generated', value: reports.length },
                    { label: 'Delivered', value: reports.filter(r => r.status === 'sent').length },
                    { label: 'Queued', value: reports.filter(r => r.status === 'queued').length },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: 'var(--text3)' }}>{s.label}</span>
                      <span className="text-xs font-black" style={{ color: 'var(--text)' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text)' }} className="text-xs font-bold mb-2">Bridge Insight</p>
              <p style={{ color: 'var(--text2)' }} className="text-[11px] leading-relaxed">
                Parents are 3.5× more likely to respond to 1-page "Briefs" sent via WhatsApp than via standard email reports.
              </p>
            </div>
          </div>

          {/* Student list + report log */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 border rounded-xl px-4 py-2 w-full sm:max-w-xs"
                  style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text" placeholder="Search students…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ color: 'var(--text)' }}
                    className="bg-transparent border-none outline-none text-xs placeholder-slate-500 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border" style={{ background: 'var(--bg2)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendNow}
                    disabled={sending}
                    className="btn-p py-2! px-4! text-[10px] uppercase font-black tracking-widest"
                    style={{ opacity: sending ? 0.6 : 1 }}
                  >
                    {sending ? 'Sending…' : 'Send Now (Manual)'}
                  </button>
                </div>
              </div>

              {displayStudents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <Users className="w-10 h-10 mb-3" style={{ color: 'var(--text3)', opacity: 0.3 }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text3)' }}>
                    {students.length === 0
                      ? 'No students have registered yet. Share your school name with students so they can sign up.'
                      : 'No students match your search.'}
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                        {['Student', 'Class', 'Email', 'Papers', 'Last Report'].map(h => (
                          <th key={h} style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {displayStudents.map(s => {
                        const rep = reportForStudent(s.email)
                        return (
                          <tr key={s.id || s.email} className="transition-colors hover:bg-slate-500/5">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                                  style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                                  {s.initials}
                                </div>
                                <span style={{ color: 'var(--text)' }} className="text-xs font-bold">{s.displayName}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                                {s.className}
                              </span>
                            </td>
                            <td className="p-4 text-xs" style={{ color: 'var(--text3)' }}>{s.email || '—'}</td>
                            <td className="p-4 text-center">
                              <span className={`text-xs font-black ${s.papersAssigned > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                                {s.papersAssigned}
                              </span>
                            </td>
                            <td className="p-4">
                              {rep ? (
                                <div className="flex items-center gap-2">
                                  {rep.status === 'sent'
                                    ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-500">Sent {new Date(rep.sentAt || rep.generatedAt).toLocaleDateString()}</span></>
                                    : <><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-[10px] font-bold text-amber-400">Queued</span></>}
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold" style={{ color: 'var(--text3)' }}>No report yet</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="p-4 border-t flex items-center justify-between"
                style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-[10px] font-bold">
                  Showing {displayStudents.length} of {students.length} students
                  {selectedClass !== 'All' ? ` in Class ${selectedClass}` : ' across all classes'}
                </p>
              </div>
            </div>

            {/* Report delivery log */}
            <div className="card p-0 overflow-hidden">
              <div className="p-4 border-b flex items-center gap-2" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Recent Reports</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>
                  {reports.length}
                </span>
              </div>
              {reports.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>
                    No reports yet. Reports are generated automatically when students submit tests, or on demand with "Send Now".
                  </p>
                </div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
                  {reports.slice(0, 25).map(r => (
                    <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
                        {r.status === 'sent'
                          ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          : <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                        <div>
                          <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{r.studentName}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                            {r.auto ? 'Auto-pipeline' : 'Manual'} · {new Date(r.generatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>{r.summary}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {r.trend && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                              <TrendIcon trend={r.trend} /> {r.trend}
                            </span>
                          )}
                          {typeof r.percentage === 'number' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                              style={{
                                background: r.percentage >= 75 ? 'rgba(16,185,129,0.1)' : r.percentage >= 45 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                color: r.percentage >= 75 ? '#10B981' : r.percentage >= 45 ? '#F59E0B' : '#EF4444',
                              }}>
                              {r.percentage}%
                            </span>
                          )}
                          {(r.deliveries || (r.channels || []).map(ch => ({ channel: ch }))).map(d => (
                            <span key={d.channel} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                              style={{
                                background: d.status === 'delivered' ? 'rgba(16,185,129,0.08)' : 'var(--bg3)',
                                color: d.status === 'delivered' ? '#10B981' : 'var(--text3)',
                              }}>
                              {d.channel}{d.status === 'delivered' ? ` ✓${d.latencyMs ? ` ${d.latencyMs}ms` : ''}` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
