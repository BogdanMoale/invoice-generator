// Public routes are routes that are accessible to all users, whether they are logged in or not.
export const publicRoutes = ["/", "/terms-of-service", "/privacy-policy"];

//routes that are used for authentication
export const authenticationRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

//this route need to be allways accesible
export const apiAuth = "/api/auth";

export const DEFAULT_REDIRECT = "/invoices";

export const adminRoutes = ["/users"];
