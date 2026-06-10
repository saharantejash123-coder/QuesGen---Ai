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
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks/useIsMobile';

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
   MOCK DATA
═══════════════════════════════════════ */
const MOCK_STUDENTS = [
  { id: 1,  name: 'Arjun Sharma',    class: '10-A', roll: 'A001', avg: 87, rank: 2,  status: 'active',   stream: 'Science'   },
  { id: 2,  name: 'Priya Patel',     class: '10-A', roll: 'A002', avg: 94, rank: 1,  status: 'active',   stream: 'Science'   },
  { id: 3,  name: 'Rohit Verma',     class: '10-B', roll: 'B001', avg: 72, rank: 3,  status: 'active',   stream: 'Commerce'  },
  { id: 4,  name: 'Sneha Gupta',     class: '10-B', roll: 'B002', avg: 68, rank: 5,  status: 'inactive', stream: 'Commerce'  },
  { id: 5,  name: 'Amit Tiwari',     class: '11-A', roll: 'C001', avg: 91, rank: 1,  status: 'active',   stream: 'Science'   },
  { id: 6,  name: 'Pooja Singh',     class: '11-A', roll: 'C002', avg: 83, rank: 2,  status: 'active',   stream: 'Science'   },
  { id: 7,  name: 'Karan Mehta',     class: '11-B', roll: 'D001', avg: 76, rank: 1,  status: 'active',   stream: 'Commerce'  },
  { id: 8,  name: 'Neha Joshi',      class: '11-B', roll: 'D002', avg: 89, rank: 1,  status: 'active',   stream: 'Commerce'  },
  { id: 9,  name: 'Vikas Kumar',     class: '12-A', roll: 'E001', avg: 79, rank: 3,  status: 'active',   stream: 'Science'   },
  { id: 10, name: 'Anita Rao',       class: '12-A', roll: 'E002', avg: 95, rank: 1,  status: 'active',   stream: 'Science'   },
  { id: 11, name: 'Sanjay Gupta',    class: '12-B', roll: 'F001', avg: 66, rank: 5,  status: 'active',   stream: 'Humanities'},
  { id: 12, name: 'Ritu Sharma',     class: '12-B', roll: 'F002', avg: 88, rank: 2,  status: 'active',   stream: 'Humanities'},
];

const MOCK_TEACHERS = [
  { id: 1, name: 'Dr. Ramesh Kumar',   subject: 'Mathematics',    classes: ['10-A','10-B','11-A'],           tests: 12, status: 'active',   initials: 'RK', color: BLUE,   email: 'ramesh@school.edu'  },
  { id: 2, name: 'Mrs. Sunita Sharma', subject: 'Physics',        classes: ['11-A','11-B','12-A'],           tests: 8,  status: 'active',   initials: 'SS', color: VIOLET, email: 'sunita@school.edu'  },
  { id: 3, name: 'Mr. Arun Mehta',     subject: 'Chemistry',      classes: ['10-A','12-A','12-B'],           tests: 10, status: 'active',   initials: 'AM', color: GREEN,  email: 'arun@school.edu'    },
  { id: 4, name: 'Ms. Priya Jain',     subject: 'Biology',        classes: ['10-B','11-A'],                  tests: 6,  status: 'inactive', initials: 'PJ', color: AMBER,  email: 'priya@school.edu'   },
  { id: 5, name: 'Dr. Vikram Pandey',  subject: 'English',        classes: ['10-A','10-B','11-B','12-A','12-B'], tests: 15, status: 'active', initials: 'VP', color: TEAL, email: 'vikram@school.edu'  },
  { id: 6, name: 'Mrs. Reena Gupta',   subject: 'Social Science', classes: ['10-A','10-B'],                  tests: 9,  status: 'active',   initials: 'RG', color: RED,    email: 'reena@school.edu'   },
];

