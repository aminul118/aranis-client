export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

// Public auth pages
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// COMMON protected routes (all logged-in users)
const commonProtectedRoutes: RouteConfig = {
  exact: ['/my-profile', '/settings'],
  patterns: [/^\/password(\/|$)/], // optional password routes
};

// SUPER_ADMIN only routes
const superAdminProtectedRoutes: RouteConfig = {
  patterns: [/^\/doctor(\/|$)/, /^\/assistants(\/|$)/, /^\/appointments(\/|$)/],
  exact: [],
};

// ADMIN only routes
const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin(\/|$)/],
  exact: [],
};

// USER only routes
const userProtectedRoutes: RouteConfig = {
  patterns: [/^\/user(\/|$)/],
  exact: [],
};

// Check if route is auth page
const isAuthRoute = (pathname: string) => authRoutes.includes(pathname);

// Check if a pathname matches a RouteConfig
const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((p) => p.test(pathname));
};

// Determine route owner
const getRouteOwner = (
  pathname: string,
): 'ADMIN' | 'SUPER_ADMIN' | 'COMMON' | 'USER' | null => {
  // SUPER_ADMIN first
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) return 'SUPER_ADMIN';
  if (isRouteMatches(pathname, adminProtectedRoutes)) return 'ADMIN';
  if (isRouteMatches(pathname, userProtectedRoutes)) return 'USER';
  if (isRouteMatches(pathname, commonProtectedRoutes)) return 'COMMON';
  return null; // public route
};

// Default dashboard per role
const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'SUPER_ADMIN') return '/admin';
  if (role === 'USER') return '/user';
  return '/';
};

// Check if role can access path
const isValidRedirectForRole = (path: string, role: UserRole): boolean => {
  if (role === 'SUPER_ADMIN') return true;
  const owner = getRouteOwner(path);
  if (owner === null || owner === 'COMMON') return true;
  return owner === role;
};

export {
  adminProtectedRoutes,
  authRoutes,
  commonProtectedRoutes,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isRouteMatches,
  isValidRedirectForRole,
  superAdminProtectedRoutes,
  userProtectedRoutes,
};
