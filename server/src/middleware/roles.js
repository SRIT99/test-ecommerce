exports.allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.userType)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