const MOCK_CLASSES = [
  { id: 1, name: '10-A', students: 45, teacher: 'Dr. Ramesh Kumar',   avg: 82, board: 'CBSE', stream: 'Science',    color: BLUE   },
  { id: 2, name: '10-B', students: 43, teacher: 'Mrs. Sunita Sharma', avg: 76, board: 'CBSE', stream: 'Commerce',   color: VIOLET },
  { id: 3, name: '11-A', students: 40, teacher: 'Mr. Arun Mehta',     avg: 88, board: 'CBSE', stream: 'Science',    color: GREEN  },
  { id: 4, name: '11-B', students: 38, teacher: 'Ms. Priya Jain',     avg: 79, board: 'CBSE', stream: 'Commerce',   color: AMBER  },
  { id: 5, name: '12-A', students: 42, teacher: 'Dr. Vikram Pandey',  avg: 91, board: 'CBSE', stream: 'Science',    color: TEAL   },
  { id: 6, name: '12-B', students: 39, teacher: 'Mrs. Reena Gupta',   avg: 74, board: 'CBSE', stream: 'Humanities', color: RED    },
];

const MOCK_EXAMS = [
  { id: 1, title: 'Unit Test — Mathematics',   class: '10-A, 10-B', date: '2026-06-10', status: 'upcoming',   duration: '90 min', teacher: 'Dr. Ramesh',  subject: 'Mathematics'  },
  { id: 2, title: 'Physics Mid-Term',           class: '11-A, 11-B', date: '2026-06-12', status: 'upcoming',   duration: '3 hr',   teacher: 'Mrs. Sunita', subject: 'Physics'      },
  { id: 3, title: 'English Grammar Test',       class: 'All Classes',date: '2026-06-14', status: 'upcoming',   duration: '60 min', teacher: 'Dr. Vikram',  subject: 'English'      },
  { id: 4, title: 'Chemistry Practical',        class: '12-A, 12-B', date: '2026-06-18', status: 'upcoming',   duration: '2 hr',   teacher: 'Mr. Arun',    subject: 'Chemistry'    },
  { id: 5, title: 'Biology Unit Test',          class: '10-B',       date: '2026-05-28', status: 'completed',  duration: '90 min', teacher: 'Ms. Priya',   subject: 'Biology'      },
  { id: 6, title: 'Social Science Final',       class: '10-A',       date: '2026-05-25', status: 'completed',  duration: '3 hr',   teacher: 'Mrs. Reena',  subject: 'Social Sci.'  },
  { id: 7, title: 'Mathematics Final Exam',     class: 'All Classes',date: '2026-05-20', status: 'completed',  duration: '3 hr',   teacher: 'Dr. Ramesh',  subject: 'Mathematics'  },
];

const PERF_TREND = [
  { month: 'Jan', score: 72 }, { month: 'Feb', score: 75 },
  { month: 'Mar', score: 71 }, { month: 'Apr', score: 79 },
  { month: 'May', score: 83 }, { month: 'Jun', score: 87 },
];

const CLASS_PERF = [
  { class: '10-A', score: 82 }, { class: '10-B', score: 76 },
  { class: '11-A', score: 88 }, { class: '11-B', score: 79 },
  { class: '12-A', score: 91 }, { class: '12-B', score: 74 },
];

const SUBJECT_PERF = [
  { subject: 'Mathematics', score: 84, color: BLUE   },
  { subject: 'Physics',     score: 79, color: VIOLET },
  { subject: 'Chemistry',   score: 77, color: GREEN  },
  { subject: 'Biology',     score: 82, color: AMBER  },
  { subject: 'English',     score: 88, color: TEAL   },
  { subject: 'Soc. Sci.',   score: 73, color: RED    },
];

