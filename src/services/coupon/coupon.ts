'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, ICoupon } from '@/types';
export type { ICoupon } from '@/types';

export const getCoupons = async (query?: Record<string, string>) => {
  const params = new URLSearchParams(query);
  return await serverFetch.get<ApiResponse<ICoupon[]>>(
    `/coupon?${params.toString()}`,
    {
      next: { tags: ['COUPONS'] },
    },
  );
};

export const createCoupon = async (data: Partial<ICoupon>) => {
  const res = await serverFetch.post<ApiResponse<ICoupon>>('/coupon', {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('COUPONS');
  return res;
};

export const updateCoupon = async (id: string, data: Partial<ICoupon>) => {
  const res = await serverFetch.patch<ApiResponse<ICoupon>>(`/coupon/${id}`, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('COUPONS');
  return res;
};

export const deleteCoupon = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<null>>(`/coupon/${id}`);
  revalidate('COUPONS');
  return res;
};

export const deleteCouponBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/coupon/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  revalidate('COUPONS');
  return res;
};

export const validateCoupon = async (code: string) => {
  return await serverFetch.get<ApiResponse<ICoupon>>(
    `/coupon/validate/${code}`,
  );
};
