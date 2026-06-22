'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IGiftCard } from '@/services/giftcard/giftcard.interface';
import { ApiResponse } from '@/types';

export const createGiftCard = async (formData: FormData) => {
  const res = await serverFetch.post<ApiResponse<IGiftCard>>('/giftcards', {
    body: formData,
  });
  await revalidate('giftcard');
  return res;
};

export const updateGiftCard = async (id: string, formData: FormData) => {
  const res = await serverFetch.patch<ApiResponse<IGiftCard>>(
    `/giftcards/${id}`,
    {
      body: formData,
    },
  );
  await revalidate('giftcard');
  return res;
};

export const getGiftCards = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IGiftCard[]>>('/giftcards', {
    query,
    next: {
      tags: ['giftcard'],
      revalidate: 3600, // cache for 1 hour
    },
  });
};

export const getSingleGiftCard = async (id: string) => {
  return await serverFetch.get<ApiResponse<IGiftCard>>(`/giftcards/${id}`);
};

export const deleteGiftCard = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IGiftCard>>(
    `/giftcards/${id}`,
  );
  await revalidate('giftcard');
  return res;
};

export const deleteGiftCardBulk = async (ids: string[]) => {
  const res = await serverFetch.patch<ApiResponse<IGiftCard>>(
    '/giftcards/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate('giftcard');
  return res;
};
