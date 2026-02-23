'use server';

import envVars from '@/config/env.config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || null;
};

const verifyAccessToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    return jwt.verify(token, envVars.jwt.accessSecret) as JwtPayload;
  } catch {
    return null;
  }
};

const verifyRefreshToken = async (
  token: string,
): Promise<JwtPayload | null> => {
  try {
    return jwt.verify(token, envVars.jwt.refreshSecret) as JwtPayload;
  } catch {
    return null;
  }
};

const setCookie = async (
  key: string,
  value: string,
  options: Partial<ResponseCookie>,
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
};

const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

export {
  deleteCookie,
  getCookie,
  setCookie,
  verifyAccessToken,
  verifyRefreshToken,
};
