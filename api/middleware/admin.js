// Middleware to check if user is an admin
module.exports = function(req, res, next) {
  // Check user role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required' });
  }
};