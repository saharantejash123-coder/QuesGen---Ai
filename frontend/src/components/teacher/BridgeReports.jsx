import { useState, useEffect } from 'react'
import { Send, CheckCircle, Clock, MessageSquare, Phone, Bell, Search, Filter, ShieldCheck, Users, BookOpen, AlertCircle } from 'lucide-react'
import { getTeacherClassAssignment, getStudentsBySchool, getPapersByClass } from '../../services/schoolService'

export default function BridgeReports({ user }) {
  const [automated, setAutomated]   = useState(true)
  const [channels, setChannels]     = useState({ whatsapp: true, sms: false, email: true })
  const [search, setSearch]         = useState('')
  const [selectedClass, setClass]   = useState('All')
  const [students, setStudents]     = useState([])
  const [papers, setPapers]         = useState([])
  const [classes, setClasses]       = useState([])

  const teacherEmail = user?.email || ''
  const schoolName   = user?.schoolName || ''

  useEffect(() => {
    if (!teacherEmail) return
    const assignment = getTeacherClassAssignment(teacherEmail)
    const classNames = assignment?.classNames || []
    setClasses(classNames)
    if (classNames.length > 0 && selectedClass === 'All') {
      // Load all students from all assigned classes
    }

    const allStudents = classNames.flatMap(cls => {
      const ss = getStudentsBySchool(schoolName, cls)
      return ss.map(s => ({
        ...s,
        className: cls,
        displayName: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email?.split('@')[0] || 'Student',
        initials: (`${s.firstName || ''} ${s.lastName || ''}`).trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??',
        papersAssigned: getPapersByClass(cls, schoolName).filter(p => p.status === 'assigned').length,
      }))
    })

    const allPapers = classNames.flatMap(cls => getPapersByClass(cls, schoolName))
    setPapers(allPapers)
    setStudents(allStudents)
  }, [teacherEmail, schoolName])

  const noData = classes.length === 0

  const displayStudents = students.filter(s => {
    const matchClass  = selectedClass === 'All' || s.className === selectedClass
    const matchSearch = !search || s.displayName.toLowerCase().includes(search.toLowerCase()) || s.email?.includes(search.toLowerCase())
    return matchClass && matchSearch
  })

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
              : `${students.length} students across ${classes.length} class${classes.length !== 1 ? 'es' : ''} · ${papers.filter(p => p.status === 'assigned').length} papers assigned`}
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
                <p style={{ color: 'var(--text3)' }} className="text-[10px] font-black uppercase mb-3 tracking-widest">Report Frequency</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Weekly', 'Daily', 'Monthly', 'On-Demand'].map(f => (
                    <button key={f} className="py-2 rounded-lg border text-[10px] font-bold transition-colors"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text3)' }}>
                      {f}
                    </button>
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

          {/* Student list */}
          <div className="card p-0 overflow-hidden flex flex-col lg:col-span-3">
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
                <button className="btn-p py-2! px-4! text-[10px] uppercase font-black tracking-widest">Send Now (Manual)</button>
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
                      {['Student', 'Class', 'Email', 'Papers', 'Status'].map(h => (
                        <th key={h} style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {displayStudents.map(s => (
                      <tr key={s.id} className="transition-colors hover:bg-slate-500/5">
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
                          <div className="flex items-center gap-2">
                            {s.papersAssigned > 0
                              ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-500">Active</span></>
                              : <><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-[10px] font-bold text-amber-400">Pending</span></>}
                          </div>
                        </td>
                      </tr>
                    ))}
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
        </div>
      )}
    </div>
  )
}
