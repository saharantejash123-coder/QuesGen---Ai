const db = require('./db/database');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }
    
    const { verifyAccessToken } = require('./auth');
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.role = decoded.role;

    // Check if user is banned
    db.get('SELECT status FROM banned_users WHERE user_id = ? AND status = ?', [req.userId, 'active'], (err, row) => {
      if (row) {
        return res.status(403).json({
          success: false,
          error: 'Your account has been banned. Contact support for assistance.'
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Insufficient permissions' 
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};
