import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import BanGate from './components/BanGate';
import { AnimatePresence, motion } from 'framer-motion';

import QuestraShell from './pages/questra/QuestraShell';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleCallback from './pages/GoogleCallback';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import BannedPage from './pages/BannedPage';
import ChatbaseWidget from './components/ChatbaseWidget';
import { Toaster } from './components/Toast';

function AnimatedRoutes() {
  const location = useLocation();

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
        </BanGate>
      </motion.div>
    </AnimatePresence>
  );
}

const GOOGLE_CLIENT_ID = '462752093792-7qe3v01bs6a25v8ldsttt9cenvg1mtg1.apps.googleusercontent.com';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <ChatbaseWidget />
            <Toaster />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}


