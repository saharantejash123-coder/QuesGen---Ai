import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { syncBanFromBackend } from '../services/adminService';

const BANS_KEY = 'questra_bans';

function getLocalActiveBan(email) {
  try {
    const bans = JSON.parse(localStorage.getItem(BANS_KEY)) || [];
    return bans.find(b => b.email === email && b.status === 'active') || null;
  } catch { return null; }
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('questra_user');
  const token = localStorage.getItem('questra_token');
  const [backendBanned, setBackendBanned] = useState(null); // null=checking, true=banned, false=not
  const checked = useRef(false);

  useEffect(() => {
    if (!userStr || !token) return;
    if (checked.current) return;
    checked.current = true;
    try {
      const user = JSON.parse(userStr);
      syncBanFromBackend(user).then(r => {
        setBackendBanned(r === null ? 'unreachable' : !!r?.banned);
      });
    } catch { setBackendBanned(false); }
  }, []);

  if (!userStr || !token) {
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // Fast path: if localStorage says banned, redirect immediately
    if (getLocalActiveBan(user.email)) return <Navigate to="/banned" replace />;

    // If backend says banned (after async), redirect
    if (backendBanned === true) return <Navigate to="/banned" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
      return <Navigate to="/student" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
