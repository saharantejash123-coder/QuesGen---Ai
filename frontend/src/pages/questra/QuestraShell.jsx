import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/questra/AppNavbar';
import Footer from '../../components/Footer';
import SignOutModal from '../../components/SignOutModal';
import { getSession, clearSession } from '../../services/authService';

import HomePage from './HomePage';
import FeaturesPage from './FeaturesPage';
import Vault15Page from './Vault15Page';
import ScriptLabPage from './ScriptLabPage';
import LogicGenPage from './LogicGenPage';
import PricingPage from './PricingPage';
import AdaptiveTesting from '../../components/student/AdaptiveTesting';
import OracleEnginePage from './OracleEnginePage';

const ROLE_PATHS = { student: '/student', teacher: '/teacher', admin: '/admin', school: '/school' };

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
      <main style={{ flex: 1 }}>{render()}</main>
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
