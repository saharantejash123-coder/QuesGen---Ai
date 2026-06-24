import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, GraduationCap, BarChart3, Settings, LogOut,
  UserPlus, ClipboardList, TrendingUp, Bell, Search,
  BookOpen, Building2, Calendar, CheckCircle, Clock,
  ArrowRight, ChevronRight, Download, Plus, Filter, X,
  Trophy, Mail, Phone, MapPin, Globe, Star, Zap,
  MoreVertical, Edit2, AlertTriangle, FileText, Award,
  Activity, Target, Layers,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import AppNavbar from '../components/questra/AppNavbar';
import Footer from '../components/Footer';
import ProfilePage from './ProfilePage';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  getStudentsBySchool, getTeachersBySchool, getSchoolClasses,
  addSchoolClass, updateSchoolClass, deleteSchoolClass, getTeacherAssignments,
  assignTeacherToClasses, removeTeacherAssignment,
  getPapersBySchool, resolveSchoolName,
  getSchoolRequests, createSchoolRequest, approveSchoolRequest, rejectSchoolRequest,
  removeUserFromSchool, searchAllUsers, getOrCreateSchoolCode,
  getUserByUID, getTestSubmissions, getTestSubmissionsBySchool,
} from '../services/schoolService';

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const GREEN  = '#059669';
const BLUE   = '#2354F4';
const VIOLET = '#7C3AED';
const AMBER  = '#D97706';
const TEAL   = '#0891B2';
const RED    = '#DC2626';


/* ═══════════════════════════════════════
   SHARED UI HELPERS
═══════════════════════════════════════ */
function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: 'clamp(1.15rem,3vw,1.4rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '0.2rem' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      style={{ padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
        background: `${color}14`, border: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: '0.15rem', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</div>
      </div>
      {trend && (
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 100,
          background: `${GREEN}15`, color: GREEN,
        }}>
          {trend}
        </div>
      )}
    </motion.div>
  );
}

function Badge({ children, color = BLUE, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.5px',
      textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: 100,
      background: bg || `${color}15`, color,
      border: `1px solid ${color}25`,
    }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const isActive = status === 'active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.5px',
      padding: '0.2rem 0.6rem', borderRadius: 100,
      background: isActive ? `${GREEN}15` : `${RED}12`,
      color: isActive ? GREEN : RED,
      border: `1px solid ${isActive ? GREEN : RED}25`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function ScoreBar({ score, color = BLUE }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 5, borderRadius: 10, background: 'var(--bg3)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 10, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text2)', minWidth: 30 }}>{score}%</span>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 12, color: 'var(--text)', fontSize: '0.85rem',
          fontFamily: "'DM Sans', sans-serif", outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = BLUE}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

