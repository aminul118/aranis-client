'use server';

import serverFetch from '@/lib/server-fetch';
import type { ApiResponse } from '@/types';

export interface IDeliveryCharge {
  insideDhaka: number;
  outsideDhaka: number;
  freeDeliveryThreshold: number;
}

export const getDeliveryCharge = async () => {
  return await serverFetch.get<ApiResponse<IDeliveryCharge>>(
    '/delivery-charge',
    {
      next: { tags: ['delivery-charge'] },
    },
  );
};

export const updateDeliveryCharge = async (data: IDeliveryCharge) => {
  const res = await serverFetch.put<ApiResponse<IDeliveryCharge>>(
    '/delivery-charge',
    {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  try {
    const { revalidateTag } = require('next/cache');
    revalidateTag('delivery-charge');
  } catch (e) {
    console.error(e);
  }

  return res;
};
