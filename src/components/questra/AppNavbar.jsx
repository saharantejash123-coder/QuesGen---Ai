import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Brain, LogOut, Sun, Moon, Globe,
  Home, Sparkles, Archive, Tag, MoreHorizontal,
  LayoutDashboard, Shuffle, PenTool, Layers, Eye, BarChart2,
  TrendingUp, Settings, Users, ChevronRight,
  GraduationCap, Building2, Calendar,
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';

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
      { id: 'oracle',    l: 'Exam Generator'    },
      { id: 'logicgen',  l: 'LogicGen'         },
      { id: 'vault15',   l: 'Vault-15'         },
      { id: 'scriptlab', l: 'Script-Lab'       },
      { id: 'adaptive',  l: 'Adaptive Testing' },
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
      { id: 'analytics', l: 'Analytics' },
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
    { id: 'home',     label: 'Home',      Icon: Home,           isMore: false },
    { id: 'vault15',  label: 'Vault',     Icon: Archive,        isMore: false },
    { id: 'oracle',   label: 'Exam Gen',    Icon: Brain,          isMore: false },
    { id: 'adaptive', label: 'Adaptive',  Icon: Brain,          isMore: false },
    { id: '__more',   label: 'More',      Icon: MoreHorizontal, isMore: true  },
  ],
  login: [
    { id: 'home',     label: 'Home',     Icon: Home,     isMore: false },
    { id: 'features', label: 'Features', Icon: Sparkles, isMore: false },
  ],
  student: [
    { id: 'overview', label: 'Home',       Icon: LayoutDashboard, isMore: false },
    { id: 'oracle',   label: 'Exam Gen',     Icon: Brain,           isMore: false },
    { id: 'adaptive', label: 'Adaptive',   Icon: Brain,           isMore: false },
    { id: 'vault15',  label: 'Vault',      Icon: Archive,         isMore: false },
    { id: '__more',   label: 'More',       Icon: MoreHorizontal,  isMore: true  },
  ],
  teacher: [
    { id: 'studio',   label: 'Studio',  Icon: PenTool,        isMore: false },
    { id: 'varitest', label: 'VariTest', Icon: Layers,         isMore: false },
    { id: 'vision',   label: 'Vision',  Icon: Eye,            isMore: false },
    { id: 'bridge',   label: 'Reports', Icon: BarChart2,      isMore: false },
    { id: '__more',   label: 'More',    Icon: MoreHorizontal, isMore: true  },
  ],
  admin: [
    { id: 'overview',  label: 'Overview',  Icon: LayoutDashboard, isMore: false },
    { id: 'users',     label: 'Users',     Icon: Users,           isMore: false },
    { id: 'analytics', label: 'Analytics', Icon: TrendingUp,      isMore: false },
    { id: 'settings',  label: 'Settings',  Icon: Settings,        isMore: false },
    { id: '__more',    label: 'More',      Icon: MoreHorizontal,  isMore: true  },
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
  landing: [
    { id: 'features',  label: 'Features',         desc: 'Platform features',      emoji: '✨' },
    { id: 'pricing',   label: 'Pricing',          desc: 'Plans & subscriptions',  emoji: '🏷️' },
    { id: 'scriptlab', label: 'Script-Lab',       desc: 'AI handwriting coach',   emoji: '✍️' },
    { id: 'logicgen',  label: 'LogicGen',         desc: 'PYQ variable rebuilder', emoji: '🔄' },
  ],
  student: [
    { id: 'scriptlab', label: 'Script-Lab', desc: 'AI handwriting coach', emoji: '✍️' },
  ],
  teacher: [],
  admin:   [],
  login:   [],
  school: [
    { id: 'exams',    label: 'Exams',    desc: 'Schedule & manage tests',  emoji: '📝' },
    { id: 'reports',  label: 'Reports',  desc: 'Performance analytics',    emoji: '📊' },
    { id: 'settings', label: 'Settings', desc: 'School configuration',     emoji: '⚙️' },
  ],
};

