'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface INotification {
  _id: string;
  user?: string;
  title: string;
  message: string;
  type: 'Order' | 'System' | 'Payment';
  isRead: boolean;
  orderId?: string;
  createdAt: string;
}

const getMyNotifications = async () => {
  return await serverFetch.get<ApiResponse<INotification[]>>(
    '/notifications/my-notifications',
    {
      next: {
        tags: ['notification'],
      },
    },
  );
};

const markAsRead = async (id: string) => {
  const res = await serverFetch.patch<ApiResponse<any>>(
    `/notifications/mark-read/${id}`,
  );
  revalidate('notification');
  return res;
};

const markAllAsRead = async () => {
  const res = await serverFetch.patch<ApiResponse<any>>(
    '/notifications/mark-all-read',
  );
  revalidate('notification');
  return res;
};

const clearAll = async () => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/notifications/clear-all',
  );
  revalidate('notification');
  return res;
};

export { clearAll, getMyNotifications, markAllAsRead, markAsRead };
