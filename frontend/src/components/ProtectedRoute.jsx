import React from 'react';
import { Navigate } from 'react-router-dom';

const BANS_KEY = 'questra_bans';

function getActiveBan(email) {
  try {
    const bans = JSON.parse(localStorage.getItem(BANS_KEY)) || [];
    return bans.find(b => b.email === email && b.status === 'active') || null;
  } catch { return null; }
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('questra_user');
  const token = localStorage.getItem('questra_token');
  
  if (!userStr || !token) {
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    if (getActiveBan(user.email)) return <Navigate to="/banned" replace />;
    
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
