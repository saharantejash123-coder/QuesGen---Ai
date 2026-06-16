import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Brain, LogOut, Sun, Moon, Globe, X,
  Home, Sparkles, Archive, Tag, MoreHorizontal,
  LayoutDashboard, Shuffle, PenTool, Layers, Eye, BarChart2,
  TrendingUp, Settings, Users, ChevronRight, ChevronDown,
  GraduationCap, Building2, Calendar, User,
  Trophy, Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import SignOutModal from '../SignOutModal';

const roleGradients = {
  student: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  teacher: 'linear-gradient(135deg, #2354F4, #60a5fa)',
  admin:   'linear-gradient(135deg, #DC2626, #f97316)',
  school:  'linear-gradient(135deg, #059669, #34d399)',
};

const roleColors = {
  student: { bg: 'rgba(124,58,237,0.12)', text: '#7c3aed' },
  teacher: { bg: 'rgba(35,84,244,0.10)',  text: '#2354F4' },
  admin:   { bg: 'rgba(220,38,38,0.10)',  text: '#DC2626' },
  school:  { bg: 'rgba(5,150,105,0.10)',  text: '#059669' },
};

const roleDashPaths = {
  student: '/student',
  teacher: '/teacher',
  admin:   '/admin',
  school:  '/school',
};

const roleConfigs = {
  landing: {
    links: [
      { id: 'home',      l: 'nav.home',             action: 'page' },
      { id: 'features',  l: 'nav.features',          action: 'page' },
      { id: 'adaptive',  l: 'nav.adaptiveTesting',   action: 'page' },
      { id: 'oracle',    l: 'nav.oracleEngine',      action: 'page' },
      { id: 'pricing',   l: 'nav.pricing',           action: 'page' },
    ],
    showAuth: true,
    showTabs: false,
    accent: '#2354F4',
  },
  login: {
    links: [
      { id: 'home',     l: 'Home',     action: 'navigate', path: '/' },
      { id: 'features', l: 'Features', action: 'navigate', path: '/' },
    ],
    showAuth: false,
    showTabs: false,
    accent: '#2354F4',
  },
  student: {
    tabs: [
      { id: 'overview',  l: 'Dashboard'        },
      { id: 'oracle',    l: 'Exam Generator'   },
      { id: 'adaptive',  l: 'Adaptive Testing' },
      { id: 'features',  l: 'Features'         },
      { id: 'pricing',   l: 'Pricing'          },
    ],
    moreTabs: [
      { id: 'logicgen',  l: 'LogicGen'   },
      { id: 'vault15',   l: 'Vault-15'   },
      { id: 'scriptlab', l: 'Script-Lab' },
    ],
    showAuth: false,
    showTabs: true,
    showHome: true,
    accent: '#7C3AED',
    label: 'Student Portal',
  },
  teacher: {
    tabs: [
      { id: 'studio',   l: 'Studio-Q'       },
      { id: 'varitest', l: 'Vari-Test'      },
      { id: 'vision',   l: 'Vision-Grade'   },
      { id: 'bridge',   l: 'Bridge-Reports' },
    ],
    showAuth: false,
    showTabs: true,
    showHome: true,
    accent: '#2354F4',
    label: 'Teacher Portal',
  },
  admin: {
    tabs: [
      { id: 'overview',  l: 'Overview'  },
      { id: 'users',     l: 'Users'     },
      { id: 'schools',   l: 'Schools'   },
      { id: 'activity',  l: 'Activity'  },
      { id: 'settings',  l: 'Settings'  },
    ],
    showAuth: false,
    showTabs: true,
    showHome: true,
    accent: '#DC2626',
    label: 'Admin Panel',
  },
  school: {
    tabs: [
      { id: 'overview',  l: 'Dashboard' },
      { id: 'students',  l: 'Students'  },
      { id: 'teachers',  l: 'Teachers'  },
      { id: 'classes',   l: 'Classes'   },
      { id: 'exams',     l: 'Exams'     },
      { id: 'reports',   l: 'Reports'   },
      { id: 'settings',  l: 'Settings'  },
    ],
    showAuth: false,
    showTabs: true,
    showHome: true,
    accent: '#059669',
    label: 'School Portal',
  },
};

