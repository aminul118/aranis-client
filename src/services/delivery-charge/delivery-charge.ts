'use server';

import serverFetch from '@/lib/server-fetch';
import type { IDeliveryCharge } from '@/services/delivery-charge/delivery-charge.interface';
import type { ApiResponse } from '@/types';
import { logger } from '../../lib/logger';

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
    logger.error(e);
  }

  return res;
};
