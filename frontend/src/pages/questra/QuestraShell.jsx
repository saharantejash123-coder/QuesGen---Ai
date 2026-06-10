import React, { useState } from 'react';
import AppNavbar from '../../components/questra/AppNavbar';
import Footer from '../../components/Footer';

import HomePage from './HomePage';
import FeaturesPage from './FeaturesPage';
import Vault15Page from './Vault15Page';
import ScriptLabPage from './ScriptLabPage';
import LogicGenPage from './LogicGenPage';
import PricingPage from './PricingPage';
import AdaptiveTesting from '../../components/student/AdaptiveTesting';
import OracleEnginePage from './OracleEnginePage';

export default function QuestraShell() {
  const [page, setPage] = useState('home');

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
    </div>
  );
}
