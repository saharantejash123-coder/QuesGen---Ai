import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the URL to get auth data (this handles server-side Google OAuth redirects)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      try {
        // Save session
        localStorage.setItem('questra_token', token);
        localStorage.setItem('questra_user', JSON.stringify(JSON.parse(user)));

        // Redirect to appropriate dashboard
        const userData = JSON.parse(user);
        if (userData.role === 'teacher') navigate('/teacher');
        else if (userData.role === 'school') navigate('/school');
        else if (userData.role === 'admin') navigate('/admin');
        else navigate('/student');
      } catch (err) {
        console.error('Error parsing callback:', err);
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
