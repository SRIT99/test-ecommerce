// Updated roles middleware
exports.allow = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Superadmin has access to everything
  if (req.user.userType === 'superadmin') {
    return next();
  }

  // Check if user has one of the allowed roles
  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

// Specific role checkers
exports.allowAdmin = exports.allow('admin', 'superadmin');
exports.allowSeller = exports.allow('seller', 'admin', 'superadmin');