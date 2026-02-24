'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ICoupon {
  _id?: string;
  name: string;
  code: string;
  discount: number;
  expiryDate: string | Date;
  isDeleted?: boolean;
}

const createCoupon = async (payload: ICoupon) => {
  const res = await serverFetch.post<ApiResponse<ICoupon>>('/coupons', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('coupon');
  return res;
};

const updateCoupon = async (payload: Partial<ICoupon>, id: string) => {
  const res = await serverFetch.patch<ApiResponse<ICoupon>>(`/coupons/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('coupon');
  return res;
};

const getCoupons = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<ICoupon[]>>('/coupons', {
    query,
    next: {
      tags: ['coupon'],
    },
  });
};

const getSingleCoupon = async (id: string) => {
  return await serverFetch.get<ApiResponse<ICoupon>>(`/coupons/${id}`);
};

const deleteCoupon = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<ICoupon>>(`/coupons/${id}`);
  revalidate('coupon');
  return res;
};

const validateCoupon = async (code: string) => {
  return await serverFetch.get<ApiResponse<ICoupon>>(
    `/coupons/validate/${code}`,
  );
};

export {
  createCoupon,
  deleteCoupon,
  getCoupons,
  getSingleCoupon,
  updateCoupon,
  validateCoupon,
};