export default function AppNavbar({ role = 'landing', activeTab, setActiveTab, user, onLogout }) {
  const { dark, setDark }               = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [langOpen, setLangOpen]         = useState(false);
  const [hoveredLink, setHoveredLink]   = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const config    = roleConfigs[role] || roleConfigs.landing;
  const isMobile  = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when More sheet is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('mob-sheet-open');
    } else {
      document.body.classList.remove('mob-sheet-open');
    }
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
    if (item.isMore) {
      setMobileOpen(true);
      return;
    }
    if (config.showTabs) {
      goTab(item.id);
    } else {
      const link = (config.links || []).find(l => l.id === item.id);
      if (link) goLink(link);
      else if (setActiveTab) { setActiveTab(item.id); window.scrollTo(0, 0); }
    }
  };

  const mobileNavItems  = mobileNavMap[role]  || [];
  const moreSheetItems  = moreSheetMap[role]  || [];
  const morePageIds     = moreSheetItems.map(i => i.id);
  const isMoreActive    = morePageIds.includes(activeTab);

  const isMobItemActive = (item) => {
    if (item.isMore) return isMoreActive;
    return activeTab === item.id;
  };

  /* ─────────────────────────────────────────── */
  return (
    <>
      {/* ══════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════ */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'var(--nav-bg-scroll)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, minHeight: 56 }}>

            {/* ── Logo ── */}
            <div
              onClick={() => {
                if (config.showTabs) { navigate('/'); window.scrollTo(0, 0); }
                else if (setActiveTab) { setActiveTab('home'); window.scrollTo(0, 0); }
                else { navigate('/'); window.scrollTo(0, 0); }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', background: 'transparent',
              }}>
                <img src="/logo.png" alt="QuesGen Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="text-gradient" style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.2 }}>
                  QuesGen
                </span>
                {config.label && (
                  <span style={{
                    fontSize: '0.58rem', fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'var(--text3)', marginTop: -1,
                  }}>
                    {config.label}
                  </span>
                )}
              </div>
            </div>

            {/* ── Desktop Navigation ── */}
            <div className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

              {!config.showTabs ? (
                <LayoutGroup>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', marginRight: '1rem' }}>
                    {config.links.map(l => {
                      const isActive  = activeTab === l.id;
                      const isHovered = hoveredLink === l.id;
                      return (
                        <button
                          key={l.id}
                          onClick={() => goLink(l)}
                          onMouseEnter={() => setHoveredLink(l.id)}
                          onMouseLeave={() => setHoveredLink(null)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '0.5rem 0.85rem', borderRadius: 8,
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive || isHovered ? 'var(--text)' : 'var(--text3)',
                            fontFamily: "'DM Sans', sans-serif",
                            transition: 'color 0.2s',
                            position: 'relative',
                          }}
                        >
                          {t(l.l)}
                          {(isActive || isHovered) && (
                            <span style={{
                              position: 'absolute', bottom: 0,
                              left: '0.85rem', right: '0.85rem',
                              display: 'flex', justifyContent: 'center',
                              pointerEvents: 'none',
                            }}>
                              <motion.span
                                layoutId="nav-underline"
                                style={{
                                  display: 'block', height: 2, width: '100%', borderRadius: 2,
                                  background: isActive
                                    ? 'linear-gradient(90deg, #2354F4, #7C3AED)'
                                    : 'rgba(35,84,244,0.35)',
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1.5rem' }}>
                  {config.showHome && (
                    <button
                      onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                      style={{
                        padding: '0.4rem 0.85rem', borderRadius: 8,
                        fontSize: '0.78rem', fontWeight: 700,
                        background: 'none', color: 'var(--text3)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#2354F4'; e.currentTarget.style.borderColor = '#2354F4'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      🏠 Home
                    </button>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.2rem',
                    background: 'var(--bg3)', padding: '0.25rem',
                    borderRadius: 12, border: '1px solid var(--border)',
                  }}>
                    {config.tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => goTab(tab.id)}
                        style={{
                          padding: '0.4rem 0.85rem', borderRadius: 8,
                          fontSize: '0.78rem', fontWeight: 700,
                          background: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                          color: activeTab === tab.id ? '#2354F4' : 'var(--text3)',
                          border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                          boxShadow: activeTab === tab.id ? '0 1px 4px var(--card-hover-shadow)' : 'none',
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (activeTab !== tab.id) e.target.style.color = 'var(--text2)'; }}
                        onMouseLeave={e => { if (activeTab !== tab.id) e.target.style.color = 'var(--text3)'; }}
                      >
                        {tab.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Desktop Right Actions ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.55rem',
                borderLeft: '1px solid var(--border)', paddingLeft: '1.2rem', marginLeft: '0.4rem',
              }}>
                {config.showAuth && (
                  <>
                    <Link to="/login" style={{
                      fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)',
                      textDecoration: 'none', padding: '0.45rem 0.8rem', borderRadius: 9,
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.target.style.color = '#2354F4'; }}
                      onMouseLeave={e => { e.target.style.color = 'var(--text2)'; }}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link to="/login" className="btn-p" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}>
                      {t('common.getAccess')}
                    </Link>
                  </>
                )}

                {config.showTabs && user && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.35rem 0.8rem', borderRadius: 10,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 700, color: '#fff',
                      }}>
                        {user.initials}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>{user.name}</span>
                    </div>
                    <button
                      onClick={onLogout}
                      title="Logout"
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'none', border: '1px solid var(--border)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text3)', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = 'var(--text3)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      <LogOut style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                )}

                {/* Theme Toggle */}
                <motion.button
                  onClick={() => setDark(!dark)}
                  aria-label="Toggle Theme"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text2)', transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={dark ? 'sun' : 'moon'}
                      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                      exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex' }}
                    >
                      {dark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                {/* Language Selector */}
                <div style={{ position: 'relative' }}>
                  <motion.button
                    onClick={() => setLangOpen(!langOpen)}
                    aria-label="Change Language"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text2)', fontSize: '0.7rem', fontWeight: 700,
                    }}
                  >
                    {language === 'en' ? '🌐 EN' : '🌐 HI'}
                  </motion.button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0,  scale: 1    }}
                        exit={{    opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute', top: 44, right: 0,
                          background: 'var(--card-bg)', border: '1px solid var(--border)',
                          borderRadius: 12, overflow: 'hidden', zIndex: 100,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 120,
                        }}
                      >
                        {[{ code: 'en', label: '🇺🇸 English' }, { code: 'hi', label: '🇮🇳 हिंदी' }].map(lang => (
                          <button key={lang.code}
                            onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                            style={{
                              width: '100%', padding: '0.6rem 1rem',
                              background: language === lang.code ? 'rgba(35,84,244,0.1)' : 'transparent',
                              border: 'none', color: language === lang.code ? '#2354F4' : 'var(--text2)',
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
              </div>
            </div>

            {/* ── Mobile Top Controls (theme + lang only, no hamburger) ── */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {/* Theme Toggle */}
                <button
                  onClick={() => setDark(!dark)}
                  aria-label="Toggle Theme"
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text3)',
                  }}
                >
                  {dark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
                </button>

                {/* Language Toggle */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text3)', fontSize: '0.7rem', fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {language === 'en' ? 'EN' : 'HI'}
                  </button>
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0,  scale: 1    }}
                        exit={{    opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute', top: 44, right: 0,
                          background: 'var(--card-bg)', border: '1px solid var(--border)',
                          borderRadius: 12, overflow: 'hidden', zIndex: 100,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: 130,
                        }}
                      >
                        {[{ code: 'en', label: '🇺🇸 English' }, { code: 'hi', label: '🇮🇳 हिंदी' }].map(lang => (
                          <button key={lang.code}
                            onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                            style={{
                              width: '100%', padding: '0.65rem 1rem',
                              background: language === lang.code ? 'rgba(35,84,244,0.1)' : 'transparent',
                              border: 'none', color: language === lang.code ? '#2354F4' : 'var(--text2)',
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
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ══════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ══════════════════════════════ */}
      {isMobile && mobileNavItems.length > 0 && (
        <div className="mob-bottom-nav">
          {mobileNavItems.map(item => {
            const active = isMobItemActive(item);
            return (
              <button
                key={item.id}
                className={`mob-nav-item${active ? ' mob-active' : ''}`}
                onClick={() => handleMobNavClick(item)}
                aria-label={item.label}
              >
                <div className="mob-nav-pip" />
                <div className="mob-nav-icon">
                  <item.Icon
                    size={active ? 21 : 20}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </div>
                <span className="mob-nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════
          MOBILE MORE SHEET
      ══════════════════════════════ */}
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="mob-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                className="mob-sheet"
                initial={{ y: '100%', opacity: 0.8 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0.8 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              >
                <div className="mob-sheet-handle" />

                {/* Dashboard user info */}
                {config.showTabs && user && (
                  <div className="mob-sheet-user" style={{ marginBottom: '0.5rem' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, color: '#fff', fontSize: '0.85rem', flexShrink: 0,
                    }}>
                      {user?.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
                    </div>
                  </div>
                )}

                {/* More pages (landing / student) */}
                {moreSheetItems.length > 0 && (
                  <>
                    <div className="mob-sheet-section-title">Pages</div>
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
                          <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text3)', marginTop: 2 }}>
                            {item.desc}
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--text3)', flexShrink: 0 }} />
                      </button>
                    ))}
                    <div className="mob-sheet-divider" />
                  </>
                )}

                {/* Home link for dashboards */}
                {config.showTabs && config.showHome && (
                  <>
                    <div className="mob-sheet-section-title" style={{ marginTop: 0 }}>Navigation</div>
                    <button
                      className="mob-sheet-item"
                      onClick={() => { setMobileOpen(false); navigate('/'); window.scrollTo(0, 0); }}
                    >
                      <div className="mob-sheet-emoji">🏠</div>
                      <div>
                        <div style={{ lineHeight: 1.2 }}>Back to Home</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text3)', marginTop: 2 }}>
                          Return to landing page
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--text3)', flexShrink: 0 }} />
                    </button>
                    <div className="mob-sheet-divider" />
                  </>
                )}

                {/* Logout button for dashboards */}
                {config.showTabs && (
                  <button
                    onClick={() => { setMobileOpen(false); onLogout?.(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      width: '100%', padding: '0.8rem 0.75rem',
                      borderRadius: 14, border: 'none',
                      background: 'rgba(239,68,68,0.07)',
                      color: '#ef4444', fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 12,
                      background: 'rgba(239,68,68,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LogOut size={17} />
                    </div>
                    Sign Out
                  </button>
                )}

                {/* Auth buttons for landing */}
                {config.showAuth && (
                  <div className="mob-sheet-auth">
                    <Link
                      to="/login"
                      className="btn-g"
                      onClick={() => setMobileOpen(false)}
                      style={{ justifyContent: 'center', textAlign: 'center', padding: '0.7rem' }}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/login"
                      className="btn-p"
                      onClick={() => setMobileOpen(false)}
                      style={{ justifyContent: 'center', textAlign: 'center', padding: '0.7rem' }}
                    >
                      {t('common.getAccess')}
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
