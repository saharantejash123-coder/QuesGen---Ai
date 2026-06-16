import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../services/authService';
import { syncBanFromBackend, getActiveBan } from '../services/adminService';

const SKIP_PATHS = ['/login', '/register', '/banned', '/', '/classic', '/privacy', '/terms'];
const POLL_INTERVAL_MS = 20000; // check backend every 20 seconds for instant cross-device enforcement

export default function BanGate({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pollRef = useRef(null);

  const checkBan = (pathname) => {
    const user = getSession();
    if (!user) return;

    // Fast path — local ban (synchronous, instant)
    if (getActiveBan(user.email)) {
      if (!SKIP_PATHS.includes(pathname)) navigate('/banned', { replace: true });
      return;
    }

    // Backend sync — cross-device enforcement
    syncBanFromBackend(user).then(result => {
      if (result?.banned && !SKIP_PATHS.includes(pathname)) {
        navigate('/banned', { replace: true });
      }
    });
  };

  // Check on every navigation
  useEffect(() => {
    checkBan(location.pathname);
  }, [location.pathname]);

  // Also poll every 20 seconds so banned users are kicked out fast even without navigating
  useEffect(() => {
    pollRef.current = setInterval(() => {
      checkBan(location.pathname);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [location.pathname]);

  return children;
}
