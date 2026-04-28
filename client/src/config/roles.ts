export const ROLES = {
  Employee: "Employee",
  Manager: "Manager",
  Admin: "Admin",
} as const;

//as const tells TS: "these values won't change. Treat them as their exact literal values, forever."

// tells TS: "these values won't change. Treat them as their exact literal values, forever."

// Now:

// ROLES.Manager  →  "Manager"      (the exact string, not "any string")
// ROLES.Admin    →  "Admin"
// ROLES.Employee →  "Employee"

export type Role = (typeof ROLES)[keyof typeof ROLES];

//type Role = "Employee" | "Manager" | "Admin"
//iterate through each role using key
