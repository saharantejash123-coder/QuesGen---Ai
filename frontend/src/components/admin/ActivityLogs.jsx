import { useState } from 'react'
import {
  Activity, Search, AlertTriangle, TrendingUp, Shield,
  Ban, UserPlus, ArrowUpRight, ArrowDownRight, Building2,
  BookOpen, Globe, Key, Database, FileText, CheckCircle
} from 'lucide-react'
import { ACTIVITY_LOGS } from '../../data/adminData'

// ── Action type display config ──
const ACTION_CONFIG = {
  USER_BANNED:            { label:'User Banned',           color:'#ef4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.25)',   Icon:Ban           },
  USER_UNBANNED:          { label:'User Unbanned',         color:'#10b981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.25)',  Icon:CheckCircle   },
  TEACHER_REMOVED:        { label:'Teacher Removed',       color:'#f97316', bg:'rgba(249,115,22,0.12)',  border:'rgba(249,115,22,0.25)',  Icon:UserPlus      },
  TEACHER_ADDED:          { label:'Teacher Added',         color:'#2354F4', bg:'rgba(35,84,244,0.12)',   border:'rgba(35,84,244,0.25)',   Icon:UserPlus      },
  SUBSCRIPTION_UPGRADED:  { label:'Plan Upgraded',         color:'#10b981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.25)',  Icon:ArrowUpRight  },
  SUBSCRIPTION_DOWNGRADED:{ label:'Plan Downgraded',       color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.25)',  Icon:ArrowDownRight},
  PLAN_UPGRADED:          { label:'Plan Upgraded',         color:'#10b981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.25)',  Icon:ArrowUpRight  },
  SCHOOL_SUSPENDED:       { label:'School Suspended',      color:'#ef4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.25)',   Icon:Building2     },
  SCHOOL_ONBOARDED:       { label:'School Onboarded',      color:'#059669', bg:'rgba(5,150,105,0.12)',   border:'rgba(5,150,105,0.25)',   Icon:Building2     },
  ROLE_PROMOTED:          { label:'Role Promoted',         color:'#7c3aed', bg:'rgba(124,58,237,0.12)',  border:'rgba(124,58,237,0.25)',  Icon:Shield        },
  LOGIN_ATTEMPT:          { label:'Suspicious Login',      color:'#ef4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.25)',   Icon:Key           },
  PAPER_FLAGGED:          { label:'Paper Flagged',         color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.25)',  Icon:FileText      },
  CONTENT_VIOLATION:      { label:'Content Violation',     color:'#f97316', bg:'rgba(249,115,22,0.12)',  border:'rgba(249,115,22,0.25)',  Icon:AlertTriangle },
  BULK_EXPORT:            { label:'Bulk Export',           color:'#7c3aed', bg:'rgba(124,58,237,0.12)',  border:'rgba(124,58,237,0.25)',  Icon:Database      },
  DATA_EXPORT:            { label:'Data Export',           color:'#7c3aed', bg:'rgba(124,58,237,0.12)',  border:'rgba(124,58,237,0.25)',  Icon:Database      },
  PASSWORD_RESET:         { label:'Password Reset',        color:'#94a3b8', bg:'rgba(148,163,184,0.1)',  border:'rgba(148,163,184,0.2)',  Icon:Key           },
  API_ABUSE:              { label:'API Abuse',             color:'#ef4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.25)',   Icon:Globe         },
}

const SEVERITY_CONFIG = {
  high:   { color:'#ef4444', bg:'rgba(239,68,68,0.08)',   dot:'#ef4444',   label:'High',   rowBg:'rgba(239,68,68,0.03)'   },
  medium: { color:'#f59e0b', bg:'rgba(245,158,11,0.08)',  dot:'#f59e0b',   label:'Medium', rowBg:'rgba(245,158,11,0.03)'  },
  low:    { color:'#10b981', bg:'rgba(16,185,129,0.08)',  dot:'#10b981',   label:'Low',    rowBg:'transparent'            },
  info:   { color:'#2354F4', bg:'rgba(35,84,244,0.08)',   dot:'#2354F4',   label:'Info',   rowBg:'transparent'            },
}

function ActionBadge({ action }) {
  const c = ACTION_CONFIG[action] || { label:action.replace(/_/g,' '), color:'var(--text2)', bg:'var(--bg3)', border:'var(--border)', Icon:Activity }
  const { Icon } = c
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase', color:c.color, whiteSpace:'nowrap' }}>
      <Icon style={{ width:10, height:10, flexShrink:0 }} />
      {c.label}
    </span>
  )
}