/* ── Mobile bottom-nav primary items (max 5) ── */
const mobileNavMap = {
  landing: [
    { id: 'home',     label: 'Home',     Icon: Home,           isMore: false },
    { id: 'features', label: 'Features', Icon: Sparkles,       isMore: false },
    { id: 'pricing',  label: 'Pricing',  Icon: Tag,            isMore: false },
    { id: '__more',   label: 'More',     Icon: MoreHorizontal, isMore: true  },
  ],
  login: [
    { id: 'home',     label: 'Home',     Icon: Home,     isMore: false },
    { id: 'features', label: 'Features', Icon: Sparkles, isMore: false },
  ],
  student: [
    { id: 'overview', label: 'Home',     Icon: LayoutDashboard, isMore: false },
    { id: 'oracle',   label: 'Exam Gen', Icon: Trophy,           isMore: false },
    { id: 'adaptive', label: 'Adaptive', Icon: Brain,           isMore: false },
    { id: 'vault15',  label: 'Vault',    Icon: Archive,         isMore: false },
    { id: '__more',   label: 'More',     Icon: MoreHorizontal,  isMore: true  },
  ],
  teacher: [
    { id: 'studio',   label: 'Studio',  Icon: PenTool,        isMore: false },
    { id: 'varitest', label: 'VariTest', Icon: Layers,         isMore: false },
    { id: 'vision',   label: 'Vision',  Icon: Eye,            isMore: false },
    { id: 'bridge',   label: 'Reports', Icon: BarChart2,      isMore: false },
    { id: '__more',   label: 'More',    Icon: MoreHorizontal, isMore: true  },
  ],
  admin: [
    { id: 'overview',  label: 'Overview', Icon: LayoutDashboard, isMore: false },
    { id: 'users',     label: 'Users',    Icon: Users,           isMore: false },
    { id: 'schools',   label: 'Schools',  Icon: Building2,       isMore: false },
    { id: 'activity',  label: 'Activity', Icon: TrendingUp,      isMore: false },
    { id: '__more',    label: 'More',     Icon: MoreHorizontal,  isMore: true  },
  ],
  school: [
    { id: 'overview',  label: 'Home',     Icon: LayoutDashboard, isMore: false },
    { id: 'students',  label: 'Students', Icon: GraduationCap,   isMore: false },
    { id: 'teachers',  label: 'Teachers', Icon: Users,           isMore: false },
    { id: 'classes',   label: 'Classes',  Icon: Building2,       isMore: false },
    { id: '__more',    label: 'More',     Icon: MoreHorizontal,  isMore: true  },
  ],
};

/* ── Pages shown in the More sheet ── */
const moreSheetMap = {
  /* oracle + adaptive are already in config.links, so omit them here */
  landing: [
    { id: 'vault15',   label: 'Vault-15',   desc: 'Previous year papers',   emoji: '📚' },
    { id: 'logicgen',  label: 'LogicGen',   desc: 'PYQ variable rebuilder', emoji: '🔄' },
    { id: 'scriptlab', label: 'Script-Lab', desc: 'AI handwriting coach',   emoji: '✍️' },
  ],
  student: [
    { id: 'scriptlab', label: 'Script-Lab', desc: 'AI handwriting coach',  emoji: '✍️' },
    { id: 'logicgen',  label: 'LogicGen',   desc: 'PYQ variable rebuilder', emoji: '🔄' },
    { id: 'features',  label: 'Features',   desc: 'All student features',   emoji: '✨' },
    { id: 'pricing',   label: 'Pricing',    desc: 'Plans & pricing',        emoji: '💳' },
  ],
  teacher: [],
  admin: [
    { id: 'analytics', label: 'Analytics', desc: 'Platform usage & charts', emoji: '📊' },
    { id: 'settings',  label: 'Settings',  desc: 'System configuration',    emoji: '⚙️' },
  ],
  login: [],
  school: [
    { id: 'exams',    label: 'Exams',    desc: 'Schedule & manage tests', emoji: '📝' },
    { id: 'reports',  label: 'Reports',  desc: 'Performance analytics',   emoji: '📊' },
    { id: 'settings', label: 'Settings', desc: 'School configuration',    emoji: '⚙️' },
  ],
};

