'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export const getMyConversations = async (searchTerm?: string) => {
  const timestamp = Date.now();
  const query = searchTerm
    ? `?searchTerm=${encodeURIComponent(searchTerm)}&t=${timestamp}`
    : `?t=${timestamp}`;
  return await serverFetch.get<ApiResponse<any[]>>(
    `/chat/my-conversations${query}`,
    {
      cache: 'no-store',
      next: { revalidate: 0 },
    },
  );
};

export const getOrCreateConversation = async (participants: string[]) => {
  return await serverFetch.post<ApiResponse<any>>(
    '/chat/get-or-create-conversation',
    {
      body: JSON.stringify({ participants }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      next: { revalidate: 0 },
    },
  );
};

export const getMessages = async (conversationId: string) => {
  return await serverFetch.get<ApiResponse<any[]>>(
    `/chat/messages/${conversationId}?t=${Date.now()}`,
    {
      cache: 'no-store',
      next: { revalidate: 0 },
    },
  );
};

export const markAsSeen = async (conversationId: string) => {
  return await serverFetch.patch<ApiResponse<null>>(
    `/chat/mark-as-seen/${conversationId}`,
  );
};

export const getUnreadCount = async () => {
  return await serverFetch.get<ApiResponse<number>>(
    `/chat/unread-count?t=${Date.now()}`,
    {
      cache: 'no-store',
      next: { revalidate: 0 },
    },
  );
};

export const deleteConversation = async (conversationId: string) => {
  return await serverFetch.delete<ApiResponse<null>>(`/chat/${conversationId}`);
};
