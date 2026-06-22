'use server';

import type { FetchOptions } from '@/helpers/serverFetchHelper';
import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IOrderPayload } from '@/services/order/order.interface';
import { ApiResponse } from '@/types';
import { logger } from '../../lib/logger';
import type { IOrder } from './order.types';
import { OrderStatus } from './order.types';

// Types are re-exported from the types file — import them directly from order.types.ts in client components
export type {
  IOrder,
  IOrderItem,
  OrderStatus,
  PaymentStatus,
} from './order.types';

const createOrder = async (payload: IOrderPayload) => {
  const res = await serverFetch.post<ApiResponse<any>>('/orders', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  await revalidate(['ME', 'order', 'product']);

  try {
    const { revalidatePath } = require('next/cache');
    revalidatePath('/offers');
    revalidatePath('/shop');
    revalidatePath('/');
  } catch (e) {
    logger.error(e);
  }

  return res;
};

const getAllOrders = async (
  query: Record<string, string>,
  options?: FetchOptions,
) => {
  return await serverFetch.get<ApiResponse<IOrder[]>>('/orders', {
    query,
    next: { tags: ['order'], ...options?.next },
    ...options,
    headers: { ...options?.headers },
  });
};

const getMyOrders = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IOrder[]>>('/orders/my-orders', {
    query,
    cache: 'no-store',
  });
};

const getSingleOrder = async (id: string, options?: FetchOptions) => {
  return await serverFetch.get<ApiResponse<IOrder>>(`/orders/${id}`, {
    next: { tags: ['order'], ...options?.next },
    ...options,
    headers: { ...options?.headers },
  });
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const res = await serverFetch.patch<ApiResponse<IOrder>>(
    `/orders/update-status/${id}`,
    {
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate(['order', 'product']);

  try {
    const { revalidatePath } = require('next/cache');
    revalidatePath('/offers');
    revalidatePath('/shop');
    revalidatePath('/');
  } catch (e) {
    logger.error(e);
  }
  return res;
};

const trackOrder = async (id: string) => {
  return await serverFetch.get<ApiResponse<IOrder>>(`/orders/track/${id}`);
};

const deleteOrderBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/orders/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await revalidate(['order', 'product']);

  try {
    const { revalidatePath } = require('next/cache');
    revalidatePath('/offers');
    revalidatePath('/shop');
    revalidatePath('/');
  } catch (e) {
    logger.error(e);
  }
  return res;
};

const getUnreadOrdersCount = async () => {
  return await serverFetch.get<ApiResponse<number>>('/orders/unread-count', {
    cache: 'no-store',
  });
};

export {
  createOrder,
  deleteOrderBulk,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  getUnreadOrdersCount,
  trackOrder,
  updateOrderStatus,
};
