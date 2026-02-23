import { NextResponse } from 'next/server';
import baseCookieOption from '../../config/cookie.config';
import envVars from '../../config/env.config';

/**
 * Decodes a JWT token manually to extract the payload.
 * Since this runs in Edge Runtime, atob is available.
 */
export function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Failed to decode token:', error);
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
