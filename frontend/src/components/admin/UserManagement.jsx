import { useState, useEffect, useRef } from 'react'
import {
  Users, Search, UserPlus, MoreVertical, Shield, Ban, Trash2,
  ChevronRight, X, GraduationCap, BookOpen, CheckCircle, AlertTriangle,
  Phone, Mail, Building2, User, Crown, Star, RefreshCw, Loader2
} from 'lucide-react'
import {
  fetchAllUsers, banUser, unbanUser, apiBanUser, apiDeleteUser,
  promoteUser, changeUserPlan, apiPromoteUser, apiChangeUserPlan, logAction,
} from '../../services/adminService'

const PLAN_CYCLE = { Free: 'Pro', Pro: 'School', School: 'Free' }
const STATUS_COLORS = {
  Active:   { dot: '#10b981', text: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  Inactive: { dot: '#94a3b8', text: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  Banned:   { dot: '#ef4444', text: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
}
const PLAN_COLORS = {
  Free:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
  Pro:    { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',   border: 'rgba(124,58,237,0.2)'  },
  School: { color: '#2354F4', bg: 'rgba(35,84,244,0.1)',    border: 'rgba(35,84,244,0.2)'   },
}
const ROLE_COLORS = {
  Teacher: { color: '#2354F4', bg: 'rgba(35,84,244,0.1)',   border: 'rgba(35,84,244,0.2)'   },
  Student: { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)'   },
  Admin:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'  },
}
const AVATAR_GRADIENTS = {
  Teacher: 'linear-gradient(135deg,#2354F4,#60a5fa)',
  Student: 'linear-gradient(135deg,#7c3aed,#a855f7)',
  Admin:   'linear-gradient(135deg,#DC2626,#f97316)',
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Inactive
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase', color:c.text }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
      {status}
    </span>
  )
}

function PlanBadge({ plan }) {
  const c = PLAN_COLORS[plan] || PLAN_COLORS.Free
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:20, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase', color:c.color }}>
      {plan === 'Pro' && <Star style={{ width:9, height:9 }} />}
      {plan === 'School' && <Crown style={{ width:9, height:9 }} />}
      {plan}
    </span>
  )
}

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.Student
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:20, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase', color:c.color }}>
      {role}
    </span>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [actionMenu, setActionMenu] = useState(null)
  const [submenu, setSubmenu] = useState(null)
  const [modal, setModal] = useState(null)
  const [banReason, setBanReason] = useState('')
  const [addForm, setAddForm] = useState({ name:'', email:'', phone:'', school:'', subject:'', board:'' })
  const menuRef = useRef(null)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchAllUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) { setActionMenu(null); setSubmenu(null) }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = u.name.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || (u.school || '').toLowerCase().includes(q)
    const matchRole   = roleFilter   === 'All' || u.type   === roleFilter
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const counts = {
    total:    users.length,
    students: users.filter(u => u.type === 'Student').length,
    teachers: users.filter(u => u.type === 'Teacher').length,
    banned:   users.filter(u => u.status === 'Banned').length,
  }

  const update = (id, patch) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u))
  const remove = (id)         => setUsers(prev => prev.filter(u => u.id !== id))

  const openMenu = (e, userId) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setActionMenu({ userId, x: rect.right, y: rect.bottom })
  }

  const menuUser = actionMenu ? users.find(u => u.id === actionMenu.userId) : null

  const handleBan = () => {
    const target = modal?.user
    if (!target) return
    const u = users.find(x => x.id === target.id)
    update(target.id, { status: 'Banned', banReason })
    banUser({ id: target.id, email: u?.email || '', name: u?.name || '' }, banReason)
    apiBanUser(target.id, true, banReason, u?.email || '')
    logAction({ action: 'USER_BANNED', actor: 'Admin', target: u?.email || '', targetRole: u?.type, detail: banReason, severity: 'high' })
    setActionMenu(null); setModal(null); setBanReason('')
  }
  const handleUnban = (userId) => {
    const u = users.find(x => x.id === userId)
    update(userId, { status: 'Active', banReason: null })
    unbanUser(u?.email || '')
    apiBanUser(userId, u?.email || '', '', false)
    logAction({ action: 'USER_UNBANNED', actor: 'Admin', target: u?.email || '', targetRole: u?.type, detail: 'Ban lifted by admin', severity: 'low' })
    setActionMenu(null)
  }
  const handleChangePlan = (userId, newPlan) => {
    const u = users.find(x => x.id === userId)
    update(userId, { plan: newPlan })
    changeUserPlan(u?.email || '', newPlan)
    apiChangeUserPlan(userId, newPlan)
    logAction({ action: 'PLAN_UPGRADED', actor: 'Admin', target: u?.email || '', detail: `Plan changed to ${newPlan}`, severity: 'info' })
    setActionMenu(null)
  }
  const handlePromoteRole = (userId, newRole) => {
    const u = users.find(x => x.id === userId)
    update(userId, { type: newRole })
    promoteUser(u?.email || '', newRole)
    apiPromoteUser(userId, newRole.toLowerCase())
    logAction({ action: 'ROLE_PROMOTED', actor: 'Admin', target: u?.email || '', targetRole: newRole, detail: `Role changed to ${newRole}`, severity: 'medium' })
    setActionMenu(null)
  }
  const handleRemove = (userId) => {
    const u = users.find(x => x.id === userId)
    remove(userId)
    apiDeleteUser(userId)
    logAction({ action: 'TEACHER_REMOVED', actor: 'Admin', target: u?.email || '', targetRole: u?.type, detail: 'User permanently deleted', severity: 'high' })
    setActionMenu(null); setModal(null)
  }
  const handleAddTeacher = (e) => {
    e.preventDefault()
    const initials = addForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const newTeacher = {
      id: `tch_new_${Date.now()}`,
      name: addForm.name, email: addForm.email, avatar: initials,
      school: addForm.school || '—', subject: addForm.subject,
      board: addForm.board, status: 'Active', plan: 'Free',
      joinDate: new Date().toISOString().slice(0, 10), lastActive: 'Just now',
      papersCreated: 0, studentsReached: 0, phone: addForm.phone, banReason: null, type: 'Teacher',
    }
    setUsers(prev => [newTeacher, ...prev])
    logAction({ action: 'TEACHER_ADDED', actor: 'Admin', target: addForm.email, targetRole: 'Teacher', detail: `New teacher account created for ${addForm.name}`, severity: 'info' })
    setModal(null)
    setAddForm({ name:'', email:'', phone:'', school:'', subject:'', board:'' })
  }

  return (
    <div className="space-y-6 fade-in" onClick={() => setActionMenu(null)}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color:'var(--text)' }}>
            <Users className="w-7 h-7" style={{ color:'#2354F4' }} />
            User Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text3)' }}>
            {loading ? 'Loading users…' : `${counts.total} registered users`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadUsers}
            title="Refresh"
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold rounded-xl border transition-all"
            style={{ color:'var(--text2)', borderColor:'var(--border)', background:'var(--bg2)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setModal({ type:'add' })}
            className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background:'linear-gradient(135deg,#2354F4,#7c3aed)', boxShadow:'0 4px 16px rgba(35,84,244,0.3)' }}
          >
            <UserPlus className="w-4 h-4" /> Add Teacher
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Users',    value:counts.total,    color:'#2354F4', bg:'rgba(35,84,244,0.1)',    Icon:Users },
          { label:'Students',       value:counts.students,  color:'#7c3aed', bg:'rgba(124,58,237,0.1)',   Icon:GraduationCap },
          { label:'Teachers',       value:counts.teachers,  color:'#10b981', bg:'rgba(16,185,129,0.1)',   Icon:BookOpen },
          { label:'Banned',         value:counts.banned,    color:'#ef4444', bg:'rgba(239,68,68,0.1)',    Icon:Ban },
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

      {/* ── Filters ── */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text3)' }} />
          <input
            type="text"
            placeholder="Search name, email, school..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background:'var(--bg2)', borderColor:'var(--border)', color:'var(--text)' }}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
          {['All','Student','Teacher'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: roleFilter === r ? '#2354F4' : 'transparent',
                color: roleFilter === r ? '#fff' : 'var(--text3)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
          {['All','Active','Inactive','Banned'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: statusFilter === s ? (s === 'Banned' ? '#ef4444' : s === 'Active' ? '#10b981' : 'var(--bg3)') : 'transparent',
                color: statusFilter === s ? (s === 'Banned' || s === 'Active' ? '#fff' : 'var(--text)') : 'var(--text3)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background:'var(--bg3)', borderBottom:'1px solid var(--border)' }}>
                {['User','Role','School','Plan','Status','Last Active',''].map((h, i) => (
                  <th
                    key={h + i}
                    className={`px-5 py-3.5 text-left text-[10px] uppercase font-bold tracking-widest ${
                      h === 'School' ? 'hidden md:table-cell' :
                      h === 'Plan'   ? 'hidden sm:table-cell' :
                      h === 'Last Active' ? 'hidden lg:table-cell' : ''
                    }`}
                    style={{ color:'var(--text3)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 && Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} style={{ borderBottom: '1px solid var(--border)' }}>
                  {[1,2,3,4,5,6,7].map(c => (
                    <td key={c} className="px-5 py-3.5">
                      <div style={{ height: 14, borderRadius: 6, background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }} />
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.map(u => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:'1px solid var(--border)',
                    background: u.status === 'Banned' ? 'rgba(239,68,68,0.03)' : 'transparent',
                  }}
                  className="group transition-colors hover:bg-blue-500/3"
                >
                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 text-white"
                        style={{ background: AVATAR_GRADIENTS[u.type] || AVATAR_GRADIENTS.Student }}
                      >
                        {u.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color:'var(--text)' }}>{u.name}</p>
                        <p className="text-[11px] truncate mt-0.5" style={{ color:'var(--text3)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-5 py-3.5"><RoleBadge role={u.type} /></td>
                  {/* School */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-medium" style={{ color:'var(--text2)' }}>{u.school}</span>
                  </td>
                  {/* Plan */}
                  <td className="px-5 py-3.5 hidden sm:table-cell"><PlanBadge plan={u.plan} /></td>
                  {/* Status */}
                  <td className="px-5 py-3.5"><StatusBadge status={u.status} /></td>
                  {/* Last Active */}
                  <td className="px-5 py-3.5 hidden lg:table-cell text-xs font-semibold" style={{ color:'var(--text3)' }}>
                    {u.lastActive}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => openMenu(e, u.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ color:'var(--text3)', background: actionMenu?.userId === u.id ? 'var(--bg3)' : 'transparent' }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <Search className="w-8 h-8 mx-auto mb-3" style={{ color:'var(--text3)' }} />
              <p className="text-sm font-bold" style={{ color:'var(--text2)' }}>No users match your filters</p>
              <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Try adjusting search or role/status filter</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Action Dropdown Menu ── */}
      {actionMenu && menuUser && (
        <div
          ref={menuRef}
          onClick={e => e.stopPropagation()}
          style={{
            position:'fixed',
            top: Math.min(actionMenu.y + 4, window.innerHeight - 300),
            right: window.innerWidth - actionMenu.x + 4,
            zIndex:1000,
            background:'var(--card-bg)',
            border:'1px solid var(--border)',
            borderRadius:16,
            boxShadow:'0 20px 50px rgba(0,0,0,0.2)',
            minWidth:220,
            overflow:'hidden',
          }}
        >
          {/* Menu Header */}
          <div style={{ padding:'12px 14px 10px', borderBottom:'1px solid var(--border)' }}>
            <p className="text-xs font-bold" style={{ color:'var(--text)' }}>{menuUser.name}</p>
            <p className="text-[10px] mt-0.5" style={{ color:'var(--text3)' }}>{menuUser.type} · {menuUser.school}</p>
          </div>

          {/* View Profile */}
          <button
            onClick={() => { setModal({ type:'view', user:menuUser }); setActionMenu(null) }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <User style={{ width:15, height:15, flexShrink:0 }} /> View Profile
          </button>

          {/* Promote Role */}
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setSubmenu(submenu === 'role' ? null : 'role')}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'10px 14px', background: submenu === 'role' ? 'var(--bg3)' : 'transparent', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
              onMouseEnter={e => { if (submenu !== 'role') e.currentTarget.style.background='var(--bg3)' }}
              onMouseLeave={e => { if (submenu !== 'role') e.currentTarget.style.background='transparent' }}
            >
              <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Shield style={{ width:15, height:15, flexShrink:0 }} /> Promote Role
              </span>
              <ChevronRight style={{ width:13, height:13, color:'var(--text3)', flexShrink:0 }} />
            </button>
            {submenu === 'role' && (
              <div
                style={{
                  position:'absolute', left:'100%', top:0,
                  background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:12,
                  boxShadow:'0 10px 30px rgba(0,0,0,0.15)', minWidth:140, zIndex:10, overflow:'hidden',
                }}
              >
                {['Student','Teacher','Admin'].filter(r => r !== menuUser.type).map(r => (
                  <button
                    key={r}
                    onClick={() => { handlePromoteRole(menuUser.id, r); setSubmenu(null) }}
                    style={{ width:'100%', padding:'9px 14px', background:'transparent', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:'0.8rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    → {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Change Plan */}
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setSubmenu(submenu === 'plan' ? null : 'plan')}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'10px 14px', background: submenu === 'plan' ? 'var(--bg3)' : 'transparent', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
              onMouseEnter={e => { if (submenu !== 'plan') e.currentTarget.style.background='var(--bg3)' }}
              onMouseLeave={e => { if (submenu !== 'plan') e.currentTarget.style.background='transparent' }}
            >
              <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Star style={{ width:15, height:15, flexShrink:0 }} /> Change Plan
              </span>
              <ChevronRight style={{ width:13, height:13, color:'var(--text3)', flexShrink:0 }} />
            </button>
            {submenu === 'plan' && (
              <div
                style={{
                  position:'absolute', left:'100%', top:0,
                  background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:12,
                  boxShadow:'0 10px 30px rgba(0,0,0,0.15)', minWidth:130, zIndex:10, overflow:'hidden',
                }}
              >
                {['Free','Pro','School'].filter(p => p !== menuUser.plan).map(p => (
                  <button
                    key={p}
                    onClick={() => { handleChangePlan(menuUser.id, p); setSubmenu(null) }}
                    style={{ width:'100%', padding:'9px 14px', background:'transparent', border:'none', cursor:'pointer', color: PLAN_COLORS[p]?.color || 'var(--text2)', fontSize:'0.8rem', fontWeight:700, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    → {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />

          {/* Ban / Unban */}
          {menuUser.status !== 'Banned' ? (
            <button
              onClick={() => { setModal({ type:'ban', user:menuUser }); setActionMenu(null) }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', color:'#f59e0b', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(245,158,11,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <Ban style={{ width:15, height:15, flexShrink:0 }} /> Ban User
            </button>
          ) : (
            <button
              onClick={() => handleUnban(menuUser.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', color:'#10b981', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(16,185,129,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <CheckCircle style={{ width:15, height:15, flexShrink:0 }} /> Unban User
            </button>
          )}

          {/* Remove */}
          <button
            onClick={() => { setModal({ type:'remove', user:menuUser }); setActionMenu(null) }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'0.82rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <Trash2 style={{ width:15, height:15, flexShrink:0 }} /> Remove User
          </button>
        </div>
      )}

      {/* ════════════════════════════════
          MODALS
      ════════════════════════════════ */}
      {modal && (
        <div
          style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}
          onClick={() => setModal(null)}
        >
          <div
            style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:24, width:'100%', maxWidth: modal.type === 'view' ? 520 : modal.type === 'add' ? 560 : 420, margin:'0 16px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 70px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >

            {/* ── View Profile Modal ── */}
            {modal.type === 'view' && modal.user && (
              <div>
                <div style={{ padding:'24px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:52, height:52, borderRadius:15, background:AVATAR_GRADIENTS[modal.user.type], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                      {modal.user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{ color:'var(--text)' }}>{modal.user.name}</p>
                      <p className="text-sm" style={{ color:'var(--text3)' }}>{modal.user.email}</p>
                      <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                        <RoleBadge role={modal.user.type} />
                        <StatusBadge status={modal.user.status} />
                        <PlanBadge plan={modal.user.plan} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text3)', padding:4 }}>
                    <X style={{ width:20, height:20 }} />
                  </button>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[
                      { label:'School', value:modal.user.school, Icon:Building2 },
                      { label:'Subject / Class', value:modal.user.subject || modal.user.class, Icon:BookOpen },
                      { label:'Board', value:modal.user.board, Icon:GraduationCap },
                      { label:'Phone', value:modal.user.phone, Icon:Phone },
                      { label:'Joined', value:modal.user.joinDate, Icon:User },
                      { label:'Last Active', value:modal.user.lastActive, Icon:CheckCircle },
                      ...(modal.user.type === 'Teacher' ? [
                        { label:'Papers Created', value:modal.user.papersCreated, Icon:BookOpen },
                        { label:'Students Reached', value:modal.user.studentsReached, Icon:Users },
                      ] : [
                        { label:'Tests Attempted', value:modal.user.testsAttempted, Icon:BookOpen },
                        { label:'Avg Score', value:`${modal.user.avgScore}%`, Icon:Star },
                      ]),
                    ].map(({ label, value, Icon }) => (
                      <div key={label} style={{ padding:'12px 14px', borderRadius:12, background:'var(--bg2)', border:'1px solid var(--border)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color:'var(--text3)' }}>{label}</p>
                        <p className="text-sm font-bold" style={{ color:'var(--text)' }}>{value ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                  {modal.user.banReason && (
                    <div style={{ marginTop:14, padding:14, borderRadius:12, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)' }}>
                      <p className="text-xs font-bold mb-1" style={{ color:'#ef4444' }}>Ban Reason</p>
                      <p className="text-sm" style={{ color:'var(--text2)' }}>{modal.user.banReason}</p>
                    </div>
                  )}
                  {modal.user.weakTopics?.length > 0 && (
                    <div style={{ marginTop:14 }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text3)' }}>Weak Topics</p>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {modal.user.weakTopics.map(t => (
                          <span key={t} style={{ padding:'4px 10px', borderRadius:20, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', fontSize:'0.72rem', fontWeight:700, color:'#ef4444' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Ban Confirm Modal ── */}
            {modal.type === 'ban' && modal.user && (
              <div style={{ padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                  <div style={{ width:44, height:44, borderRadius:13, background:'rgba(239,68,68,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Ban style={{ width:22, height:22, color:'#ef4444' }} />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color:'var(--text)' }}>Ban {modal.user.name}?</p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>This will immediately revoke access to QuesGen.</p>
                  </div>
                  <button onClick={() => setModal(null)} style={{ marginLeft:'auto', background:'transparent', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                    <X style={{ width:18, height:18 }} />
                  </button>
                </div>
                <div style={{ marginBottom:16 }}>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color:'var(--text3)' }}>Ban Reason (required)</label>
                  <textarea
                    value={banReason}
                    onChange={e => setBanReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Sharing papers on Telegram, academic dishonesty..."
                    style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.85rem', fontFamily:"'DM Sans',sans-serif", resize:'vertical', outline:'none', boxSizing:'border-box' }}
                  />
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button
                    onClick={() => setModal(null)}
                    style={{ flex:1, padding:'11px', borderRadius:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBan}
                    disabled={!banReason.trim()}
                    style={{ flex:1, padding:'11px', borderRadius:12, background: banReason.trim() ? '#ef4444' : 'var(--bg3)', border:'none', color: banReason.trim() ? '#fff' : 'var(--text3)', fontWeight:700, fontSize:'0.85rem', cursor: banReason.trim() ? 'pointer' : 'not-allowed', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}
                  >
                    Confirm Ban
                  </button>
                </div>
              </div>
            )}

            {/* ── Remove Confirm Modal ── */}
            {modal.type === 'remove' && modal.user && (
              <div style={{ padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                  <div style={{ width:44, height:44, borderRadius:13, background:'rgba(239,68,68,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Trash2 style={{ width:22, height:22, color:'#ef4444' }} />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color:'var(--text)' }}>Remove {modal.user.name}?</p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>This action is permanent and cannot be undone.</p>
                  </div>
                  <button onClick={() => setModal(null)} style={{ marginLeft:'auto', background:'transparent', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                    <X style={{ width:18, height:18 }} />
                  </button>
                </div>
                <div style={{ padding:14, borderRadius:12, background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.15)', marginBottom:16 }}>
                  <p className="text-xs font-bold" style={{ color:'#ef4444' }}>
                    <AlertTriangle style={{ width:12, height:12, display:'inline', marginRight:5 }} />
                    All data, papers, and progress for this user will be permanently deleted.
                  </p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button
                    onClick={() => setModal(null)}
                    style={{ flex:1, padding:'11px', borderRadius:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemove(modal.user.id)}
                    style={{ flex:1, padding:'11px', borderRadius:12, background:'#ef4444', border:'none', color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            )}

            {/* ── Add Teacher Modal ── */}
            {modal.type === 'add' && (
              <div>
                <div style={{ padding:'24px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <p className="font-bold text-lg" style={{ color:'var(--text)' }}>Add New Teacher</p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>Create a teacher account and link to a school</p>
                  </div>
                  <button onClick={() => setModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                    <X style={{ width:20, height:20 }} />
                  </button>
                </div>
                <form onSubmit={handleAddTeacher} style={{ padding:24 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>Full Name *</label>
                      <input
                        required
                        value={addForm.name}
                        onChange={e => setAddForm(p => ({ ...p, name:e.target.value }))}
                        placeholder="e.g. Dr. Ravi Shankar"
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>Email *</label>
                      <input
                        required type="email"
                        value={addForm.email}
                        onChange={e => setAddForm(p => ({ ...p, email:e.target.value }))}
                        placeholder="teacher@school.edu.in"
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>Phone</label>
                      <input
                        value={addForm.phone}
                        onChange={e => setAddForm(p => ({ ...p, phone:e.target.value }))}
                        placeholder="+91-XXXXX-XXXXX"
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
                      />
                    </div>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>School</label>
                      <input
                        value={addForm.school}
                        onChange={e => setAddForm(p => ({ ...p, school:e.target.value }))}
                        placeholder="e.g. Delhi Public School, Jaipur"
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>Subject *</label>
                      <input
                        required
                        value={addForm.subject}
                        onChange={e => setAddForm(p => ({ ...p, subject:e.target.value }))}
                        placeholder="e.g. Physics, Math..."
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--text3)' }}>Board</label>
                      <select
                        value={addForm.board}
                        onChange={e => setAddForm(p => ({ ...p, board:e.target.value }))}
                        style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none' }}
                      >
                        <option value="">Select board...</option>
                        {['CBSE','ICSE','JEE','NEET','JEE/NEET','State Board'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, marginTop:20 }}>
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      style={{ flex:1, padding:'11px', borderRadius:12, background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ flex:2, padding:'11px', borderRadius:12, background:'linear-gradient(135deg,#2354F4,#7c3aed)', border:'none', color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                    >
                      Create Teacher Account
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
