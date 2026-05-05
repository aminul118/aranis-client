'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IProduct, IUser } from '@/types';

export interface IRestockRequest {
  _id: string;
  user: IUser;
  product: IProduct;
  status: 'Pending' | 'Resolved';
  createdAt: string;
}

export const createRestockRequest = async (productId: string) => {
  const res = await serverFetch.post<ApiResponse<null>>('/restock-request', {
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('restock');
  return res;
};

export const getRestockRequests = async () => {
  return await serverFetch.get<ApiResponse<IRestockRequest[]>>(
    '/restock-request',
    {
      next: { tags: ['restock'] },
    },
  );
};

export const resolveRestockRequest = async (id: string) => {
  const res = await serverFetch.patch<ApiResponse<null>>(
    `/restock-request/${id}/resolve`,
  );
  revalidate('restock');
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
  revalidate('restock');
  return res;
};