/* ─────────────────────────────────────────────────────── */

export default function AppNavbar({ role = 'landing', activeTab, setActiveTab, user, onLogout, onProfile }) {
  const { dark, setDark }               = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [langOpen, setLangOpen]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [moreOpen, setMoreOpen]         = useState(false);
  const [hoveredLink, setHoveredLink]   = useState(null);
  const [signOutOpen, setSignOutOpen]   = useState(false);
  const profileRef                      = useRef(null);
  const moreRef                         = useRef(null);

  const navigate = useNavigate();
  const config   = roleConfigs[role] || roleConfigs.landing;
  const isMobile = useIsMobile();
  const accent   = config.accent || '#2354F4';

  /* Tag body with role so CSS can remove bottom-nav padding on landing */
  useEffect(() => {
    document.body.setAttribute('data-nav-role', role);
    return () => document.body.removeAttribute('data-nav-role');
  }, [role]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    if (!profileOpen) return;
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [profileOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const h = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [moreOpen]);

  /* Lock body scroll when More sheet is open */
  useEffect(() => {
    document.body.classList.toggle('mob-sheet-open', mobileOpen);
    return () => document.body.classList.remove('mob-sheet-open');
  }, [mobileOpen]);

  const goLink = (link) => {
    setMobileOpen(false);
    if (link.action === 'navigate') {
      navigate(link.path || '/');
      window.scrollTo(0, 0);
    } else if (link.action === 'page' && setActiveTab) {
      setActiveTab(link.id);
      window.scrollTo(0, 0);
    }
  };

  const goTab = (id) => {
    setMobileOpen(false);
    if (setActiveTab) setActiveTab(id);
  };

  const handleMobNavClick = (item) => {
    if (item.isMore) { setMobileOpen(true); return; }
    if (config.showTabs) {
      goTab(item.id);
    } else {
      const link = (config.links || []).find(l => l.id === item.id);
      if (link) goLink(link);
      else if (setActiveTab) { setActiveTab(item.id); window.scrollTo(0, 0); }
    }
  };

  const mobileNavItems = mobileNavMap[role]  || [];
  const moreSheetItems = moreSheetMap[role]  || [];
  const morePageIds    = moreSheetItems.map(i => i.id);
  const isMoreActive   = morePageIds.includes(activeTab);
  const isMobItemActive = (item) => item.isMore ? isMoreActive : activeTab === item.id;

  const renderLabel = (text) => {
    if (language === 'hi') {
      if (text === 'Exam Generator' || text === 'Exam Gen' || text === 'nav.oracleEngine')
        return <span className="notranslate">एग्जाम जनरेटर</span>;
      if (text === 'Pricing' || text === 'nav.pricing')
        return <span className="notranslate">प्राइसिंग</span>;
    } else {
      if (text === 'Exam Generator' || text === 'Exam Gen' || text === 'nav.oracleEngine')
        return <span className="notranslate">Exam Generator</span>;
      if (text === 'Pricing' || text === 'nav.pricing')
        return <span className="notranslate">Pricing</span>;
    }
    return text.startsWith('nav.') ? t(text) : text;
  };

  /* ── Shared icon button style ── */
  const iconBtn = {
    width: 38, height: 38, borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg2)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text2)', transition: 'all 0.18s ease', flexShrink: 0,
  };

  /* ── Navbar background color ── */
  const NAV_BG = 'var(--nav-bg-scroll)';

  /* ═══════════════════════════════════════
     LOGO BLOCK (shared)
  ═══════════════════════════════════════ */
  const LogoBlock = () => (
    <div
      onClick={() => {
        if (config.showTabs) {
          /* Stay inside the dashboard — go to the first/home tab */
          const dashPath = roleDashPaths[role];
          if (dashPath) { navigate(dashPath); window.scrollTo(0, 0); }
          else { navigate('/'); window.scrollTo(0, 0); }
        } else if (setActiveTab) { setActiveTab('home'); window.scrollTo(0, 0); }
        else { navigate('/'); window.scrollTo(0, 0); }
      }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        cursor: 'pointer', transition: 'opacity 0.2s', flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11, overflow: 'hidden',
        boxShadow: `0 2px 10px ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', flexShrink: 0,
      }}>
        <img src="/logo.png" alt="QuesGen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span className="text-gradient" style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
          QuesGen
        </span>
        {config.label && (
          <span style={{
            fontSize: '0.55rem', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--text3)', marginTop: 1,
          }}>
            {config.label}
          </span>
        )}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     LANDING NAV LINKS (center)
  ═══════════════════════════════════════ */
  const LandingLinks = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
      {(config.links || []).map(l => {
        const isActive  = activeTab === l.id;
        const isHovered = hoveredLink === l.id;
        return (
          <button
            key={l.id}
            onClick={() => goLink(l)}
            onMouseEnter={() => setHoveredLink(l.id)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              background: isActive ? `${accent}12` : 'none',
              border: isActive ? `1px solid ${accent}25` : '1px solid transparent',
              cursor: 'pointer',
              padding: '0.45rem 0.9rem', borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? accent : isHovered ? 'var(--text)' : 'var(--text2)',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.18s ease',
            }}
          >
            {renderLabel(l.l)}
          </button>
        );
      })}
    </div>
  );

  /* ═══════════════════════════════════════
     TABS BAR (dashboard panels)
  ═══════════════════════════════════════ */
  const TabsBar = () => (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '0.2rem',
    }}>
      {config.showHome && (
        <button
          onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
          style={{
            padding: '0.42rem 0.8rem', borderRadius: 9,
            fontSize: '0.79rem', fontWeight: 600,
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text3)', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent + '60'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          🏠
        </button>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.18rem',
        background: 'var(--bg3)', padding: '0.22rem',
        borderRadius: 11, border: '1px solid var(--border)',
      }}>
        {(config.tabs || []).map(tab => (
          <button
            key={tab.id}
            onClick={() => { setMoreOpen(false); goTab(tab.id); }}
            style={{
              padding: '0.38rem 0.8rem', borderRadius: 8,
              fontSize: '0.79rem', fontWeight: activeTab === tab.id ? 700 : 500,
              background: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
              color: activeTab === tab.id ? accent : 'var(--text3)',
              border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
              boxShadow: activeTab === tab.id ? `0 1px 4px ${accent}18` : 'none',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.18s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.target.style.color = 'var(--text2)'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.target.style.color = 'var(--text3)'; }}
          >
            {renderLabel(tab.l)}
          </button>
        ))}
        {config.moreTabs && (
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen(o => !o)}
              style={{
                padding: '0.38rem 0.6rem', borderRadius: 8,
                fontSize: '0.79rem', fontWeight: 700,
                background: moreOpen || config.moreTabs.some(t => t.id === activeTab) ? 'var(--card-bg)' : 'transparent',
                color: moreOpen || config.moreTabs.some(t => t.id === activeTab) ? accent : 'var(--text3)',
                border: moreOpen || config.moreTabs.some(t => t.id === activeTab) ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.18s',
                display: 'flex', alignItems: 'center',
              }}
            >
              <MoreHorizontal size={16} />
            </button>
            {moreOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 1000000,
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '0.35rem', minWidth: 160,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              }}>
                {config.moreTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setMoreOpen(false); goTab(tab.id); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      width: '100%', padding: '0.55rem 0.75rem', borderRadius: 10,
                      fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 700 : 500,
                      background: activeTab === tab.id ? `${accent}14` : 'transparent',
                      color: activeTab === tab.id ? accent : 'var(--text2)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans',sans-serif", transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = activeTab === tab.id ? `${accent}14` : 'transparent'}
                  >
                    {renderLabel(tab.l)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     RIGHT CONTROLS (shared)
  ═══════════════════════════════════════ */
  const RightControls = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>

      {/* Auth buttons — landing only */}
      {config.showAuth && (
        <>
          <Link to="/login" style={{
            fontSize: '0.86rem', fontWeight: 600, color: 'var(--text2)',
            textDecoration: 'none', padding: '0.5rem 0.9rem', borderRadius: 10,
            border: '1px solid var(--border)', background: 'transparent',
            transition: 'all 0.18s ease', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = accent;
              e.currentTarget.style.borderColor = accent + '60';
              e.currentTarget.style.background = accent + '08';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t('auth.login')}
          </Link>
          <Link to="/login" className="btn-p" style={{ padding: '0.52rem 1.2rem', fontSize: '0.86rem', borderRadius: 11, whiteSpace: 'nowrap' }}>
            {t('common.getAccess')}
          </Link>
        </>
      )}

      {/* User profile — dashboard only */}
      {config.showTabs && user && (
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.28rem 0.55rem 0.28rem 0.28rem', borderRadius: 11,
              background: profileOpen ? 'var(--bg3)' : 'transparent',
              border: `1px solid ${profileOpen ? 'var(--border)' : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0,
              background: roleGradients[role] || 'linear-gradient(135deg,#3b82f6,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.62rem', fontWeight: 800, color: '#fff',
            }}>
              {user.initials}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </span>
            <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <ChevronDown style={{ width: 13, height: 13, color: 'var(--text3)' }} />
            </motion.span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute', top: 48, right: 0, zIndex: 300,
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  borderRadius: 18, overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                  minWidth: 252,
                }}
              >
                <div style={{ padding: '1.1rem 1.1rem 0.9rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 15, flexShrink: 0,
                      background: roleGradients[role] || 'linear-gradient(135deg,#3b82f6,#7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: '#fff', fontSize: '1.1rem',
                      boxShadow: `0 6px 20px ${(roleColors[role]?.text || '#7c3aed')}45`,
                    }}>
                      {user.initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: '0.18rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.22rem 0.7rem', borderRadius: 7,
                      fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase',
                      background: roleColors[role]?.bg || 'rgba(99,102,241,0.1)',
                      color: roleColors[role]?.text || '#6366f1',
                      border: `1px solid ${(roleColors[role]?.text || '#6366f1')}28`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                      {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </span>
                  </div>
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '0 0.6rem' }} />
                <div style={{ padding: '0.5rem' }}>
                  <button
                    onClick={() => { setProfileOpen(false); if (onProfile) onProfile(); else if (setActiveTab) setActiveTab('profile'); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                      padding: '0.65rem 0.8rem', borderRadius: 11,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--text)', fontSize: '0.83rem', fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(35,84,244,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2354F4' }}>
                      <User style={{ width: 14, height: 14 }} />
                    </div>
                    View Profile
                  </button>
                  <div style={{ height: 1, background: 'var(--border)', margin: '0.3rem 0.4rem' }} />
                  <button
                    onClick={() => { setProfileOpen(false); setSignOutOpen(true); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                      padding: '0.65rem 0.8rem', borderRadius: 11,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: '#ef4444', fontSize: '0.83rem', fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LogOut style={{ width: 14, height: 14 }} />
                    </div>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        aria-label="Toggle Theme"
        style={{ ...iconBtn }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? 'sun' : 'moon'}
            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Language Selector */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setLangOpen(!langOpen)}
          aria-label="Change Language"
          style={{ ...iconBtn, fontSize: '0.7rem', fontWeight: 700 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; }}
        >
          {language === 'en' ? '🌐' : '🇮🇳'}
        </button>
        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 44, right: 0,
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden', zIndex: 100,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 130,
              }}
            >
              {[{ code: 'en', label: '🇺🇸 English' }, { code: 'hi', label: '🇮🇳 हिंदी' }].map(lang => (
                <button key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                  style={{
                    width: '100%', padding: '0.6rem 1rem',
                    background: language === lang.code ? `${accent}14` : 'transparent',
                    border: 'none', color: language === lang.code ? accent : 'var(--text2)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                    textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {lang.label}{language === lang.code && ' ✓'}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hamburger (mobile + landing desktop More) */}
      {!isMobile && role === 'landing' && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{ ...iconBtn }}
          aria-label="Menu"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
        >
          <Menu size={17} />
        </button>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ══════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════ */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: NAV_BG,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: 64, minHeight: 64 }}>

            {/* ── Logo ── */}
            <LogoBlock />

            {/* ── Center: Search (landing) or Tabs (dashboard) ── */}
            {!isMobile && (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {!config.showTabs ? (
                  <LandingLinks />
                ) : (
                  <TabsBar />
                )}
              </div>
            )}

            {/* ── Right Controls ── */}
            {!isMobile && <RightControls />}

            {/* ── Mobile Top Controls ── */}
            {isMobile && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {config.showTabs && user && (
                  <button
                    onClick={() => { if (onProfile) onProfile(); else if (setActiveTab) { setActiveTab('profile'); window.scrollTo(0, 0); } }}
                    aria-label="My Profile"
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: roleGradients[role] || 'linear-gradient(135deg,#2354F4,#7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: '#fff', fontSize: '0.6rem',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    {user.initials}
                  </button>
                )}
                <button onClick={() => setDark(!dark)} aria-label="Toggle Theme" style={{ ...iconBtn, width: 36, height: 36 }}>
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setLangOpen(!langOpen)} style={{ ...iconBtn, width: 36, height: 36, fontSize: '0.72rem', fontWeight: 700 }}>
                    {language === 'en' ? '🌐' : '🇮🇳'}
                  </button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0,  scale: 1 }}
                        exit={{    opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute', top: 42, right: 0,
                          background: 'var(--card-bg)', border: '1px solid var(--border)',
                          borderRadius: 12, overflow: 'hidden', zIndex: 200,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: 130,
                        }}
                      >
                        {[{ code: 'en', label: '🇺🇸 English' }, { code: 'hi', label: '🇮🇳 हिंदी' }].map(lang => (
                          <button key={lang.code}
                            onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                            style={{
                              width: '100%', padding: '0.65rem 1rem',
                              background: language === lang.code ? `${accent}14` : 'transparent',
                              border: 'none', color: language === lang.code ? accent : 'var(--text2)',
                              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                              textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {lang.label}{language === lang.code && ' ✓'}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Hamburger — only for landing (no bottom nav on landing) */}
                {role === 'landing' && (
                  <button
                    onClick={() => setMobileOpen(true)}
                    style={{ ...iconBtn, width: 36, height: 36 }}
                    aria-label="Open menu"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
                  >
                    <Menu size={17} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ══════════════════════════════ */}
      {isMobile && mobileNavItems.length > 0 && role !== 'landing' && (
        <div className="mob-bottom-nav">
          {mobileNavItems.map(item => {
            const active = isMobItemActive(item);
            return (
              <motion.button
                key={item.id}
                className={`mob-nav-item${active ? ' mob-active' : ''}`}
                onClick={() => handleMobNavClick(item)}
                aria-label={item.label}
                whileTap={{ scale: 0.84 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <div className="mob-nav-icon">
                  <div className="mob-nav-pill" />
                  <item.Icon size={active ? 20 : 18} strokeWidth={active ? 2.3 : 1.7} />
                </div>
                <span className="mob-nav-label">{renderLabel(item.label)}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════
          SIGN-OUT CONFIRMATION MODAL
      ══════════════════════════════ */}
      <SignOutModal
        isOpen={signOutOpen}
        userName={user?.name}
        onConfirm={() => { setSignOutOpen(false); onLogout?.(); }}
        onCancel={() => setSignOutOpen(false)}
      />

      {/* ══════════════════════════════
          RIGHT-SIDE NAVIGATION DRAWER
      ══════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Right-side panel */}
            <motion.div
              className="mob-sheet"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            >
              {/* ── Panel Header ── */}
              <div className="mob-sheet-header">
                <LogoBlock />
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ ...iconBtn, width: 36, height: 36, flexShrink: 0 }}
                  aria-label="Close menu"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Panel Body (scrollable) ── */}
              <div className="mob-sheet-body">

                {/* Dashboard user card */}
                {config.showTabs && user && (
                  <button
                    className="mob-sheet-user"
                    onClick={() => {
                      setMobileOpen(false);
                      if (onProfile) onProfile();
                      else if (setActiveTab) { setActiveTab('profile'); window.scrollTo(0, 0); }
                    }}
                    style={{
                      width: '100%', cursor: 'pointer', textAlign: 'left',
                      marginBottom: '0.6rem',
                      background: 'var(--bg3)', borderRadius: 16, padding: '0.9rem',
                      border: '1px solid var(--border)', transition: 'all 0.18s',
                    }}
                    onTouchStart={e => e.currentTarget.style.background = 'var(--border)'}
                    onTouchEnd={e => e.currentTarget.style.background = 'var(--bg3)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                        background: roleGradients[role] || 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff', fontSize: '0.9rem',
                      }}>
                        {user?.initials}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        color: roleColors[role]?.text || '#2354F4',
                        fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                        background: roleColors[role]?.bg || 'rgba(35,84,244,0.1)',
                        padding: '0.25rem 0.55rem', borderRadius: 8,
                      }}>
                        View <ChevronRight size={11} />
                      </div>
                    </div>
                  </button>
                )}

                {/* Landing navigation links */}
                {role === 'landing' && (
                  <>
                    <div className="mob-sheet-section-title">Navigation</div>
                    {(config.links || []).map(link => (
                      <button
                        key={link.id}
                        className="mob-sheet-item"
                        onClick={() => goLink(link)}
                      >
                        <div className="mob-sheet-emoji">
                          {link.id === 'home' ? '🏠' : link.id === 'features' ? '✨' : link.id === 'pricing' ? '💳' : link.id === 'adaptive' ? '🧠' : '🏆'}
                        </div>
                        <div>
                          <div style={{ lineHeight: 1.2 }}>{renderLabel(link.l)}</div>
                        </div>
                        <ChevronRight size={15} style={{ marginLeft: 'auto', color: 'var(--text3)', flexShrink: 0 }} />
                      </button>
                    ))}
                    <div className="mob-sheet-divider" />
                  </>
                )}

                {/* More pages */}
                {moreSheetItems.length > 0 && (
                  <>
                    <div className="mob-sheet-section-title">More Pages</div>
                    {moreSheetItems.map(item => (
                      <button
                        key={item.id}
                        className={`mob-sheet-item${activeTab === item.id ? ' mob-sheet-active' : ''}`}
                        onClick={() => {
                          setMobileOpen(false);
                          if (setActiveTab) { setActiveTab(item.id); window.scrollTo(0, 0); }
                        }}
                      >
                        <div className="mob-sheet-emoji">{item.emoji}</div>
                        <div>
                          <div style={{ lineHeight: 1.2 }}>{renderLabel(item.label)}</div>
                          <div style={{ fontSize: '0.73rem', fontWeight: 500, color: 'var(--text3)', marginTop: 2 }}>{item.desc}</div>
                        </div>
                        <ChevronRight size={15} style={{ marginLeft: 'auto', color: 'var(--text3)', flexShrink: 0 }} />
                      </button>
                    ))}
                    <div className="mob-sheet-divider" />
                  </>
                )}

                {/* Back to Home for dashboard roles */}
                {config.showTabs && config.showHome && (
                  <>
                    <div className="mob-sheet-section-title">Navigation</div>
                    <button className="mob-sheet-item" onClick={() => { setMobileOpen(false); navigate('/'); window.scrollTo(0, 0); }}>
                      <div className="mob-sheet-emoji">🏠</div>
                      <div>
                        <div style={{ lineHeight: 1.2 }}>Back to Home</div>
                        <div style={{ fontSize: '0.73rem', fontWeight: 500, color: 'var(--text3)', marginTop: 2 }}>Return to landing page</div>
                      </div>
                      <ChevronRight size={15} style={{ marginLeft: 'auto', color: 'var(--text3)', flexShrink: 0 }} />
                    </button>
                  </>
                )}

              </div>

              {/* ── Panel Footer ── */}
              {config.showAuth && (
                <div className="mob-sheet-footer">
                  <Link to="/login" className="btn-g" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center', textAlign: 'center', padding: '0.72rem', textDecoration: 'none' }}>
                    {t('auth.login')}
                  </Link>
                  <Link to="/login" className="btn-p" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center', textAlign: 'center', padding: '0.72rem', textDecoration: 'none' }}>
                    {t('common.getAccess')}
                  </Link>
                </div>
              )}
              {config.showTabs && (
                <div className="mob-sheet-footer" style={{ gridTemplateColumns: '1fr' }}>
                  <button
                    onClick={() => { setMobileOpen(false); setSignOutOpen(true); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      padding: '0.8rem', borderRadius: 12, border: 'none',
                      background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", transition: 'background 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
