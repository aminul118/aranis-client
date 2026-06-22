'use server';

import serverFetch from '@/lib/server-fetch';
import type { IStats } from '@/services/stats/stats.interface';
import { ApiResponse } from '@/types';

const getAdminStats = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IStats>>('/stats', {
    query,
    next: {
      tags: ['admin-stats'],
    },
  });
};

export { getAdminStats };
