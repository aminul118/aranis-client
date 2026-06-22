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
  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    if (path === '/login' && pathname !== '/') {
      url.searchParams.set('redirect', pathname);
    }
    const redirectResponse = NextResponse.redirect(url);

    // Preserve any cookies set during the request (e.g. refreshed tokens)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  };

  // 2) If access is invalid but refresh exists -> refresh once
  if (!user && req.cookies.has('refreshToken')) {
    const refreshed = await tryRefreshToken(req);

    if (refreshed?.accessToken) {
      const { accessToken, refreshToken } = refreshed;

      // Update request headers so Server Components can see the new token in this request
      req.cookies.set('accessToken', accessToken);
      if (refreshToken) req.cookies.set('refreshToken', refreshToken);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('cookie', req.cookies.toString());

      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Set the new tokens in the response cookies
      setAuthCookies(response, accessToken, refreshToken);

      // Decode token to get user info (role, etc.)
      user = decodeToken(accessToken);
    }
  }

  const role = (user?.role as UserRole) || 'USER';

  // 3) Handle Root Route
  if (pathname === '/') {
    return response;
  }

  // 4) Public Auth Pages (guest allowed)
  if (!user && isAuthPage) {
    if (
      pathname.startsWith('/verify') &&
      !req.nextUrl.searchParams.has('identifier')
    ) {
      return redirectTo('/login');
    }
    return response;
  }

  // 5) Logged-in users should not see auth pages (login/register/etc.)
  if (user && isAuthPage) {
    return redirectTo(getDefaultDashboardRoute(role));
  }

  // 6) Protect protected routes for guests
  if (!user && routeOwner !== null && pathname !== '/login') {
    return redirectTo('/login');
  }

  // 7) Role-based protection
  if (user && !isValidRedirectForRole(pathname, role)) {
    return redirectTo(getDefaultDashboardRoute(role));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
