const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const userRole = req.user.role || req.user.usertype;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: `Forbidden: role '${userRole}' is not authorized` });
    }
    next();
  };
};

module.exports = { authorizeRoles };
