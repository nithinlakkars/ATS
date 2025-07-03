// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (roles = []) => async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || (roles.length && !roles.includes(user.role))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
// Role-based access control
const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// module.exports = { protect, restrictTo };
