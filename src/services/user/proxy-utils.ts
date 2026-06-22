import { NextResponse } from 'next/server';
import baseCookieOption from '../../config/cookie.config';
import envVars from '../../config/env.config';
import { logger } from '../../lib/logger';

/**
 * Decodes a JWT token manually to extract the payload.
 * Since this runs in Edge Runtime, atob is available.
 */
export function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    // Use decodeURIComponent to correctly parse UTF-8 characters in JWT payload
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    logger.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Sets the access and refresh tokens in the response cookies.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
) {
  response.cookies.set('accessToken', accessToken, {
    ...baseCookieOption,
    maxAge: Number(envVars.jwt.accessTokenMaxAge) || 60 * 60,
  });

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      ...baseCookieOption,
      maxAge: Number(envVars.jwt.refreshTokenMaxAge) || 60 * 60 * 24 * 7,
    });
  }
}