function SeverityDot({ severity }) {
  const c = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info
  return (
    <span title={c.label} style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span
        style={{
          width:9, height:9, borderRadius:'50%', background:c.dot, flexShrink:0,
          boxShadow:`0 0 0 2px ${c.dot}25`,
        }}
      />
    </span>
  )
}

export default function ActivityLogs() {
  const [logs, setLogs]             = useState(ACTIVITY_LOGS)
  const [search, setSearch]         = useState('')
  const [severityFilter, setSeverity] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = (
      l.target.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.school.toLowerCase().includes(q) ||
      l.detail.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q)
    )
    const matchSeverity = severityFilter === 'all' || l.severity === severityFilter
    return matchSearch && matchSeverity
  })

  const counts = {
    total:    logs.length,
    high:     logs.filter(l => l.severity === 'high').length,
    bans:     logs.filter(l => l.action === 'USER_BANNED' || l.action === 'TEACHER_REMOVED').length,
    upgrades: logs.filter(l => l.action.includes('UPGRADE') || l.action === 'PLAN_UPGRADED').length,
  }

  return (
    <div className="space-y-6 fade-in">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color:'var(--text)' }}>
          <Activity className="w-7 h-7" style={{ color:'#7c3aed' }} />
          Activity Logs
        </h1>
        <p className="text-sm mt-0.5" style={{ color:'var(--text3)' }}>
          Complete audit trail of all admin and system actions on the platform
        </p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Actions',   value:counts.total,    color:'#2354F4', bg:'rgba(35,84,244,0.1)',   Icon:Activity },
          { label:'High Severity',   value:counts.high,     color:'#ef4444', bg:'rgba(239,68,68,0.1)',   Icon:AlertTriangle },
          { label:'Bans & Removals', value:counts.bans,     color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  Icon:Ban },
          { label:'Upgrades',        value:counts.upgrades, color:'#10b981', bg:'rgba(16,185,129,0.1)',  Icon:TrendingUp },
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

      {/* ── Filter Bar ── */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text3)' }} />
          <input
            type="text"
            placeholder="Search by action, actor, target, school, or detail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, paddingLeft:40, paddingRight:16, paddingTop:10, paddingBottom:10, color:'var(--text)', fontSize:'0.875rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }}
          />
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0, flexWrap:'wrap' }}>
          {[
            { key:'all',    label:'All',    color:'#2354F4',  bg:severityFilter === 'all'    ? '#2354F4' : 'transparent', textC:severityFilter === 'all'    ? '#fff' : 'var(--text3)' },
            { key:'high',   label:'High',   color:'#ef4444',  bg:severityFilter === 'high'   ? '#ef4444' : 'transparent', textC:severityFilter === 'high'   ? '#fff' : '#ef4444' },
            { key:'medium', label:'Medium', color:'#f59e0b',  bg:severityFilter === 'medium' ? '#f59e0b' : 'transparent', textC:severityFilter === 'medium' ? '#fff' : '#f59e0b' },
            { key:'low',    label:'Low',    color:'#10b981',  bg:severityFilter === 'low'    ? '#10b981' : 'transparent', textC:severityFilter === 'low'    ? '#fff' : '#10b981' },
            { key:'info',   label:'Info',   color:'#7c3aed',  bg:severityFilter === 'info'   ? '#7c3aed' : 'transparent', textC:severityFilter === 'info'   ? '#fff' : '#7c3aed' },
          ].map(chip => (
            <button
              key={chip.key}
              onClick={() => setSeverity(chip.key)}
              style={{
                padding:'5px 14px', borderRadius:20, border:`1.5px solid ${chip.color}`,
                background:chip.bg, color:chip.textC,
                fontSize:'0.72rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.4px', textTransform:'uppercase',
                fontFamily:"'DM Sans',sans-serif", transition:'all 0.18s',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Log Table ── */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--bg3)', borderBottom:'1px solid var(--border)' }}>
                {['', 'Time', 'Action', 'Actor', 'Target', 'School', 'IP'].map((h, i) => (
                  <th
                    key={h + i}
                    style={{ padding:'12px 16px', textAlign:'left', color:'var(--text3)', fontSize:'0.62rem', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', whiteSpace:'nowrap' }}
                    className={h === 'School' ? 'hidden lg:table-cell' : h === 'IP' ? 'hidden xl:table-cell' : ''}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const sev  = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info
                const isEx = expandedId === log.id

                return (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => setExpandedId(isEx ? null : log.id)}
                      style={{
                        borderBottom: isEx ? 'none' : '1px solid var(--border)',
                        background: isEx ? sev.bg : sev.rowBg,
                        cursor:'pointer',
                        transition:'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isEx) e.currentTarget.style.background = sev.bg }}
                      onMouseLeave={e => { if (!isEx) e.currentTarget.style.background = sev.rowBg }}
                    >
                      {/* Severity Dot */}
                      <td style={{ padding:'12px 10px 12px 16px', width:30 }}>
                        <SeverityDot severity={log.severity} />
                      </td>
                      {/* Time */}
                      <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                        <p style={{ color:'var(--text)', fontSize:'0.8rem', fontWeight:700 }}>{log.time}</p>
                        <p style={{ color:'var(--text3)', fontSize:'0.65rem', marginTop:1 }}>
                          {new Date(log.timestamp).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                        </p>
                      </td>
                      {/* Action Badge */}
                      <td style={{ padding:'12px 16px' }}>
                        <ActionBadge action={log.action} />
                      </td>
                      {/* Actor */}
                      <td style={{ padding:'12px 16px' }}>
                        <p style={{ color:'var(--text)', fontSize:'0.8rem', fontWeight:600, maxWidth:150, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {log.actor}
                        </p>
                      </td>
                      {/* Target */}
                      <td style={{ padding:'12px 16px' }}>
                        <div>
                          <p style={{ color:'var(--text)', fontSize:'0.8rem', fontWeight:700 }}>{log.target}</p>
                          {log.targetRole && (
                            <p style={{ color:'var(--text3)', fontSize:'0.65rem', marginTop:1, textTransform:'uppercase', letterSpacing:'0.4px', fontWeight:600 }}>{log.targetRole}</p>
                          )}
                        </div>
                      </td>
                      {/* School */}
                      <td style={{ padding:'12px 16px' }} className="hidden lg:table-cell">
                        <p style={{ color:'var(--text2)', fontSize:'0.78rem', fontWeight:600 }}>{log.school}</p>
                      </td>
                      {/* IP */}
                      <td style={{ padding:'12px 16px' }} className="hidden xl:table-cell">
                        <code style={{ color: log.ip === 'system' ? 'var(--text3)' : log.ip.startsWith('185.') || log.ip.startsWith('142.') ? '#ef4444' : 'var(--text2)', fontSize:'0.72rem', fontWeight:700, background:'var(--bg3)', padding:'2px 7px', borderRadius:6 }}>
                          {log.ip}
                        </code>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isEx && (
                      <tr key={`${log.id}-detail`} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td colSpan={7} style={{ padding:'0 16px 14px 42px', background:sev.bg }}>
                          <div style={{ padding:'12px 16px', borderRadius:12, background:'var(--card-bg)', border:`1px solid ${sev.color}25` }}>
                            <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                              <AlertTriangle style={{ width:14, height:14, color:sev.color, flexShrink:0, marginTop:1 }} />
                              <div>
                                <p style={{ color:sev.color, fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>
                                  {SEVERITY_CONFIG[log.severity]?.label} · {log.action.replace(/_/g,' ')}
                                </p>
                                <p style={{ color:'var(--text2)', fontSize:'0.82rem', lineHeight:1.6 }}>{log.detail}</p>
                                <div style={{ display:'flex', gap:16, marginTop:8, flexWrap:'wrap' }}>
                                  <span style={{ color:'var(--text3)', fontSize:'0.7rem' }}>
                                    <strong style={{ color:'var(--text2)' }}>Timestamp:</strong> {new Date(log.timestamp).toLocaleString('en-IN')}
                                  </span>
                                  <span style={{ color:'var(--text3)', fontSize:'0.7rem' }}>
                                    <strong style={{ color:'var(--text2)' }}>IP Address:</strong> {log.ip}
                                  </span>
                                  {log.targetRole && (
                                    <span style={{ color:'var(--text3)', fontSize:'0.7rem' }}>
                                      <strong style={{ color:'var(--text2)' }}>Target Role:</strong> {log.targetRole}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding:'56px 0', textAlign:'center' }}>
            <Activity className="w-8 h-8 mx-auto mb-3" style={{ color:'var(--text3)' }} />
            <p className="text-sm font-bold" style={{ color:'var(--text2)' }}>No logs match your filters</p>
            <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Try adjusting your search or severity filter</p>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg3)' }}>
            <p style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:600 }}>
              Showing {filtered.length} of {logs.length} events · Click any row to expand details
            </p>
            <div style={{ display:'flex', gap:12 }}>
              {Object.entries(SEVERITY_CONFIG).map(([key, val]) => (
                <span key={key} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.65rem', fontWeight:700, color:val.color }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:val.dot }} />
                  {val.label}: {logs.filter(l => l.severity === key).length}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
