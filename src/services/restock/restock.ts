'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IRestockRequest } from '@/services/restock/restock.interface';
import { ApiResponse } from '@/types';

export const createRestockRequest = async (productId: string) => {
  const res = await serverFetch.post<ApiResponse<null>>('/restock-request', {
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await revalidate('restock');
  return res;
};

export const getRestockRequests = async (
  params: Record<string, string> = {},
) => {
  const query = new URLSearchParams(params).toString();
  return await serverFetch.get<ApiResponse<IRestockRequest[]>>(
    `/restock-request${query ? `?${query}` : ''}`,
    {
      next: { tags: ['restock'] },
    },
  );
};

export const getMyRestockRequests = async (
  params: Record<string, string> = {},
) => {
  const query = new URLSearchParams(params).toString();
  return await serverFetch.get<ApiResponse<IRestockRequest[]>>(
    `/restock-request/my-requests${query ? `?${query}` : ''}`,
    {
      next: { tags: ['restock'] },
    },
  );
};

export const resolveRestockRequest = async (id: string) => {
  const res = await serverFetch.patch<ApiResponse<null>>(
    `/restock-request/${id}/resolve`,
  );
  await revalidate('restock');
  return res;
};

export const deleteRestockRequestBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/restock-request/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate('restock');
  return res;
};

export const deleteRestockRequest = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    `/restock-request/${id}`,
  );
  await revalidate('restock');
  return res;
};
