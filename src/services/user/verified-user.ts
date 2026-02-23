/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const getVerifiedUser = async (
  req?: NextRequest,
): Promise<DecodedToken | null> => {
  try {
    let accessToken: string | null = null;

    if (req) {
      accessToken = req.cookies.get('accessToken')?.value ?? null;
    } else {
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      accessToken = (await cookieStore).get('accessToken')?.value ?? null;
    }

    if (!accessToken) return null;

    let payload: any = null;

    if (req) {
      // Edge runtime safe decoding
      try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        payload = JSON.parse(jsonPayload);

        // Check expiration
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          return null;
        }
      } catch (e) {
        console.error('getVerifiedUser Edge decode error:', e);
        return null;
      }
    } else {
      // Server-side (Node.js) formal verification
      const { verifyAccessToken } = await import('@/lib/jwt');
      payload = await verifyAccessToken(accessToken);
    }

    if (!payload) return null;

    const { userId, email, role, iat, exp } = payload;
    if (!userId || !email) return null;

    return { userId, email, role, iat, exp } as DecodedToken;
  } catch (err) {
    console.error('getVerifiedUser error:', (err as Error).message ?? err);
    return null;
  }
};

export default getVerifiedUser;
