'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IStats } from '@/types';

const getAdminStats = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IStats>>('/stats', {
    query,
    cache: 'no-store',
  });
};

export { getAdminStats };
