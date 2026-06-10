import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('questra_user');
  const token = localStorage.getItem('questra_token');
  
  if (!userStr || !token) {
    // Not logged in or stale session, redirect to login
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // If specific roles are required and the user's role isn't among them
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to their respective dashboard or a generic unauthorized page
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
      return <Navigate to="/student" replace />;
    }
    
    // User is authenticated and authorized
    return children;
  } catch (error) {
    // Invalid JSON in localStorage, force login
    localStorage.removeItem('questra_user');
    localStorage.removeItem('questra_token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
