import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import BanGate from './components/BanGate';
import { AnimatePresence, motion } from 'framer-motion';
import { applySeo } from './utils/seo';

import QuestraShell from './pages/questra/QuestraShell';
import ChatbaseWidget from './components/ChatbaseWidget';
import { Toaster } from './components/Toast';

// Code-split every non-landing route so the landing bundle stays lean.
// Each of these becomes its own chunk, fetched only when navigated to.
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SchoolDashboard = lazy(() => import('./pages/SchoolDashboard'));
const BannedPage = lazy(() => import('./pages/BannedPage'));

function RouteFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '3px solid var(--border)', borderTopColor: '#7C3AED',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  // SPA equivalent of per-page server-rendered meta: swap title/description/
  // canonical/OG tags on every route change.
  useEffect(() => {
    applySeo(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ minHeight: '100%' }}
      >
        <BanGate>
        <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          {/* New beautifully styled UI */}
          <Route path="/" element={<QuestraShell />} />

          {/* Legacy routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/api/auth/callback/google" element={<GoogleCallback />} />
          {/* Legal pages — multiple path aliases so links always resolve */}
          <Route path="/privacy"         element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy"  element={<PrivacyPolicyPage />} />
          <Route path="/terms"           element={<TermsConditionsPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/cookie-policy"   element={<CookiePolicyPage />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school"
            element={
              <ProtectedRoute allowedRoles={['school']}>
                <SchoolDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/banned" element={<BannedPage />} />
        </Routes>
        </Suspense>
        </BanGate>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <ChatbaseWidget />
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
