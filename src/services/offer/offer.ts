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

export const getOffers = async (params: Record<string, any> = {}) => {
  const query = new URLSearchParams(params).toString();
  return await serverFetch.get<ApiResponse<IOffer[]>>(`/offers?${query}`);
};

export const updateOffer = async (id: string, payload: Partial<IOffer>) => {
  return await serverFetch.patch<ApiResponse<IOffer>>(`/offers/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteOffer = async (id: string) => {
  return await serverFetch.delete<ApiResponse<any>>(`/offers/${id}`);
};

export const applyOffer = async (tag: string, productIds: string[]) => {
  return await serverFetch.post<ApiResponse<any>>('/offers/apply', {
    body: JSON.stringify({ tag, productIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const applyOfferToAll = async (tag: string) => {
  return await serverFetch.post<ApiResponse<any>>('/offers/apply-all', {
    body: JSON.stringify({ tag }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getActiveOffer = async () => {
  return await serverFetch.get<ApiResponse<IOffer>>('/offers/active');
};
