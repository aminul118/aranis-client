'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import type { IOrder } from './order.types';
import { OrderStatus } from './order.types';

// Types are re-exported from the types file — import them directly from order.types.ts in client components
export type {
  IOrder,
  IOrderItem,
  OrderStatus,
  PaymentStatus,
} from './order.types';

export interface IOrderPayload {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  subTotal: number;
  discount: number;
  couponCode?: string | null;
  shippingAddress: string;
  paymentMethod: 'COD' | 'CARD';
}

const createOrder = async (payload: IOrderPayload) => {
  const res = await serverFetch.post<ApiResponse<any>>('/orders', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  revalidate('ME');
  revalidate('order');

  return res;
};

const getAllOrders = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IOrder[]>>('/orders', {
    query,
    next: {
      tags: ['order'],
    },
  });
};

const getMyOrders = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IOrder[]>>('/orders/my-orders', {
    query,
    next: {
      tags: ['order'],
    },
  });
};

const getSingleOrder = async (id: string) => {
  return await serverFetch.get<ApiResponse<IOrder>>(`/orders/${id}`);
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
  revalidate('order');
  return res;
};

const trackOrder = async (id: string) => {
  return await serverFetch.get<ApiResponse<IOrder>>(`/orders/track/${id}`);
};

export {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  trackOrder,
  updateOrderStatus,
};
