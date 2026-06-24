import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/authService';
import { toast } from '../components/Toast';

/* sessionStorage key the login page reads to show the "login first" notice. */
export const LOGIN_NOTICE_KEY = 'questra_login_notice';

/**
 * Auth gate for feature actions on the public landing pages.
 *
 * Returns a guard `requireLogin(featureName)`:
 *   • signed in  → returns true, caller proceeds.
 *   • signed out → stashes a notice, sends the visitor to /login, returns false.
 *
 * Usage inside a final submit handler:
 *   if (!requireLogin('Exam Generator')) return;
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  return useCallback((featureName) => {
    if (getSession()) return true;
    const message = `Login first to use the ${featureName} feature`;
    try { sessionStorage.setItem(LOGIN_NOTICE_KEY, message); } catch { /* ignore storage failures */ }
    toast(message);            // floating toast — survives the redirect (Toaster is mounted at app root)
    navigate('/login');
    return false;
  }, [navigate]);
}
