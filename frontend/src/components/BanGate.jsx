import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../services/authService';
import { syncBanFromBackend, getActiveBan } from '../services/adminService';

const SKIP_PATHS = ['/login', '/register', '/banned', '/', '/classic', '/privacy', '/terms'];

export default function BanGate({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = getSession();
    if (!user) return;

    // Fast path — local ban
    if (getActiveBan(user.email)) {
      if (!SKIP_PATHS.includes(location.pathname)) navigate('/banned', { replace: true });
      return;
    }

    // Backend sync — cross-device
    syncBanFromBackend(user).then(result => {
      if (result?.banned && !SKIP_PATHS.includes(location.pathname)) {
        navigate('/banned', { replace: true });
      }
    });
  }, [location.pathname]);

  return children;
}
