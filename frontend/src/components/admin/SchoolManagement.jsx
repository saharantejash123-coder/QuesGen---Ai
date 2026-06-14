import { useState } from 'react'
import {
  Building2, Search, Users, BookOpen, TrendingUp, ChevronDown, ChevronUp,
  MapPin, Phone, Mail, Crown, Zap, Ban, CheckCircle, Trash2, X, AlertTriangle
} from 'lucide-react'
import { SCHOOLS, TEACHERS } from '../../data/adminData'

const PLAN_ORDER  = ['Free', 'Pro', 'School']
const PLAN_NEXT   = { Free:'Pro', Pro:'School', School:'Free' }
const PLAN_STYLES = {
  Free:   { color:'#94a3b8', bg:'rgba(148,163,184,0.1)', border:'rgba(148,163,184,0.2)', label:'Free' },
  Pro:    { color:'#7c3aed', bg:'rgba(124,58,237,0.1)',  border:'rgba(124,58,237,0.2)',  label:'Pro' },
  School: { color:'#2354F4', bg:'rgba(35,84,244,0.1)',   border:'rgba(35,84,244,0.2)',   label:'School' },
}
const BOARD_STYLES = {
  'CBSE':     { color:'#059669', bg:'rgba(5,150,105,0.1)',  border:'rgba(5,150,105,0.2)'  },
  'ICSE':     { color:'#2354F4', bg:'rgba(35,84,244,0.1)', border:'rgba(35,84,244,0.18)' },
  'JEE/NEET': { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.2)' },
  'JEE':      { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.2)' },
  'NEET':     { color:'#7c3aed', bg:'rgba(124,58,237,0.1)', border:'rgba(124,58,237,0.2)' },
}
const STATUS_STYLES = {
  Active:    { color:'#10b981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)' },
  Suspended: { color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)'  },
}
const TCH_STATUS = {
  Active:   { color:'#10b981', bg:'rgba(16,185,129,0.1)' },
  Inactive: { color:'#94a3b8', bg:'rgba(148,163,184,0.1)' },
  Banned:   { color:'#ef4444', bg:'rgba(239,68,68,0.1)'  },
}

function Badge({ children, color, bg, border }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:bg, border:`1px solid ${border}`, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase', color }}>
      {children}
    </span>
  )
}

