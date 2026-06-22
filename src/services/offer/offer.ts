'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IOffer } from '@/services/offer/offer.interface';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { logger } from '../../lib/logger';

// Helper to trigger concurrent Next.js revalidations
const triggerRevalidations = () => {
  try {
    revalidatePath('/offers');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidate('product');
    revalidate('offer');
  } catch (error) {
    logger.error('Failed to trigger Next.js cache revalidations:', error);
  }
};

export const createOffer = async (payload: Partial<IOffer>) => {
  const res = await serverFetch.post<ApiResponse<IOffer>>('/offers/create', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  triggerRevalidations();
  return res;
};

export const getOffers = async (params: Record<string, any> = {}) => {
  const query = new URLSearchParams(params).toString();
  return await serverFetch.get<ApiResponse<IOffer[]>>(`/offers?${query}`, {
    cache: 'force-cache',
    next: { tags: ['offer'] },
  });
};

export const updateOffer = async (id: string, payload: Partial<IOffer>) => {
  const res = await serverFetch.patch<ApiResponse<IOffer>>(`/offers/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  triggerRevalidations();
  return res;
};

export const deleteOffer = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<any>>(`/offers/${id}`);
  triggerRevalidations();
  return res;
};

export const applyOffer = async (tag: string, productIds: string[]) => {
  const res = await serverFetch.post<ApiResponse<any>>('/offers/apply', {
    body: JSON.stringify({ tag, productIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  triggerRevalidations();
  return res;
};

export const applyOfferToAll = async (tag: string) => {
  const res = await serverFetch.post<ApiResponse<any>>('/offers/apply-all', {
    body: JSON.stringify({ tag }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  triggerRevalidations();
  return res;
};

export const getActiveOffer = async () => {
  return await serverFetch.get<ApiResponse<IOffer>>('/offers/active', {
    cache: 'force-cache',
    next: { tags: ['offer'] },
  });
};
