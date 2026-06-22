'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IDeliveryCharge } from '@/services/delivery-charge/delivery-charge.interface';
import type { ApiResponse } from '@/types';

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
  await revalidate('delivery-charge');

  return res;
};
