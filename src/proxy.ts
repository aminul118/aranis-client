import { NextResponse, type NextRequest } from 'next/server';
import { tryRefreshToken } from './services/auth/refreshToken';
import { decodeToken, setAuthCookies } from './services/user/proxy-utils';
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  UserRole,
} from './services/user/user-access';
import getVerifiedUser from './services/user/verified-user';

/**
 * Next.js Middleware to handle authentication, token refresh, and role-based access control.
 */
export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isAuthPage = isAuthRoute(pathname);
  const routeOwner = getRouteOwner(pathname);

  // 1) First try with current access token
  let user = await getVerifiedUser(req);
  let response = NextResponse.next();

  // Helper for redirection
  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, origin));

  // 2) If access is invalid but refresh exists -> refresh once (avoid doing this on auth pages)
  if (!user && !isAuthPage) {
    const refreshed = await tryRefreshToken(req);

    if (refreshed?.accessToken) {
      const { accessToken, refreshToken } = refreshed;

      // Set the new tokens in the response cookies
      setAuthCookies(response, accessToken, refreshToken);

      // Update request headers so Server Components can see the new token in this request
      req.cookies.set('accessToken', accessToken);
      if (refreshToken) req.cookies.set('refreshToken', refreshToken);

      // Decode token to get user info (role, etc.)
      user = decodeToken(accessToken);
    }
  }

  const role = user?.role as UserRole | undefined;

  // 3) Handle Root Route
  if (pathname === '/') {
    return response;
  }

  // 4) Public Auth Pages (guest allowed)
  if (!user && isAuthPage) return response;

  // 5) Logged-in users should not see auth pages (login/register/etc.)
  if (user && isAuthPage) {
    return redirectTo('/');
  }

  // 6) Protect protected routes for guests
  if (!user && routeOwner !== null && pathname !== '/login') {
    return redirectTo('/login');
  }

  // 7) Role-based protection
  if (user && !isValidRedirectForRole(pathname, role!)) {
    return redirectTo(getDefaultDashboardRoute(role!));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