function EmptyState({ icon: Icon = FileText, message }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)' }}>
      <Icon size={36} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
      <p style={{ fontSize: '0.88rem' }}>{message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════ */
function OverviewTab({ user, setActiveTab }) {
  const { dark } = useTheme();
  const axisColor = dark ? '#475569' : '#94A3B8';
  const gridColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipStyle = {
    background: dark ? '#0B1220' : '#fff',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#DDE3F0'}`,
    borderRadius: 12, padding: '0.6rem 1rem',
    color: dark ? '#EEF2FF' : '#0A0F1E', fontSize: '0.8rem',
  };

  const schoolName    = user ? resolveSchoolName(user) : '';
  const realStudents  = schoolName ? getStudentsBySchool(schoolName) : [];
  const realTeachers  = schoolName ? getTeachersBySchool(schoolName) : [];
  const realClasses   = schoolName ? getSchoolClasses(schoolName) : [];
  const realPapers    = schoolName ? getPapersBySchool(schoolName) : [];

  const totalStudents = realStudents.length;
  const totalTeachers = realTeachers.length;
  const totalClasses  = realClasses.length;
  const overallAvg    = 0;
  const upcomingExams = realPapers.filter(p => p.status === 'assigned').length;

  const topStudents = realStudents.slice(0, 5).map((s, i) => ({
    id: s.id, name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email?.split('@')[0],
    class: s.className || '—', avg: 0, rank: i + 1,
  }));
  
  // Extract user's full name - combine firstName and lastName
  const fullName = user 
    ? `${user.name || ''}`.trim() || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin'
    : 'Admin';

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{
          marginBottom: '1.75rem', padding: '1.4rem 1.6rem',
          background: `linear-gradient(135deg, ${GREEN}14, ${TEAL}0a)`,
          border: `1px solid ${GREEN}22`, borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏫</span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: GREEN }}>School Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            Welcome back, {fullName}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '0.2rem' }}>
            Here's your institution overview for {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
        <button
          className="btn-p"
          onClick={() => setActiveTab('reports')}
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, boxShadow: `0 4px 20px ${GREEN}30`, fontSize: '0.82rem', padding: '0.6rem 1.2rem' }}
        >
          View Reports <ArrowRight size={13} style={{ marginLeft: 3 }} />
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
        <StatCard icon={GraduationCap} label="Total Students"  value={totalStudents}  color={BLUE}   />
        <StatCard icon={Users}         label="Total Teachers"  value={totalTeachers}  color={VIOLET} />
        <StatCard icon={Building2}     label="Classes"         value={totalClasses}   color={GREEN}  />
        <StatCard icon={ClipboardList} label="Papers Assigned" value={upcomingExams}  color={TEAL}   />
        <StatCard icon={Target}        label="Avg Performance" value="—"              color={AMBER}  />
      </div>

      {/* Charts Row */}
      {(() => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const now = new Date()
        const registrationTrend = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
          const m = d.getMonth(); const y = d.getFullYear()
          const count = realStudents.filter(s => {
            if (!s.createdAt) return false
            const sd = new Date(s.createdAt)
            return sd.getMonth() === m && sd.getFullYear() === y
          }).length
          return { month: months[m], count }
        })
        const classPerfData = realClasses.map(c => ({
          class: c.name,
          students: realStudents.filter(s => s.className === c.name).length,
        }))
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="card" style={{ padding: '1.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>New Registrations</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Students enrolled — last 6 months</div>
                </div>
                <Badge color={GREEN}>Live</Badge>
              </div>
              <ResponsiveContainer width="100%" height={180} minWidth={0}>
                <AreaChart data={registrationTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: GREEN, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="count" name="Students" stroke={GREEN} strokeWidth={2.5} fill="url(#perfGrad)" dot={{ fill: GREEN, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: GREEN }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding: '1.3rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Students per Class</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Enrollment by section</div>
              </div>
              {classPerfData.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--text3)', fontSize: '0.82rem' }}>
                  Add classes to see enrollment data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180} minWidth={0}>
                  <BarChart data={classPerfData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="class" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${BLUE}08` }} />
                    <Bar dataKey="students" name="Students" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )
      })()}

      {/* Bottom Row: Top Students + Activity + Upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

        {/* Top Students */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>🏆 Top Students</div>
            <button onClick={() => setActiveTab('students')} style={{ fontSize: '0.72rem', fontWeight: 700, color: BLUE, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>
          {topStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)', fontSize: '0.8rem' }}>
              No students registered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {topStudents.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0, fontWeight: 800,
                    fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === 0 ? `${AMBER}20` : 'var(--bg3)',
                    color: i === 0 ? AMBER : 'var(--text3)',
                    border: `1px solid ${i === 0 ? AMBER+'30' : 'var(--border)'}`,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>{s.class}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)' }}>—</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '1rem' }}>📋 Recent Activity</div>
          {realStudents.length === 0 && realPapers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)' }}>
              <Activity size={28} style={{ opacity: 0.25, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.79rem' }}>No activity yet. Register students and assign papers to see events here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                ...realStudents.slice(-3).map(s => ({
                  emoji: '👤', color: BLUE,
                  message: `${s.firstName || s.email?.split('@')[0] || 'Student'} enrolled${s.className ? ` in ${s.className}` : ''}`,
                  time: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : 'recently',
                })),
                ...realPapers.slice(-3).map(p => ({
                  emoji: '📝', color: VIOLET,
                  message: `${p.subject || 'Paper'} — ${p.paperType === 'unit_test' ? 'Unit Test' : p.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Exam'} ${p.status === 'assigned' ? 'assigned' : 'drafted'}`,
                  time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'recently',
                })),
              ].slice(0, 5).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                    background: `${a.color}12`, border: `1px solid ${a.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
                  }}>
                    {a.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.79rem', color: 'var(--text2)', lineHeight: 1.45 }}>{a.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Papers */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>📅 Assigned Papers</div>
            <button onClick={() => setActiveTab('exams')} style={{ fontSize: '0.72rem', fontWeight: 700, color: BLUE, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>
          {realPapers.filter(p => p.status === 'assigned').length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)' }}>
              <ClipboardList size={28} style={{ opacity: 0.25, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.79rem' }}>No assigned papers yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {realPapers.filter(p => p.status === 'assigned').slice(0, 4).map((paper) => (
                <div key={paper.id} style={{ padding: '0.75rem', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
                    {paper.subject} — {paper.paperType === 'unit_test' ? 'Unit Test' : paper.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Full Exam'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>📅 {paper.createdAt?.slice(0, 10) || '—'}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>📚 {paper.assignedClasses?.join(', ') || '—'}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>🏫 {paper.board || 'CBSE'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STUDENTS TAB
═══════════════════════════════════════ */
function StudentsTab({ realStudents = [], schoolClasses = [], pendingRequests = [], schoolName = '', onRefresh }) {
  const [search, setSearch]       = useState('');
  const [classFilter, setClass]   = useState('All');
  const [addQuery, setAddQuery]   = useState('');
  const [addResults, setAddResults] = useState([]);
  const [addMsg, setAddMsg]       = useState('');

  const displayStudents = realStudents.map((s, i) => ({
    id: s.id || s.email,
    name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email?.split('@')[0] || 'Student',
    class: s.className || '—',
    uid: s.uid || '—',
    status: 'active',
    email: s.email,
    raw: s,
  }));

  const classNames = ['All', ...new Set(displayStudents.map(s => s.class).filter(c => c !== '—'))];

  const filtered = useMemo(() => displayStudents.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.uid.includes(q) || s.email?.toLowerCase().includes(q);
    const matchClass  = classFilter === 'All' || s.class === classFilter;
    return matchSearch && matchClass;
  }), [search, classFilter, displayStudents]);

  const pendingStudents = pendingRequests.filter(r => r.type === 'student' && r.status === 'pending');

  const handleApprove = (reqId) => {
    approveSchoolRequest(reqId);
    onRefresh?.();
  };
  const handleReject = (reqId) => {
    rejectSchoolRequest(reqId);
    onRefresh?.();
  };
  const handleRemove = (email) => {
    if (!window.confirm('Remove this student from the school?')) return;
    removeUserFromSchool(email, schoolName, 'student');
    onRefresh?.();
  };

  const handleAddSearch = () => {
    if (addQuery.trim().length < 2) return;
    setAddResults(searchAllUsers(addQuery, 'student'));
    setAddMsg('');
  };

  const handleAddUser = (u) => {
    if (!schoolName) return;
    const res = createSchoolRequest({ type: 'student', userEmail: u.email, userName: `${u.firstName} ${u.lastName}`.trim(), userUID: u.uid || '', schoolName, message: 'Added by school admin' });
    if (res.success && res.request) approveSchoolRequest(res.request.id);
    setAddMsg(`${u.firstName} ${u.lastName} added!`);
    setAddQuery('');
    setAddResults([]);
    onRefresh?.();
  };

  return (
    <div>
      {/* Pending Requests Section */}
      {pendingStudents.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: `1px solid ${AMBER}30`, background: `${AMBER}06` }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={16} color={AMBER} /> Pending Student Requests ({pendingStudents.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {pendingStudents.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{r.userName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{r.userEmail} {r.userUID ? `· UID: ${r.userUID}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => handleApprove(r.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Approve</button>
                  <button onClick={() => handleReject(r.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: RED, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionHeader
        title="Students"
        subtitle={`${filtered.length} of ${displayStudents.length} active students`}
      />

      {/* Add by search */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.6rem' }}>Add Student by Name or UID</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <SearchBar value={addQuery} onChange={setAddQuery} placeholder="Search name, UID, or email..." />
          </div>
          <button onClick={handleAddSearch} style={{ padding: '0.55rem 1rem', borderRadius: 10, border: 'none', background: BLUE, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Search</button>
        </div>
        {addResults.length > 0 && (
          <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {addResults.slice(0, 5).map(u => (
              <div key={u.email} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.83rem', color: 'var(--text)' }}>{u.firstName} {u.lastName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)', marginLeft: 8 }}>{u.uid || 'no UID'} · {u.email}</span>
                </div>
                <button onClick={() => handleAddUser(u)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Add</button>
              </div>
            ))}
          </div>
        )}
        {addMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: GREEN, fontWeight: 700 }}>{addMsg}</div>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Filter active students..." />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {classNames.map(c => (
            <button key={c} onClick={() => setClass(c)}
              style={{
                padding: '0.5rem 0.8rem', borderRadius: 10, border: '1px solid',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                background: classFilter === c ? BLUE : 'transparent',
                color: classFilter === c ? '#fff' : 'var(--text3)',
                borderColor: classFilter === c ? BLUE : 'var(--border)',
                transition: 'all 0.15s',
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      {displayStudents.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={GraduationCap} message="No students yet. Share your school's registration code or use the search above to add students." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={GraduationCap} message="No students match your search." />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                {['Student', 'Class', 'UID', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text3)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${BLUE}14`, border: `1px solid ${BLUE}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: BLUE }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', fontWeight: 600 }}>{s.class}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{s.uid}</td>
                  <td style={{ padding: '0.85rem 1rem' }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => handleRemove(s.email)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: `1px solid ${RED}30`, background: `${RED}0a`, color: RED, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   TEACHERS TAB
═══════════════════════════════════════ */
function TeachersTab({ realTeachers = [], schoolName = '', schoolClasses = [], assignments = [], pendingRequests = [], onRefresh, setActiveTab }) {
  const [search, setSearch]           = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [saveMsg, setSaveMsg]         = useState('');
  const [addQuery, setAddQuery]       = useState('');
  const [addResults, setAddResults]   = useState([]);
  const [addMsg, setAddMsg]           = useState('');

  const displayTeachers = realTeachers.map((t, i) => {
    const assignment = assignments.find(a => a.teacherEmail === t.email?.toLowerCase());
    const colors = [BLUE, VIOLET, GREEN, AMBER, TEAL, RED];
    return {
      id: t.id || i,
      name: `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email?.split('@')[0] || 'Teacher',
      subject: t.subject || 'General',
      email: t.email,
      uid: t.uid || '—',
      classes: assignment?.classNames || [],
      status: 'active',
      initials: (`${t.firstName || ''} ${t.lastName || ''}`).trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TC',
      color: colors[i % colors.length],
    };
  });

  const filtered = useMemo(() =>
    displayTeachers.filter(t => {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.uid.includes(q) || t.email?.toLowerCase().includes(q);
    }),
    [search, displayTeachers]
  );

  const pendingTeachers = pendingRequests.filter(r => r.type === 'teacher' && r.status === 'pending');

  const openAssign = (t) => { setAssignModal(t); setSelectedClasses(t.classes || []); setSaveMsg(''); };
  const toggleClass = (cls) => setSelectedClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]);

  const saveAssignment = () => {
    if (!assignModal?.email) return;
    assignTeacherToClasses(assignModal.email, schoolName, selectedClasses);
    setSaveMsg('Saved!');
    setTimeout(() => { setAssignModal(null); setSaveMsg(''); onRefresh?.(); }, 1200);
  };

  const handleApprove = (reqId) => { approveSchoolRequest(reqId); onRefresh?.(); };
  const handleReject  = (reqId) => { rejectSchoolRequest(reqId);  onRefresh?.(); };
  const handleRemove  = (email) => {
    if (!window.confirm('Remove this teacher from the school?')) return;
    removeUserFromSchool(email, schoolName, 'teacher');
    onRefresh?.();
  };

  const handleAddSearch = () => {
    if (addQuery.trim().length < 2) return;
    setAddResults(searchAllUsers(addQuery, 'teacher'));
    setAddMsg('');
  };
  const handleAddUser = (u) => {
    if (!schoolName) return;
    const res = createSchoolRequest({ type: 'teacher', userEmail: u.email, userName: `${u.firstName} ${u.lastName}`.trim(), userUID: u.uid || '', schoolName, message: 'Added by school admin' });
    if (res.success && res.request) approveSchoolRequest(res.request.id);
    setAddMsg(`${u.firstName} ${u.lastName} added!`);
    setAddQuery('');
    setAddResults([]);
    onRefresh?.();
  };

  const availableClasses = schoolClasses.map(c => c.name);

  return (
    <div>
      {/* Assignment modal */}
      <AnimatePresence>
        {assignModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setAssignModal(null); }}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card" style={{ width: '100%', maxWidth: 460, padding: '1.75rem', zIndex: 201 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Assign Classes</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{assignModal.name} · {assignModal.subject}</div>
                </div>
                <button onClick={() => setAssignModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '0.3rem' }}><X size={18} /></button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1rem' }}>Select classes this teacher will manage. Students in those classes will see their assigned papers.</p>
              {availableClasses.length === 0 ? (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '0.6rem' }}>No classes defined yet. Create classes first, then come back to assign them.</p>
                  <button onClick={() => { setAssignModal(null); setActiveTab?.('classes'); }}
                    style={{ padding: '0.5rem 1rem', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${GREEN},${TEAL})`, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Go to Classes Tab →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {availableClasses.map(cls => {
                    const active = selectedClasses.includes(cls);
                    return (
                      <button key={cls} onClick={() => toggleClass(cls)}
                        style={{ padding: '0.45rem 0.85rem', borderRadius: 10, border: '1px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: active ? `${GREEN}14` : 'var(--bg3)', color: active ? GREEN : 'var(--text3)', borderColor: active ? GREEN : 'var(--border)', transition: 'all 0.15s' }}>
                        {active && <CheckCircle size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />}{cls}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedClasses.length > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '1rem' }}>Assigned: <strong style={{ color: GREEN }}>{selectedClasses.join(', ')}</strong></div>}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {saveMsg ? (
                  <div style={{ flex: 1, textAlign: 'center', padding: '0.7rem', borderRadius: 12, background: `${GREEN}14`, color: GREEN, fontWeight: 700, fontSize: '0.85rem' }}>✅ {saveMsg}</div>
                ) : (
                  <>
                    <button onClick={() => setAssignModal(null)} style={{ flex: 1, padding: '0.65rem', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                    <button onClick={saveAssignment} style={{ flex: 2, padding: '0.65rem', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${GREEN},${TEAL})`, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Save Assignment</button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Requests Section */}
      {pendingTeachers.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: `1px solid ${AMBER}30`, background: `${AMBER}06` }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={16} color={AMBER} /> Pending Teacher Requests ({pendingTeachers.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {pendingTeachers.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{r.userName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{r.userEmail} {r.userUID ? `· UID: ${r.userUID}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => handleApprove(r.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Approve</button>
                  <button onClick={() => handleReject(r.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: RED, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title="Teachers" subtitle={`${displayTeachers.length} active faculty members`} />

      {/* Add by search */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.6rem' }}>Add Teacher by Name or UID</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <SearchBar value={addQuery} onChange={setAddQuery} placeholder="Search name, UID, or email..." />
          </div>
          <button onClick={handleAddSearch} style={{ padding: '0.55rem 1rem', borderRadius: 10, border: 'none', background: BLUE, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Search</button>
        </div>
        {addResults.length > 0 && (
          <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {addResults.slice(0, 5).map(u => (
              <div key={u.email} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.83rem', color: 'var(--text)' }}>{u.firstName} {u.lastName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)', marginLeft: 8 }}>{u.uid || 'no UID'} · {u.email}</span>
                </div>
                <button onClick={() => handleAddUser(u)} style={{ padding: '0.3rem 0.65rem', borderRadius: 7, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Add</button>
              </div>
            ))}
          </div>
        )}
        {addMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: GREEN, fontWeight: 700 }}>{addMsg}</div>}
      </div>

      <div style={{ marginBottom: '1.25rem', maxWidth: 360 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Filter active teachers..." />
      </div>

      {displayTeachers.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={Users} message="No teachers yet. Use the search above to add teachers or share your school's registration code." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(t => (
            <motion.div key={t.id} className="card" style={{ padding: '1.3rem' }} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', marginBottom: '1rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg, ${t.color}22, ${t.color}0a)`, border: `1px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: t.color }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{t.name}</div>
                  <Badge color={t.color}>{t.subject}</Badge>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.75rem' }}>UID: {t.uid}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, padding: '0.6rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{t.classes.length}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classes</div>
                </div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.4rem' }}>Assigned Classes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {t.classes.length === 0
                    ? <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>None assigned</span>
                    : t.classes.map(c => (
                        <span key={c} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{c}</span>
                      ))
                  }
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border2)' }}>
                <button onClick={() => openAssign(t)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.5rem', borderRadius: 10, border: `1px solid ${GREEN}30`, background: `${GREEN}0a`, color: GREEN, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  <Edit2 size={13} /> Assign Classes
                </button>
                <button onClick={() => handleRemove(t.email)} style={{ padding: '0.5rem 0.7rem', borderRadius: 10, border: `1px solid ${RED}30`, background: `${RED}0a`, color: RED, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CLASSES TAB
═══════════════════════════════════════ */
const SUBJECTS_LIST = [
  'Mathematics','Physics','Chemistry','Biology','Science',
  'English','Hindi','Social Science','History','Geography',
  'Computer Science','Accountancy','Economics','Business Studies',
  'Physical Education','Sanskrit','EVS','Political Science',
];
const BOARDS_LIST   = ['CBSE','ICSE','RBSE','State Board','UP Board','MP Board','Maharashtra','Karnataka'];
const STREAMS_LIST  = ['Science','Commerce','Humanities','General'];
const EMPTY_CLASS   = { grade: '10', section: 'A', board: 'CBSE', subject: 'Mathematics', stream: 'General' };

function ClassFormModal({ title, initial, onSave, onClose, existingNames = [] }) {
  const [form, setForm] = useState({ ...EMPTY_CLASS, ...initial });
  const set = f => v => setForm(p => ({ ...p, [f]: v }));
  const name = `${form.grade}-${form.section}`;
  const isHighSchool = parseInt(form.grade, 10) >= 11;

  const fld = { width:'100%', padding:'0.6rem 0.85rem', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:'0.85rem', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.68rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', marginBottom:'0.4rem' };

  const handleSave = () => {
    if (!form.grade || !form.section) return;
    const isDup = !initial?.id && existingNames.includes(name);
    if (isDup) { alert(`Class ${name} already exists.`); return; }
    onSave({ ...form, name });
    onClose();
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
        className="card" style={{ width:'100%', maxWidth:420, padding:'1.75rem', zIndex:201, maxHeight:'90vh', overflowY:'auto' }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}><X size={18} /></button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem', marginBottom:'1.25rem' }}>
          {/* Grade + Section */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
            <div>
              <label style={lbl}>Grade / Class</label>
              <select value={form.grade} onChange={e => set('grade')(e.target.value)} style={fld}>
                {['10','12'].map(g => <option key={g} value={g}>Class {g}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Section</label>
              <select value={form.section} onChange={e => set('section')(e.target.value)} style={fld}>
                {['A','B','C','D','E','F'].map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>

          {/* Board */}
          <div>
            <label style={lbl}>Board</label>
            <select value={form.board} onChange={e => set('board')(e.target.value)} style={fld}>
              {BOARDS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={lbl}>Subject</label>
            <select value={form.subject} onChange={e => set('subject')(e.target.value)} style={fld}>
              {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Stream — relevant for 11 & 12 */}
          <div>
            <label style={lbl}>Stream {!isHighSchool && <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional for class {form.grade})</span>}</label>
            <select value={form.stream} onChange={e => set('stream')(e.target.value)} style={fld}>
              {STREAMS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div style={{ padding:'0.65rem 0.85rem', borderRadius:10, background:`${GREEN}08`, border:`1px solid ${GREEN}20`, marginBottom:'1rem', fontSize:'0.82rem', color:'var(--text2)' }}>
          <strong>Class:</strong> {name} &nbsp;·&nbsp; <strong>Subject:</strong> {form.subject} &nbsp;·&nbsp; <strong>Board:</strong> {form.board}
          {isHighSchool && <span> &nbsp;·&nbsp; <strong>Stream:</strong> {form.stream}</span>}
        </div>

        <button onClick={handleSave}
          style={{ width:'100%', padding:'0.75rem', borderRadius:12, border:'none', background:`linear-gradient(135deg,${GREEN},${TEAL})`, color:'#fff', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
          {initial?.id ? `Save Changes` : `Create Class ${name}`}
        </button>
      </motion.div>
    </motion.div>
  );
}

function ClassesTab({ setActiveTab, schoolName = '', realStudents = [] }) {
  const [localClasses, setLocalClasses] = useState([]);
  const [addOpen, setAddOpen]           = useState(false);
  const [editTarget, setEditTarget]     = useState(null); // class object being edited

  const reload = () => setLocalClasses(getSchoolClasses(schoolName));

  useEffect(() => { reload(); }, [schoolName]);

  const handleAdd = (form) => {
    addSchoolClass({ ...form, schoolName });
    reload();
  };

  const handleEdit = (form) => {
    updateSchoolClass(editTarget.id, form);
    reload();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this class? Students in it will become unclassified.')) return;
    deleteSchoolClass(id);
    reload();
  };

  const existingNames = localClasses.map(c => c.name);

  const displayClasses = localClasses.map((c, i) => {
    const colors = [BLUE, VIOLET, GREEN, AMBER, TEAL, RED];
    return { ...c, studentCount: realStudents.filter(s => s.className === c.name).length, color: colors[i % colors.length] };
  });

  return (
    <div>
      <AnimatePresence>
        {addOpen && (
          <ClassFormModal
            title="Add New Class"
            initial={EMPTY_CLASS}
            existingNames={existingNames}
            onSave={handleAdd}
            onClose={() => setAddOpen(false)}
          />
        )}
        {editTarget && (
          <ClassFormModal
            title={`Edit Class ${editTarget.name}`}
            initial={editTarget}
            existingNames={existingNames}
            onSave={handleEdit}
            onClose={() => setEditTarget(null)}
          />
        )}
      </AnimatePresence>

      <SectionHeader
        title="Classes & Sections"
        subtitle={`${displayClasses.length} active section${displayClasses.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-p"
            style={{ fontSize:'0.82rem', padding:'0.55rem 1.1rem', background:`linear-gradient(135deg,${GREEN},${TEAL})`, boxShadow:`0 4px 16px ${GREEN}30` }}>
            <Plus size={14} style={{ marginRight:5 }} /> Add Class
          </button>
        }
      />

      {displayClasses.length === 0 && (
        <div className="card" style={{ padding:'1rem' }}>
          <EmptyState icon={Building2} message='No classes created yet. Click "Add Class" to define your first class and subject.' />
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px, 1fr))', gap:'1rem' }}>
        {displayClasses.map(cls => (
          <motion.div key={cls.id} className="card" style={{ padding:0, overflow:'hidden' }} whileHover={{ y:-4 }} transition={{ duration:0.22 }}>
            {/* Colour bar */}
            <div style={{ height:5, background:`linear-gradient(90deg,${cls.color},${cls.color}88)` }} />
            <div style={{ padding:'1.2rem' }}>
              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.85rem' }}>
                <div>
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color:'var(--text)', letterSpacing:'-0.5px', lineHeight:1 }}>Class {cls.name}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text3)', marginTop:'0.25rem' }}>
                    {cls.board}{cls.stream && cls.stream !== 'General' ? ` · ${cls.stream}` : ''}
                  </div>
                </div>
                <Badge color={cls.color}>{(cls.subject || 'Gen').slice(0,4)}</Badge>
              </div>

              {/* Subject pill */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.3rem 0.7rem', borderRadius:8, background:`${cls.color}12`, border:`1px solid ${cls.color}25`, marginBottom:'0.85rem' }}>
                <BookOpen size={11} color={cls.color} />
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:cls.color }}>{cls.subject || 'General'}</span>
              </div>

              {/* Stats */}
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.85rem' }}>
                <div style={{ flex:1, padding:'0.6rem', background:'var(--bg3)', borderRadius:10, border:'1px solid var(--border2)', textAlign:'center' }}>
                  <div style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--text)' }}>{cls.studentCount}</div>
                  <div style={{ fontSize:'0.58rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Students</div>
                </div>
                <div style={{ flex:1, padding:'0.6rem', background:'var(--bg3)', borderRadius:10, border:'1px solid var(--border2)', textAlign:'center' }}>
                  <div style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--text)' }}>0%</div>
                  <div style={{ fontSize:'0.58rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Avg Score</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:'0.4rem', paddingTop:'0.75rem', borderTop:'1px solid var(--border2)' }}>
                <button onClick={() => setEditTarget(cls)}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', padding:'0.5rem', borderRadius:10, border:`1px solid ${BLUE}28`, background:`${BLUE}0a`, color:BLUE, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(cls.id)}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', padding:'0.5rem', borderRadius:10, border:`1px solid ${RED}28`, background:`${RED}0a`, color:RED, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                  <X size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EXAMS TAB
═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   TEST RESULTS TAB
═══════════════════════════════════════ */
function TestResultsTab({ schoolName = '' }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [filterClass, setFilterClass] = useState('all');

  const allPapers = getPapersBySchool(schoolName).filter(p => p.status === 'assigned');
  const classes = [...new Set(allPapers.flatMap(p => p.assignedClasses || []))].sort();

  const filteredPapers = filterClass === 'all'
    ? allPapers
    : allPapers.filter(p => p.assignedClasses?.includes(filterClass));

  const papersWithStats = filteredPapers.map(p => {
    const subs = getTestSubmissions(p.id);
    const totalQs = (p.sections || []).reduce((s, sec) => s + (sec.questions?.length || 0), 0);
    const avgPct = subs.length > 0
      ? Math.round(subs.reduce((s, r) => s + (r.percentage || 0), 0) / subs.length)
      : null;
    return { ...p, subs, totalQs, avgPct };
  });

  return (
    <div>
      <SectionHeader
        title="Test Results"
        subtitle={`MCQ tests submitted by students · ${papersWithStats.reduce((s, p) => s + p.subs.length, 0)} total submissions`}
      />

      {/* Class filter */}
      {classes.length > 0 && (
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {['all', ...classes].map(cls => (
            <button key={cls} onClick={() => setFilterClass(cls)}
              style={{
                padding: '.35rem .85rem', borderRadius: 20, border: `1px solid ${filterClass === cls ? GREEN : 'var(--border)'}`,
                background: filterClass === cls ? `${GREEN}14` : 'var(--bg3)',
                color: filterClass === cls ? GREEN : 'var(--text3)', fontSize: '.76rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {cls === 'all' ? 'All Classes' : cls}
            </button>
          ))}
        </div>
      )}

      {papersWithStats.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={FileText} message="No assigned MCQ tests found. Papers must be assigned by teachers to appear here." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {papersWithStats.map(p => {
            const isOpen = selectedPaper === p.id;
            const barColor = p.avgPct === null ? TEAL : p.avgPct >= 75 ? GREEN : p.avgPct >= 45 ? AMBER : RED;
            return (
              <motion.div key={p.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Paper header */}
                <div
                  style={{ padding: '1rem 1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}
                  onClick={() => setSelectedPaper(isOpen ? null : p.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.3rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '.92rem', color: 'var(--text)' }}>
                        {p.subject} — {p.paperType === 'quick_quiz' ? 'Quick Quiz' : p.paperType === 'unit_test' ? 'Unit Test' : 'Exam'}
                      </span>
                      <Badge color={VIOLET}>{p.assignedClasses?.join(', ')}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                        👤 {p.teacherName || 'Teacher'} · 📋 {p.totalQs} Qs · {p.totalMarks} marks
                      </span>
                      <span style={{ fontSize: '.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                        📅 {p.createdAt?.slice(0, 10) || '—'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800, color: BLUE, lineHeight: 1 }}>{p.subs.length}</p>
                      <p style={{ fontSize: '.65rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Submitted</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800, color: barColor, lineHeight: 1 }}>
                        {p.avgPct !== null ? `${p.avgPct}%` : '—'}
                      </p>
                      <p style={{ fontSize: '.65rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Score</p>
                    </div>
                    <ChevronRight size={18} color="var(--text3)" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
                  </div>
                </div>

                {/* Expanded: per-student results */}
                {isOpen && (
                  <div style={{ padding: '0 1.2rem 1.2rem', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.4px', margin: '.85rem 0 .5rem' }}>
                      Student Results ({p.subs.length})
                    </p>
                    {p.subs.length === 0 ? (
                      <p style={{ fontSize: '.82rem', color: 'var(--text3)', padding: '.75rem 0' }}>No submissions yet for this test.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        {p.subs.sort((a, b) => b.percentage - a.percentage).map((sub, i) => {
                          const pct = sub.percentage || 0;
                          const col = pct >= 75 ? GREEN : pct >= 45 ? AMBER : RED;
                          return (
                            <div key={i} style={{ padding: '.75rem .9rem', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.35rem' }}>
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: '.86rem', color: 'var(--text)' }}>
                                    <span style={{ fontSize: '.7rem', color: 'var(--text3)', marginRight: '.3rem' }}>#{i + 1}</span>
                                    {sub.studentName || sub.studentEmail}
                                  </p>
                                  <p style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '.15rem' }}>
                                    {new Date(sub.submittedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                  <p style={{ fontWeight: 800, fontSize: '.92rem', color: col }}>{sub.score}/{sub.total}</p>
                                  <p style={{ fontSize: '.72rem', fontWeight: 700, color: col }}>{pct}%</p>
                                </div>
                              </div>
                              <ScoreBar score={pct} color={col} />
                              {sub.aiFeedback && (
                                <div style={{ marginTop: '.5rem', padding: '.5rem .65rem', borderRadius: 8, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)' }}>
                                  <p style={{ fontSize: '.72rem', color: '#7C3AED', fontWeight: 700, marginBottom: '.15rem' }}>✨ AI Feedback</p>
                                  <p style={{ fontSize: '.75rem', color: 'var(--text3)', lineHeight: 1.55 }}>{sub.aiFeedback}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExamsTab({ schoolName = '' }) {
  const [view, setView] = useState('assigned');

  // Real papers from teachers in this school
  const realPapers = getPapersBySchool(schoolName).map(p => ({
    id: p.id,
    title: `${p.subject} — ${p.paperType === 'unit_test' ? 'Unit Test' : p.paperType === 'quick_quiz' ? 'Quick Quiz' : 'Examination'}`,
    class: p.assignedClasses?.join(', ') || p.class || '—',
    date: p.createdAt?.slice(0, 10) || '—',
    status: p.status === 'assigned' ? 'assigned' : 'draft',
    duration: p.timeMinutes ? `${Math.floor(p.timeMinutes / 60)} hr${p.timeMinutes >= 120 ? 's' : ''}` : '—',
    teacher: p.teacherName || '—',
    subject: p.subject || '—',
    totalMarks: p.totalMarks || 0,
  }));

  const displayExams = realPapers;
  const statusValues = ['assigned', 'draft'];
  const filtered = displayExams.filter(e => e.status === view);

  const statusIcon = (status) => status === 'assigned'
    ? <CheckCircle size={14} color={GREEN} />
    : <Clock size={14} color={AMBER} />;

  return (
    <div>
      <SectionHeader
        title="Examinations & Papers"
        subtitle={`${realPapers.filter(p => p.status === 'assigned').length} assigned · ${realPapers.filter(p => p.status === 'draft').length} drafts`}
        action={
          <button className="btn-p" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem', background: `linear-gradient(135deg,${GREEN},${TEAL})`, boxShadow: `0 4px 16px ${GREEN}30` }}>
            <Plus size={14} style={{ marginRight: 5 }} /> Schedule Exam
          </button>
        }
      />

      {/* Toggle */}
      <div style={{
        display: 'inline-flex', background: 'var(--bg3)', borderRadius: 12,
        border: '1px solid var(--border)', padding: '0.2rem', gap: '0.15rem', marginBottom: '1.25rem',
      }}>
        {statusValues.map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '0.45rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              background: view === v ? 'var(--card-bg)' : 'transparent',
              color: view === v ? BLUE : 'var(--text3)',
              boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.18s',
              textTransform: 'capitalize',
            }}
          >
            {v === 'assigned' ? '✅ Assigned' : '📝 Drafts'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={Calendar} message="No exams in this category." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {filtered.map(exam => (
                <motion.div key={exam.id} className="card" style={{ padding: '1.1rem 1.25rem', marginBottom: '0.7rem' }} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        {statusIcon(exam.status)}
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{exam.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                          <Calendar size={12} /> {exam.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                          <Clock size={12} /> {exam.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                          <GraduationCap size={12} /> {exam.class}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>
                          <Users size={12} /> {exam.teacher}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <Badge color={VIOLET}>{exam.subject}</Badge>
                      {exam.status === 'assigned' && (
                        <button style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.35rem 0.7rem', borderRadius: 9, border: '1px solid var(--border)',
                          background: 'var(--bg3)', color: 'var(--text3)', fontSize: '0.7rem', fontWeight: 700,
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>
                          <Download size={12} /> Export
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   REPORTS TAB
═══════════════════════════════════════ */
function ReportsTab({ students = [], teachers = [], classes = [], papers = [] }) {
  const { dark } = useTheme();
  const axisColor = dark ? '#475569' : '#94A3B8';
  const gridColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipStyle = {
    background: dark ? '#0B1220' : '#fff',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#DDE3F0'}`,
    borderRadius: 12, padding: '0.6rem 1rem',
    color: dark ? '#EEF2FF' : '#0A0F1E', fontSize: '0.8rem',
  };

  // Real monthly registration trend (last 6 months)
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const regTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const m = d.getMonth(); const y = d.getFullYear();
    const count = students.filter(s => {
      if (!s.createdAt) return false;
      const sd = new Date(s.createdAt);
      return sd.getMonth() === m && sd.getFullYear() === y;
    }).length;
    return { month: MONTH_NAMES[m], count };
  });

  // Students per class
  const classDist = classes.map(c => ({
    class: c.name,
    students: students.filter(s => s.className === c.name).length,
  }));

  // Papers per subject
  const subjectMap = {};
  const COLORS_LIST = [BLUE, VIOLET, GREEN, AMBER, TEAL, RED];
  papers.forEach(p => {
    if (!p.subject) return;
    subjectMap[p.subject] = (subjectMap[p.subject] || 0) + 1;
  });
  const subjectPerf = Object.entries(subjectMap).map(([subject, count], i) => ({
    subject, count,
    pct: Math.min(100, count * 20),
    color: COLORS_LIST[i % COLORS_LIST.length],
  }));

  const assignedPapers = papers.filter(p => p.status === 'assigned').length;
  const totalQ = papers.reduce((s, p) =>
    s + (p.sections || []).reduce((ss, sec) => ss + (sec.questions?.length || 0), 0), 0);

  return (
    <div>
      <SectionHeader
        title="Performance Reports"
        subtitle={`${students.length} students · ${papers.length} papers · ${classes.length} classes`}
        action={
          <button className="btn-g" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}>
            <Download size={14} style={{ marginRight: 5 }} /> Export PDF
          </button>
        }
      />

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Students',    value: students.length,    icon: GraduationCap,  color: BLUE  },
          { label: 'Total Teachers',    value: teachers.length,    icon: Users,          color: VIOLET },
          { label: 'Papers Created',    value: papers.length,      icon: ClipboardList,  color: GREEN },
          { label: 'Questions in DB',   value: totalQ,             icon: BookOpen,       color: AMBER },
          { label: 'Papers Assigned',   value: assignedPapers,     icon: CheckCircle,    color: TEAL  },
        ].map(k => (
          <StatCard key={k.label} icon={k.icon} label={k.label} value={k.value} color={k.color} />
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>

        {/* Registration Trend */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Student Registrations</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Monthly enrollments — last 6 months</div>
          <ResponsiveContainer width="100%" height={200} minWidth={0}>
            <AreaChart data={regTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" name="Students" stroke={GREEN} strokeWidth={2.5} fill="url(#rptGrad)" dot={{ fill: GREEN, r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Class Enrollment</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Students per section</div>
          {classDist.length === 0 ? (
            <EmptyState icon={Building2} message="Add classes to see enrollment breakdown." />
          ) : (
            <ResponsiveContainer width="100%" height={200} minWidth={0}>
              <BarChart data={classDist} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="class" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${BLUE}08` }} />
                <Bar dataKey="students" name="Students" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Subject-wise paper breakdown */}
      <div className="card" style={{ padding: '1.3rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Subject-Wise Papers</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Papers created per subject</div>
        {subjectPerf.length === 0 ? (
          <EmptyState icon={BookOpen} message="No papers created yet. Teachers can generate papers in Studio-Q." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {subjectPerf.map(s => (
              <div key={s.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>{s.subject}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: s.color }}>{s.count} paper{s.count !== 1 ? 's' : ''}</span>
                </div>
                <ScoreBar score={s.pct} color={s.color} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════ */
function SettingsTab({ user }) {
  const realSchool = user ? resolveSchoolName(user) : '';
  const [schoolName, setSchoolName] = useState(realSchool || "My School");
  const [regCode] = useState(() => realSchool ? getOrCreateSchoolCode(realSchool) : '—');
  const [codeCopied, setCodeCopied] = useState(false);
  const copyCode = () => {
    if (regCode && regCode !== '—') {
      navigator.clipboard.writeText(regCode).then(() => { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); });
    }
  };
  const [board, setBoard]           = useState('CBSE');
  const [address, setAddress]       = useState('');
  const [phone, setPhone]           = useState('');
  const [website, setWebsite]       = useState('');
  const [saved, setSaved]           = useState(false);

  const fieldStyle = {
    width: '100%', padding: '0.65rem 1rem',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 12, color: 'var(--text)', fontSize: '0.88rem',
    fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: 'var(--text3)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.4rem',
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Manage your school portal configuration" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>

        {/* School Profile */}
        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${GREEN}14`, border: `1px solid ${GREEN}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} color={GREEN} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>School Profile</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>School Name</label>
              <input value={schoolName} onChange={e => setSchoolName(e.target.value)} style={fieldStyle}
                onFocus={e => e.target.style.borderColor = GREEN}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Board</label>
              <select value={board} onChange={e => setBoard(e.target.value)} style={fieldStyle}>
                {['CBSE','ICSE','State Board','IB','Cambridge'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)}
                style={{ ...fieldStyle, resize: 'vertical', minHeight: 70 }}
                onFocus={e => e.target.style.borderColor = GREEN}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div className="r2">
              <div>
                <label style={labelStyle}>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <input value={website} onChange={e => setWebsite(e.target.value)} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
          </div>
          <motion.button
            className="btn-p"
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '1.25rem', width: '100%', justifyContent: 'center',
              background: saved ? `linear-gradient(135deg,${GREEN},${TEAL})` : undefined,
              boxShadow: saved ? `0 4px 16px ${GREEN}30` : undefined,
            }}
          >
            {saved ? '✅ Saved!' : 'Save Changes'}
          </motion.button>

          {/* Registration Code */}
          <div style={{ marginTop: '1rem', padding: '0.9rem', background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderRadius: 12 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>School Registration Code</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '1.3rem', color: TEAL, letterSpacing: '0.15em', flex: 1 }}>{regCode}</div>
              <button onClick={copyCode} style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: `1px solid ${TEAL}30`, background: codeCopied ? `${GREEN}14` : `${TEAL}14`, color: codeCopied ? GREEN : TEAL, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                {codeCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: '0.4rem' }}>Share this code with teachers and students to let them request to join your school.</div>
          </div>
        </div>

        {/* Account & Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Admin account */}
          <div className="card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${BLUE}14`, border: `1px solid ${BLUE}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} color={BLUE} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Admin Account</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem', background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#fff', fontSize: '0.9rem',
              }}>
                {((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'SA'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'School Admin'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{user?.email || 'school@questra.com'}</div>
              </div>
              <Badge color={GREEN} style={{ marginLeft: 'auto' }}>School Admin</Badge>
            </div>
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${AMBER}14`, border: `1px solid ${AMBER}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={16} color={AMBER} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Notifications</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Exam scheduled',        desc: 'Alert when a new exam is created', on: true  },
                { label: 'Student enrolment',     desc: 'New student joins the school',      on: true  },
                { label: 'Monthly reports',       desc: 'Auto-generated performance digest', on: true  },
                { label: 'Teacher activity',      desc: 'Track teacher paper submissions',   on: false },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{n.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>{n.desc}</div>
                  </div>
                  <div style={{
                    width: 40, height: 22, borderRadius: 100, flexShrink: 0, cursor: 'pointer', transition: 'background 0.2s',
                    background: n.on ? GREEN : 'var(--bg3)', border: `1px solid ${n.on ? GREEN : 'var(--border)'}`,
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: '50%', transform: `translate(${n.on ? '20px' : '2px'}, -50%)`,
                      transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${VIOLET}14`, border: `1px solid ${VIOLET}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} color={VIOLET} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Platform Info</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'School Name', value: realSchool || 'My School' },
                { label: 'Plan',        value: 'QuesGen Pro' },
                { label: 'Admin Email', value: user?.email || '—' },
                { label: 'Valid Until', value: 'March 2027' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.9rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCHOOL PORTAL FOOTER
═══════════════════════════════════════ */
function SchoolPortalFooter() {
  return (
    <footer style={{
      background: 'var(--footer-bg)',
      borderTop: '1px solid var(--footer-border)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '1.5rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img src="/logo.png" alt="QuesGen" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--footer-logo-text)' }}>QuesGen School Portal</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--footer-text3)', letterSpacing: '0.5px' }}>Empowering institutions with AI</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Support', to: '/' },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{ fontSize: '0.72rem', color: 'var(--footer-text3)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = GREEN}
              onMouseLeave={e => e.target.style.color = 'var(--footer-text3)'}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--footer-text3)' }}>
          © 2026 QuesGen · v2.0.0
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   MAIN SCHOOL DASHBOARD
═══════════════════════════════════════ */
function readSchoolUser() {
  try {
    const data = localStorage.getItem('questra_user');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function readSchoolData(u) {
  if (!u) return { students: [], teachers: [], classes: [], assignments: [], papers: [], requests: [] };
  const sName = resolveSchoolName(u);
  if (!sName) return { students: [], teachers: [], classes: [], assignments: [], papers: [], requests: [] };
  return {
    students:    getStudentsBySchool(sName),
    teachers:    getTeachersBySchool(sName),
    classes:     getSchoolClasses(sName),
    assignments: getTeacherAssignments(sName),
    papers:      getPapersBySchool(sName),
    requests:    getSchoolRequests(sName),
  };
}

export default function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser]           = useState(readSchoolUser);           // synchronous — no white screen
  const [schoolData, setSchoolData] = useState(() => readSchoolData(readSchoolUser()));
  const navigate = useNavigate();

  // Redirect if no session (edge case: token was cleared externally)
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const loadSchoolData = (u) => {
    setSchoolData(readSchoolData(u));
  };

  const handleRefresh = () => {
    if (user) loadSchoolData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    window.location.replace('/login');
  };

  const navUser = user ? {
    name:     `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    initials: ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || 'SA',
    email:    user.email,
  } : null;

  const schoolName = user ? resolveSchoolName(user) : '';

  const tabs = {
    overview: <OverviewTab user={{ ...navUser, ...user }} setActiveTab={setActiveTab} />,
    students: <StudentsTab realStudents={schoolData.students} schoolClasses={schoolData.classes} pendingRequests={schoolData.requests} schoolName={schoolName} onRefresh={handleRefresh} />,
    teachers: <TeachersTab realTeachers={schoolData.teachers} schoolName={schoolName} schoolClasses={schoolData.classes} assignments={schoolData.assignments} pendingRequests={schoolData.requests} onRefresh={handleRefresh} setActiveTab={setActiveTab} />,
    classes:  <ClassesTab setActiveTab={setActiveTab} schoolName={schoolName} realStudents={schoolData.students} />,
    exams:       <ExamsTab schoolName={schoolName} />,
    testresults: <TestResultsTab schoolName={schoolName} />,
    reports:     <ReportsTab students={schoolData.students} teachers={schoolData.teachers} classes={schoolData.classes} papers={schoolData.papers} />,
    settings: <SettingsTab user={user} />,
    profile:  <ProfilePage user={{ ...user, name: `${user?.firstName||''} ${user?.lastName||''}`.trim() }} onUpdate={u => { setUser(u); localStorage.setItem('questra_user', JSON.stringify(u)); }} role="school" setActiveTab={setActiveTab} />,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <AppNavbar
        role="school"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={navUser}
        onLogout={handleLogout}
      />

      {/* ── Main Content ── */}
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '5.5rem 1.25rem 2.5rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {tabs[activeTab] || tabs.overview}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <SchoolPortalFooter />

    </div>
  );
}
