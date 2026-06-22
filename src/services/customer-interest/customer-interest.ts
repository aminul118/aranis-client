'use server';

import serverFetch from '@/lib/server-fetch';
import type {
  ICustomerInterestItem,
  IProductInterestUser,
} from '@/services/customer-interest/customer-interest.interface';
import { ApiResponse } from '@/types';

const getCustomerInterestStats = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<ICustomerInterestItem[]>>(
    '/stats/customer-interest',
    {
      query,
      cache: 'no-store',
    },
  );
};

const getProductInterestUsers = async (productId: string) => {
  return await serverFetch.get<ApiResponse<IProductInterestUser[]>>(
    `/stats/customer-interest/${productId}/users`,
    {
      cache: 'no-store',
    },
  );
};

export { getCustomerInterestStats, getProductInterestUsers };
