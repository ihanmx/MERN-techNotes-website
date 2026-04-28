import type { RequestHandler } from "express";

const requireRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!Array.isArray(req.roles) || !req.roles.length) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const hasRole = req.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};

export default requireRoles;

// RequestHandler is typed (roughly) like this:

// type RequestHandler = (req, res, next) => void;
// The return type is void — "this function should not return any meaningful value."

// But:

// res.json({...})  // returns: Response
// res.status(401)  // returns: Response (chainable)
// So when you write:

// return res.status(401).json({ message: "Unauthorized" });
// //      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// //      this evaluates to a Response object
// You're saying: "return a Response from a function whose return type is void." TS sees that as a contract violation.

// The error you'd see:

// "Type 'Response<…>' is not assignable to type 'void'."
