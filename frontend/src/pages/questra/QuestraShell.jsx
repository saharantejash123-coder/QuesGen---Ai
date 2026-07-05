import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/questra/AppNavbar';
import Footer from '../../components/Footer';
import SignOutModal from '../../components/SignOutModal';
import { getSession, clearSession } from '../../services/authService';
import { applySeo } from '../../utils/seo';

import HomePage from './HomePage';

// Feature pages are code-split: they only download when the visitor opens
// them, keeping the landing page bundle (and LCP) small.
const FeaturesPage = lazy(() => import('./FeaturesPage'));
const Vault15Page = lazy(() => import('./Vault15Page'));
const ScriptLabPage = lazy(() => import('./ScriptLabPage'));
const LogicGenPage = lazy(() => import('./LogicGenPage'));
const PricingPage = lazy(() => import('./PricingPage'));
const AdaptiveTesting = lazy(() => import('../../components/student/AdaptiveTesting'));
const OracleEnginePage = lazy(() => import('./OracleEnginePage'));

const ROLE_PATHS = { student: '/student', teacher: '/teacher', admin: '/admin', school: '/school' };

function PageFallback() {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '3px solid var(--border)', borderTopColor: '#7C3AED',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export default function QuestraShell() {
  const [page, setPage] = useState('home');
  const [signOutModal, setSignOutModal] = useState({ open: false, session: null });
  const navigate = useNavigate();

  /* Logged-in user visits home → ask if they want to sign out */
  useEffect(() => {
    const session = getSession();
    if (session?.role && ROLE_PATHS[session.role]) {
      setSignOutModal({ open: true, session });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Per-page SEO: title, description, canonical, social tags */
  useEffect(() => {
    applySeo(page);
  }, [page]);

  const handleSignOutConfirm = () => {
    clearSession();
    setSignOutModal({ open: false, session: null });
  };

  const handleSignOutCancel = () => {
    const { session } = signOutModal;
    setSignOutModal({ open: false, session: null });
    if (session?.role && ROLE_PATHS[session.role]) {
      navigate(ROLE_PATHS[session.role], { replace: true });
    }
  };

  const render = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'features': return <FeaturesPage setPage={setPage} />;
      case 'vault15': return <Vault15Page />;
      case 'scriptlab': return <ScriptLabPage />;
      case 'logicgen': return <LogicGenPage />;
      case 'adaptive': return <AdaptiveTesting />;
      case 'pricing': return <PricingPage />;
      case 'oracle': return <OracleEnginePage setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <AppNavbar
        role="landing"
        activeTab={page}
        setActiveTab={setPage}
      />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageFallback />}>{render()}</Suspense>
      </main>
      <Footer setPage={setPage} />

      {/* Sign-out confirmation when a logged-in user visits the home page */}
      <SignOutModal
        isOpen={signOutModal.open}
        userName={signOutModal.session
          ? `${signOutModal.session.firstName || ''} ${signOutModal.session.lastName || ''}`.trim() || signOutModal.session.email
          : ''}
        onConfirm={handleSignOutConfirm}
        onCancel={handleSignOutCancel}
      />
    </div>
  );
}
