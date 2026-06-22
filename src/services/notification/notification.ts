'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { INotification } from '@/services/notification/notification.interface';
import { ApiResponse } from '@/types';

const getMyNotifications = async () => {
  return await serverFetch.get<ApiResponse<INotification[]>>(
    '/notifications/my-notifications',
    {
      cache: 'no-store',
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

const deleteOneNotification = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/notifications/bulk-delete',
    {
      body: JSON.stringify({ ids: [id] }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  revalidate('notification');
  return res;
};

export {
  clearAll,
  deleteOneNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
};
