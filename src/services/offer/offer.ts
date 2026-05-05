'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IOffer {
  _id?: string;
  name: string;
  tag: string;
  discountPercentage: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
}

export const createOffer = async (payload: Partial<IOffer>) => {
  return await serverFetch.post<ApiResponse<IOffer>>('/offers/create', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getOffers = async () => {
  return await serverFetch.get<ApiResponse<IOffer[]>>('/offers');
};

export const applyOffer = async (tag: string, productIds: string[]) => {
  return await serverFetch.post<ApiResponse<any>>('/offers/apply', {
    body: JSON.stringify({ tag, productIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