const ACTIVITY = [
  { message: 'Physics Mid-Term scheduled for Class 11',      time: '2h ago',  emoji: '📝', color: VIOLET },
  { message: 'New student Rahul Agarwal enrolled in 10-A',   time: '5h ago',  emoji: '👤', color: BLUE   },
  { message: 'June performance report generated',             time: '1d ago',  emoji: '📊', color: GREEN  },
  { message: 'Dr. Ramesh updated exam paper for 10-B',       time: '1d ago',  emoji: '✅', color: TEAL   },
  { message: 'Mathematics Final Exam results published',      time: '2d ago',  emoji: '🏆', color: AMBER  },
];

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

  const totalStudents = MOCK_STUDENTS.length;
  const totalTeachers = MOCK_TEACHERS.length;
  const totalClasses  = MOCK_CLASSES.length;
  const overallAvg    = Math.round(MOCK_CLASSES.reduce((s, c) => s + c.avg, 0) / MOCK_CLASSES.length);
  const upcomingExams = MOCK_EXAMS.filter(e => e.status === 'upcoming').length;

  const topStudents = [...MOCK_STUDENTS].sort((a, b) => b.avg - a.avg).slice(0, 5);
  
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
            Here's your institution overview for June 2026.
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
        <StatCard icon={GraduationCap} label="Total Students" value={totalStudents}  color={BLUE}   trend="+3 this month" />
        <StatCard icon={Users}         label="Total Teachers"  value={totalTeachers}  color={VIOLET}  />
        <StatCard icon={Building2}     label="Classes"         value={totalClasses}   color={GREEN}  />
        <StatCard icon={Target}        label="Avg Performance" value={`${overallAvg}%`} color={AMBER} trend="↑ 5% vs last month" />
        <StatCard icon={ClipboardList} label="Upcoming Exams"  value={upcomingExams}  color={TEAL}  />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>

        {/* Performance Trend */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Performance Trend</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Average score — last 6 months</div>
            </div>
            <Badge color={GREEN}>+15 pts</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PERF_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: GREEN, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="score" stroke={GREEN} strokeWidth={2.5} fill="url(#perfGrad)" dot={{ fill: GREEN, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: GREEN }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Class Comparison */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Class Performance</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Average score by class</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CLASS_PERF} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="class" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${BLUE}08` }} />
              <Bar dataKey="score" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: GREEN }}>{s.avg}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '1rem' }}>📋 Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {ACTIVITY.map((a, i) => (
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
        </div>

        {/* Upcoming Exams */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>📅 Upcoming Exams</div>
            <button onClick={() => setActiveTab('exams')} style={{ fontSize: '0.72rem', fontWeight: 700, color: BLUE, background: 'none', border: 'none', cursor: 'pointer' }}>
              Manage →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {MOCK_EXAMS.filter(e => e.status === 'upcoming').map((exam) => (
              <div key={exam.id} style={{
                padding: '0.75rem', borderRadius: 14,
                background: 'var(--bg3)', border: '1px solid var(--border2)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.3rem' }}>{exam.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>📅 {exam.date}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>⏱ {exam.duration}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>📚 {exam.class}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STUDENTS TAB
═══════════════════════════════════════ */
function StudentsTab() {
  const isMobile = useIsMobile();
  const [search, setSearch]     = useState('');
  const [classFilter, setClass] = useState('All');

  const classes = ['All', ...new Set(MOCK_STUDENTS.map(s => s.class))];

  const filtered = useMemo(() => MOCK_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
    const matchClass  = classFilter === 'All' || s.class === classFilter;
    return matchSearch && matchClass;
  }), [search, classFilter]);

  return (
    <div>
      <SectionHeader
        title="Students"
        subtitle={`${filtered.length} of ${MOCK_STUDENTS.length} students`}
        action={
          <button className="btn-p" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem', background: `linear-gradient(135deg,${GREEN},${TEAL})`, boxShadow: `0 4px 16px ${GREEN}30` }}>
            <Plus size={14} style={{ marginRight: 5 }} /> Add Student
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or roll..." />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {classes.map(c => (
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
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '1rem' }}>
          <EmptyState icon={GraduationCap} message="No students match your search." />
        </div>
      ) : isMobile ? (
        /* Mobile: cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {filtered.map(s => (
            <motion.div key={s.id} className="card" style={{ padding: '1rem' }} whileTap={{ scale: 0.985 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `${BLUE}14`, border: `1px solid ${BLUE}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.82rem', color: BLUE,
                }}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{s.class} · Roll {s.roll}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Score</div>
                  <ScoreBar score={s.avg} color={s.avg >= 85 ? GREEN : s.avg >= 70 ? AMBER : RED} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rank</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: s.rank === 1 ? AMBER : 'var(--text)' }}>#{s.rank}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Desktop: table */
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                {['Student', 'Class', 'Roll No.', 'Avg Score', 'Rank', 'Stream', 'Status', ''].map(h => (
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
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: `${BLUE}14`, border: `1px solid ${BLUE}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.7rem', color: BLUE,
                      }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text2)', fontWeight: 600 }}>{s.class}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{s.roll}</td>
                  <td style={{ padding: '0.85rem 1rem', minWidth: 130 }}>
                    <ScoreBar score={s.avg} color={s.avg >= 85 ? GREEN : s.avg >= 70 ? AMBER : RED} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', fontWeight: 800, color: s.rank === 1 ? AMBER : 'var(--text2)' }}>
                    {s.rank === 1 ? '🥇' : `#${s.rank}`}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}><Badge color={TEAL}>{s.stream}</Badge></td>
                  <td style={{ padding: '0.85rem 1rem' }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '0.25rem' }}>
                      <MoreVertical size={16} />
                    </button>
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
function TeachersTab() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    MOCK_TEACHERS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div>
      <SectionHeader
        title="Teachers"
        subtitle={`${MOCK_TEACHERS.length} faculty members`}
        action={
          <button className="btn-p" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem', background: `linear-gradient(135deg,${GREEN},${TEAL})`, boxShadow: `0 4px 16px ${GREEN}30` }}>
            <UserPlus size={14} style={{ marginRight: 5 }} /> Invite Teacher
          </button>
        }
      />

      <div style={{ marginBottom: '1.25rem', maxWidth: 360 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search teachers or subjects..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(t => (
          <motion.div key={t.id} className="card" style={{ padding: '1.3rem' }} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', marginBottom: '1rem' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${t.color}22, ${t.color}0a)`,
                border: `1px solid ${t.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem', color: t.color,
              }}>
                {t.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.2rem' }}>{t.name}</div>
                <Badge color={t.color}>{t.subject}</Badge>
              </div>
              <StatusBadge status={t.status} />
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, padding: '0.6rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{t.classes.length}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classes</div>
              </div>
              <div style={{ flex: 1, padding: '0.6rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{t.tests}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tests</div>
              </div>
            </div>

            {/* Classes */}
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.4rem' }}>Assigned Classes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {t.classes.map(c => (
                  <span key={c} style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6,
                    background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
                  }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border2)' }}>
              <button style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                padding: '0.5rem', borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg3)', color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                <Mail size={13} /> Email
              </button>
              <button style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                padding: '0.5rem', borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg3)', color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                <Edit2 size={13} /> Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CLASSES TAB
═══════════════════════════════════════ */
function ClassesTab({ setActiveTab }) {
  return (
    <div>
      <SectionHeader
        title="Classes & Sections"
        subtitle={`${MOCK_CLASSES.length} active sections`}
        action={
          <button className="btn-p" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem', background: `linear-gradient(135deg,${GREEN},${TEAL})`, boxShadow: `0 4px 16px ${GREEN}30` }}>
            <Plus size={14} style={{ marginRight: 5 }} /> Add Class
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {MOCK_CLASSES.map(cls => (
          <motion.div key={cls.id} className="card" style={{ padding: 0, overflow: 'hidden' }} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
            {/* Color bar */}
            <div style={{ height: 5, background: `linear-gradient(90deg, ${cls.color}, ${cls.color}99)` }} />
            <div style={{ padding: '1.2rem' }}>
              {/* Class name + board */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>Class {cls.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.2rem' }}>{cls.board} · {cls.stream}</div>
                </div>
                <Badge color={cls.color}>{cls.stream.slice(0, 3)}</Badge>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, padding: '0.65rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{cls.students}</div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Students</div>
                </div>
                <div style={{ flex: 1, padding: '0.65rem', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: cls.avg >= 85 ? GREEN : cls.avg >= 75 ? AMBER : RED }}>{cls.avg}%</div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Score</div>
                </div>
              </div>

              {/* Score bar */}
              <ScoreBar score={cls.avg} color={cls.color} />

              {/* Teacher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border2)' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  background: `${cls.color}14`, border: `1px solid ${cls.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 800, color: cls.color,
                }}>
                  {cls.teacher.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.teacher}</span>
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
function ExamsTab() {
  const [view, setView] = useState('upcoming');
  const filtered = MOCK_EXAMS.filter(e => e.status === view);

  const statusIcon = (status) => status === 'upcoming'
    ? <Clock size={14} color={AMBER} />
    : <CheckCircle size={14} color={GREEN} />;

  return (
    <div>
      <SectionHeader
        title="Examinations"
        subtitle={`${MOCK_EXAMS.filter(e => e.status === 'upcoming').length} upcoming · ${MOCK_EXAMS.filter(e => e.status === 'completed').length} completed`}
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
        {['upcoming', 'completed'].map(v => (
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
            {v === 'upcoming' ? '🕐 Upcoming' : '✅ Completed'}
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
                      {exam.status === 'completed' && (
                        <button style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.35rem 0.7rem', borderRadius: 9, border: '1px solid var(--border)',
                          background: 'var(--bg3)', color: 'var(--text3)', fontSize: '0.7rem', fontWeight: 700,
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>
                          <Download size={12} /> Results
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
function ReportsTab() {
  const { dark } = useTheme();
  const axisColor = dark ? '#475569' : '#94A3B8';
  const gridColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipStyle = {
    background: dark ? '#0B1220' : '#fff',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#DDE3F0'}`,
    borderRadius: 12, padding: '0.6rem 1rem',
    color: dark ? '#EEF2FF' : '#0A0F1E', fontSize: '0.8rem',
  };

  return (
    <div>
      <SectionHeader
        title="Performance Reports"
        subtitle="Academic analytics for June 2026"
        action={
          <button className="btn-g" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}>
            <Download size={14} style={{ marginRight: 5 }} /> Export PDF
          </button>
        }
      />

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'School Avg Score', value: '82%', icon: Trophy,     color: AMBER },
          { label: 'Top Performer',    value: '95%', icon: Star,       color: GREEN },
          { label: 'Tests Conducted',  value: '7',   icon: ClipboardList, color: BLUE },
          { label: 'Pass Rate',        value: '96%', icon: CheckCircle, color: GREEN },
        ].map(k => (
          <StatCard key={k.label} icon={k.icon} label={k.label} value={k.value} color={k.color} />
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>

        {/* Performance Trend */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>School Performance Trend</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Average score — Jan to Jun 2026</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PERF_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke={GREEN} strokeWidth={2.5} fill="url(#rptGrad)" dot={{ fill: GREEN, r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Class Comparison */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Class-Wise Performance</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Average score by section</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CLASS_PERF} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="class" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${BLUE}08` }} />
              <Bar dataKey="score" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="card" style={{ padding: '1.3rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Subject-Wise Breakdown</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Average score per subject across all classes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {SUBJECT_PERF.map(s => (
            <div key={s.subject}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>{s.subject}</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: s.score >= 85 ? GREEN : s.score >= 75 ? AMBER : RED }}>{s.score}%</span>
              </div>
              <ScoreBar score={s.score} color={s.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════ */
function SettingsTab({ user }) {
  const [schoolName, setSchoolName] = useState("St. Mary's Public School");
  const [board, setBoard]           = useState('CBSE');
  const [address, setAddress]       = useState('12, Education Block, New Delhi - 110001');
  const [phone, setPhone]           = useState('+91 98765 43210');
  const [website, setWebsite]       = useState('www.stmarys.edu.in');
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
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
                { label: 'School ID',      value: 'SCH-20241106' },
                { label: 'Plan',           value: 'QuesGen Pro'  },
                { label: 'Students Limit', value: '500'          },
                { label: 'Valid Until',    value: 'March 2027'   },
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
export default function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser]           = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('questra_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    navigate('/login');
  };

  const navUser = user ? {
    name:     `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    initials: ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || 'SA',
    email:    user.email,
  } : null;

  const tabs = {
    overview: <OverviewTab user={navUser} setActiveTab={setActiveTab} />,
    students: <StudentsTab />,
    teachers: <TeachersTab />,
    classes:  <ClassesTab setActiveTab={setActiveTab} />,
    exams:    <ExamsTab />,
    reports:  <ReportsTab />,
    settings: <SettingsTab user={user} />,
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
