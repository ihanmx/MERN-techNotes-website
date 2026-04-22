// Middleware factory: returns a middleware that allows the request only
// if the JWT-decoded roles (set by verifyJWT on req.roles) include one
// of the allowed roles. Must be mounted AFTER verifyJWT.
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!Array.isArray(req.roles) || !req.roles.length) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const hasRole = req.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = requireRoles;
