import { useState, useEffect } from 'react'
import { Users, GraduationCap, FileText, ChevronDown, ChevronUp, Search, Send, BookOpen, AlertCircle } from 'lucide-react'
import {
  getTeacherClassAssignment, getStudentsBySchool, getPapersByClass,
} from '../../services/schoolService'

const COLORS = ['#3B82F6', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

export default function ClassManager({ user }) {
  const [assignment, setAssignment]   = useState(null)
  const [classData, setClassData]     = useState([]) // [{ name, students, papers }]
  const [expanded, setExpanded]       = useState({})
  const [search, setSearch]           = useState('')

  const teacherEmail = user?.email || ''
  const schoolName   = user?.schoolName || ''

  useEffect(() => {
    if (!teacherEmail) return

    const asgn = getTeacherClassAssignment(teacherEmail)
    setAssignment(asgn)

    if (!asgn?.classNames?.length) return

    const data = asgn.classNames.map((cls, i) => {
      const students = getStudentsBySchool(schoolName, cls)
      const papers   = getPapersByClass(cls, schoolName)
      return { name: cls, students, papers, color: COLORS[i % COLORS.length] }
    })
    setClassData(data)
  }, [teacherEmail, schoolName])

  const toggleExpand = (cls) => setExpanded(prev => ({ ...prev, [cls]: !prev[cls] }))

  const filteredStudents = (students) =>
    search.trim()
      ? students.filter(s => {
          const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase()
          return name.includes(search.toLowerCase()) || s.email?.includes(search.toLowerCase())
        })
      : students

  if (!assignment || !assignment.classNames?.length) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>My Classes</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm">View students and papers for your assigned classes</p>
        </div>

        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 mb-4" style={{ color: 'var(--text3)', opacity: 0.4 }} />
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>No Classes Assigned Yet</h3>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text3)' }}>
            Your school admin needs to assign classes to you from the School Portal. Once assigned, you'll see your students here.
          </p>
        </div>
      </div>
    )
  }

  const totalStudents = classData.reduce((s, c) => s + c.students.length, 0)
  const totalPapers   = classData.reduce((s, c) => s + c.papers.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>My Classes</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm">
            {classData.length} class{classData.length !== 1 ? 'es' : ''} · {totalStudents} students · {totalPapers} papers assigned
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--text3)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search students…"
            className="bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)', minWidth: 160 }}
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Classes',  value: classData.length,  icon: BookOpen,      color: '#3B82F6' },
          { label: 'Students', value: totalStudents,      icon: GraduationCap, color: '#7C3AED' },
          { label: 'Papers',   value: totalPapers,        icon: FileText,      color: '#10B981' },
          { label: 'Assigned', value: classData.filter(c => c.papers.some(p => p.status === 'assigned')).length, icon: Send, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}14`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Class accordion */}
      <div className="space-y-4">
        {classData.map((cls) => {
          const isOpen     = !!expanded[cls.name]
          const students   = filteredStudents(cls.students)
          const assigned   = cls.papers.filter(p => p.status === 'assigned')

          return (
            <div key={cls.name} className="card overflow-hidden">
              {/* Class header */}
              <button
                onClick={() => toggleExpand(cls.name)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                style={{ borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex items-center gap-4">
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `${cls.color}14`, border: `1px solid ${cls.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 900, color: cls.color,
                  }}>
                    {cls.name}
                  </div>
                  <div>
                    <div className="font-bold text-base" style={{ color: 'var(--text)' }}>Class {cls.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                      {cls.students.length} student{cls.students.length !== 1 ? 's' : ''} · {assigned.length} paper{assigned.length !== 1 ? 's' : ''} assigned
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {assigned.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      {assigned.length} active
                    </span>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text3)' }} />}
                </div>
              </button>

              {isOpen && (
                <div className="p-5 space-y-5">
                  {/* Assigned Papers */}
                  {assigned.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>Assigned Papers</h4>
                      <div className="space-y-2">
                        {assigned.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border"
                            style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                            <div>
                              <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{p.subject}</div>
                              <div className="text-xs" style={{ color: 'var(--text3)' }}>
                                {p.board} · {p.totalMarks} marks · {new Date(p.createdAt).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                              Assigned
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                      Students ({students.length})
                    </h4>
                    {students.length === 0 ? (
                      <div className="text-center py-8" style={{ color: 'var(--text3)' }}>
                        <GraduationCap size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                        <p className="text-xs">
                          {cls.students.length === 0
                            ? 'No students have registered for this class yet.'
                            : 'No students match your search.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {students.map(s => {
                          const name = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email?.split('@')[0]
                          const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          return (
                            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border"
                              style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: `${cls.color}14`, border: `1px solid ${cls.color}28`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '0.72rem', color: cls.color,
                              }}>
                                {initials}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{name}</div>
                                <div className="text-xs truncate" style={{ color: 'var(--text3)' }}>{s.email}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
