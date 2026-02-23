import envVars from '@/config/env.config';
import { type NextRequest } from 'next/server';

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

const tryRefreshToken = async (req: NextRequest) => {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) return null;

  try {
    // Use native fetch to avoid Node-only dependencies in Edge runtime
    const res = await fetch(`${envVars.baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const result = await res.json();

    if (!result.success || !result?.data?.accessToken) return null;

    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    } as RefreshResponse;
  } catch (error) {
    console.error('tryRefreshToken Edge error:', error);
    return null;
  }
};

export { tryRefreshToken };