export default function SchoolManagement() {
  const [schools, setSchools]       = useState(SCHOOLS)
  const [teachers, setTeachers]     = useState(TEACHERS)
  const [search, setSearch]         = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [removeModal, setRemoveModal] = useState(null) // { type:'teacher'|'school', id }

  const filtered = schools.filter(s => {
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.board.toLowerCase().includes(q)
    )
  })

  const getSchoolTeachers = (schoolId) =>
    teachers.filter(t => t.schoolId === schoolId)

  const upgradePlan = (schoolId) => {
    setSchools(prev => prev.map(s =>
      s.id === schoolId ? { ...s, plan: PLAN_NEXT[s.plan] } : s
    ))
  }

  const toggleStatus = (schoolId) => {
    setSchools(prev => prev.map(s =>
      s.id === schoolId
        ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active', suspendedReason: s.status === 'Active' ? 'Manually suspended by Super Admin.' : undefined }
        : s
    ))
  }

  const removeTeacher = (teacherId) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId))
    setRemoveModal(null)
  }

  const removeSchool = (schoolId) => {
    setSchools(prev => prev.filter(s => s.id !== schoolId))
    setTeachers(prev => prev.filter(t => t.schoolId !== schoolId))
    setRemoveModal(null)
    setExpandedId(null)
  }

  const totalTeachers  = schools.reduce((a, s) => a + s.teachers,  0)
  const totalStudents  = schools.reduce((a, s) => a + s.students,  0)
  const totalActive    = schools.filter(s => s.status === 'Active').length
  const totalSuspended = schools.filter(s => s.status === 'Suspended').length

  return (
    <div className="space-y-6 fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color:'var(--text)' }}>
            <Building2 className="w-7 h-7" style={{ color:'#059669' }} />
            School Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text3)' }}>
            {schools.length} partner institutions · {totalTeachers} teachers · {totalStudents.toLocaleString()} students
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Schools',  value:schools.length, color:'#2354F4', bg:'rgba(35,84,244,0.1)',   Icon:Building2 },
          { label:'Active',         value:totalActive,    color:'#10b981', bg:'rgba(16,185,129,0.1)',  Icon:CheckCircle },
          { label:'Suspended',      value:totalSuspended, color:'#ef4444', bg:'rgba(239,68,68,0.1)',   Icon:Ban },
          { label:'Total Students', value:totalStudents.toLocaleString(), color:'#7c3aed', bg:'rgba(124,58,237,0.1)', Icon:Users },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div style={{ width:40, height:40, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', background:s.bg, flexShrink:0 }}>
              <s.Icon style={{ width:18, height:18, color:s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color:'var(--text)' }}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--text3)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text3)' }} />
          <input
            type="text"
            placeholder="Search schools by name, city, state, or board..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, paddingLeft:40, paddingRight:16, paddingTop:10, paddingBottom:10, color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
          />
        </div>
      </div>

      {/* ── School Cards Grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
        {filtered.map(school => {
          const isExpanded   = expandedId === school.id
          const schoolTeachers = getSchoolTeachers(school.id)
          const planStyle    = PLAN_STYLES[school.plan]  || PLAN_STYLES.Free
          const boardStyle   = BOARD_STYLES[school.board] || { color:'var(--text2)', bg:'rgba(148,163,184,0.1)', border:'rgba(148,163,184,0.2)' }
          const statusStyle  = STATUS_STYLES[school.status] || STATUS_STYLES.Active
          const isSuspended  = school.status === 'Suspended'

          return (
            <div
              key={school.id}
              className="card"
              style={{
                overflow:'visible',
                opacity: isSuspended ? 0.85 : 1,
                gridColumn: isExpanded ? '1 / -1' : 'auto',
              }}
            >
              {/* ── Card Header ── */}
              <div style={{ padding:'18px 20px 14px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:12 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1, minWidth:0 }}>
                    <div style={{
                      width:44, height:44, borderRadius:13, flexShrink:0,
                      background: isSuspended ? 'rgba(239,68,68,0.12)' : 'rgba(35,84,244,0.1)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'1.2rem',
                    }}>
                      🏫
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p className="font-bold text-sm leading-tight" style={{ color:'var(--text)', marginBottom:3 }}>{school.name}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <MapPin style={{ width:11, height:11, color:'var(--text3)', flexShrink:0 }} />
                        <p style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:600 }}>{school.location}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                    <Badge color={boardStyle.color} bg={boardStyle.bg} border={boardStyle.border}>{school.board}</Badge>
                    <Badge color={statusStyle.color} bg={statusStyle.bg} border={statusStyle.border}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor' }} />
                      {school.status}
                    </Badge>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:14 }}>
                  {[
                    { Icon:BookOpen, label:'Teachers', value:schoolTeachers.length || school.teachers },
                    { Icon:Users,    label:'Students', value:school.students.toLocaleString() },
                    { Icon:TrendingUp, label:'Revenue', value:school.revenue },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} style={{ padding:'8px 10px', borderRadius:10, background:'var(--bg2)', border:'1px solid var(--border)', textAlign:'center' }}>
                      <Icon style={{ width:12, height:12, color:'var(--text3)', margin:'0 auto 3px' }} />
                      <p style={{ color:'var(--text)', fontSize:'0.78rem', fontWeight:700 }}>{value}</p>
                      <p style={{ color:'var(--text3)', fontSize:'0.62rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Plan + Joined */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Badge color={planStyle.color} bg={planStyle.bg} border={planStyle.border}>
                      {school.plan === 'Pro' && <Crown style={{ width:8, height:8 }} />}
                      {school.plan === 'School' && <Zap style={{ width:8, height:8 }} />}
                      {school.plan} Plan
                    </Badge>
                  </div>
                  <p style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:600 }}>Since {school.joinDate}</p>
                </div>

                {isSuspended && school.suspendedReason && (
                  <div style={{ padding:'8px 12px', borderRadius:10, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.18)', marginBottom:12 }}>
                    <p style={{ color:'#ef4444', fontSize:'0.72rem', fontWeight:600, lineHeight:1.4 }}>
                      <AlertTriangle style={{ width:11, height:11, display:'inline', marginRight:4 }} />
                      {school.suspendedReason}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display:'flex', gap:8 }}>
                  <button
                    onClick={() => upgradePlan(school.id)}
                    style={{ flex:1, padding:'7px 10px', borderRadius:10, background:`${planStyle.bg}`, border:`1px solid ${planStyle.border}`, color:planStyle.color, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s', textTransform:'uppercase', letterSpacing:'0.5px' }}
                    onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity='1'}
                  >
                    → {PLAN_NEXT[school.plan]} Plan
                  </button>
                  <button
                    onClick={() => toggleStatus(school.id)}
                    style={{ flex:1, padding:'7px 10px', borderRadius:10, background:isSuspended ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border:`1px solid ${isSuspended ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, color:isSuspended ? '#10b981' : '#f59e0b', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", textTransform:'uppercase', letterSpacing:'0.5px' }}
                  >
                    {isSuspended ? 'Reactivate' : 'Suspend'}
                  </button>
                  <button
                    onClick={() => setRemoveModal({ type:'school', id:school.id, name:school.name })}
                    style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', flexShrink:0 }}
                  >
                    <Trash2 style={{ width:14, height:14 }} />
                  </button>
                </div>
              </div>

              {/* ── Toggle Teachers Panel ── */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : school.id)}
                style={{ width:'100%', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg3)', border:'none', borderTop:'1px solid var(--border)', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--bg3)'}
              >
                <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text3)', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px' }}>
                  <BookOpen style={{ width:12, height:12 }} />
                  {schoolTeachers.length} Teachers on this account
                </span>
                {isExpanded
                  ? <ChevronUp style={{ width:14, height:14, color:'var(--text3)' }} />
                  : <ChevronDown style={{ width:14, height:14, color:'var(--text3)' }} />
                }
              </button>

              {/* ── Teachers List ── */}
              {isExpanded && (
                <div style={{ borderTop:'1px solid var(--border)', padding:'16px 20px', background:'var(--bg)', borderRadius:'0 0 20px 20px' }}>
                  {schoolTeachers.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'24px 0' }}>
                      <p style={{ color:'var(--text3)', fontSize:'0.85rem', fontWeight:600 }}>No teachers linked to this school</p>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:10 }}>
                      {schoolTeachers.map(t => {
                        const ts = TCH_STATUS[t.status] || TCH_STATUS.Active
                        return (
                          <div
                            key={t.id}
                            style={{ padding:'12px 14px', borderRadius:13, background:'var(--card-bg)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}
                          >
                            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#2354F4,#60a5fa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                              {t.avatar}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ color:'var(--text)', fontSize:'0.82rem', fontWeight:700, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</p>
                              <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                                <span style={{ color:'var(--text3)', fontSize:'0.68rem', fontWeight:600 }}>{t.subject}</span>
                                <span style={{ color:'var(--border)', fontSize:'0.68rem' }}>·</span>
                                <span style={{ padding:'2px 7px', borderRadius:20, background:ts.bg, color:ts.color, fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>{t.status}</span>
                              </div>
                              <p style={{ color:'var(--text3)', fontSize:'0.65rem', marginTop:2 }}>{t.papersCreated} papers · last {t.lastActive}</p>
                            </div>
                            <button
                              onClick={() => setRemoveModal({ type:'teacher', id:t.id, name:t.name, school:school.name })}
                              style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', color:'#ef4444', cursor:'pointer', flexShrink:0 }}
                              title="Remove from school"
                            >
                              <X style={{ width:13, height:13 }} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card py-16 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text3)' }} />
          <p className="font-bold text-sm" style={{ color:'var(--text2)' }}>No schools match your search</p>
          <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Try a different city, state, or board name</p>
        </div>
      )}

      {/* ── Remove Modals ── */}
      {removeModal && (
        <div
          style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}
          onClick={() => setRemoveModal(null)}
        >
          <div
            style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:22, width:'100%', maxWidth:400, margin:'0 16px', boxShadow:'0 30px 70px rgba(0,0,0,0.3)', padding:24 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
              <div style={{ width:44, height:44, borderRadius:13, background:'rgba(239,68,68,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Trash2 style={{ width:22, height:22, color:'#ef4444' }} />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color:'var(--text)' }}>
                  {removeModal.type === 'teacher' ? `Remove ${removeModal.name}?` : `Delete ${removeModal.name}?`}
                </p>
                <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>
                  {removeModal.type === 'teacher'
                    ? `Teacher will be removed from ${removeModal.school}.`
                    : 'All teachers and student data for this school will be removed.'}
                </p>
              </div>
              <button onClick={() => setRemoveModal(null)} style={{ marginLeft:'auto', background:'transparent', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                <X style={{ width:18, height:18 }} />
              </button>
            </div>
            {removeModal.type === 'school' && (
              <div style={{ padding:'12px 14px', borderRadius:11, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', marginBottom:16 }}>
                <p style={{ color:'#ef4444', fontSize:'0.75rem', fontWeight:600 }}>
                  <AlertTriangle style={{ width:12, height:12, display:'inline', marginRight:4 }} />
                  This will remove the school, all its teachers, and unlink all students permanently.
                </p>
              </div>
            )}
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={() => setRemoveModal(null)}
                style={{ flex:1, padding:'11px', borderRadius:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => removeModal.type === 'teacher' ? removeTeacher(removeModal.id) : removeSchool(removeModal.id)}
                style={{ flex:1, padding:'11px', borderRadius:12, background:'#ef4444', border:'none', color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
