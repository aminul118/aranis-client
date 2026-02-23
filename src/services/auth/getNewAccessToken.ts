'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie, verifyAccessToken } from '@/lib/jwt';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './cookie-token';

export interface IAccessToken {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<any> | null = null;

const getNewAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const accessToken = await getCookie('accessToken');
      const refreshToken = await getCookie('refreshToken');

      if (!accessToken && !refreshToken) return { tokenRefreshed: false };
      if (!refreshToken) return { tokenRefreshed: false };

      if (accessToken) {
        const ok = await verifyAccessToken(accessToken);
        if (ok) return { tokenRefreshed: false };
      }

      const cookieHeader = [
        refreshToken ? `refreshToken=${refreshToken}` : '',
        accessToken ? `accessToken=${accessToken}` : '',
      ]
        .filter(Boolean)
        .join('; ');

      const res = await serverFetch.post<ApiResponse<IAccessToken>>(
        '/auth/refresh-token',
        { headers: { Cookie: cookieHeader } },
      );

      console.log('RES=>', res);

      await setAccessToken(res.data.accessToken);

      // only update refresh if your backend rotates it
      if (res.data.refreshToken) {
        await setRefreshToken(res.data.refreshToken);
      }

      return { tokenRefreshed: true, success: true };
    } catch (error: any) {
      // if refresh fails, clear tokens (optional)
      await removeAccessToken();
      await removeRefreshToken();

      return {
        tokenRefreshed: false,
        success: false,
        message: error?.message || 'Refresh failed',
      };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export { getNewAccessToken };
