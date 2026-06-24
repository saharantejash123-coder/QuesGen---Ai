import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { loginWithGoogleToken, saveSession, ensureUID } from '../services/authService';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const go = (role) => {
      const r = (role || 'student').toLowerCase();
      if (r === 'admin') navigate('/admin');
      else if (r === 'school') navigate('/school');
      else if (r === 'teacher') navigate('/teacher');
      else navigate('/student');
    };

    // Handle redirect flow — id_token in URL hash
    const hash = new URLSearchParams(window.location.hash.replace('#', ''));
    const idToken = hash.get('id_token');

    if (idToken) {
      loginWithGoogleToken(idToken)
        .then(user => {
          saveSession(user);
          if (user._banned) { navigate('/banned', { replace: true }); return; }
          go(user.role);
        })
        .catch((err) => {
          try { sessionStorage.setItem('questra_login_error', err?.message || 'Google sign-in failed. Please try again.'); } catch { /* ignore */ }
          navigate('/login', { replace: true });
        });
      return;
    }

    // Handle server-side flow — token + user in query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      try {
        localStorage.setItem('questra_token', token);
        localStorage.setItem('questra_user', JSON.stringify(ensureUID(JSON.parse(user))));
        go(JSON.parse(user).role);
      } catch {
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
        <p className="text-zinc-400">Processing authentication...</p>
      </div>
    </div>
  );
}
