'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export const getMyConversations = async (searchTerm?: string) => {
  const query = searchTerm
    ? `?searchTerm=${encodeURIComponent(searchTerm)}`
    : '';
  return await serverFetch.get<ApiResponse<any[]>>(
    `/chat/my-conversations${query}`,
    {
      cache: 'no-store',
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
    },
  );
};

export const getMessages = async (conversationId: string) => {
  return await serverFetch.get<ApiResponse<any[]>>(
    `/chat/messages/${conversationId}`,
    { cache: 'no-store' },
  );
};

export const markAsSeen = async (conversationId: string) => {
  return await serverFetch.patch<ApiResponse<null>>(
    `/chat/mark-as-seen/${conversationId}`,
  );
};

export const getUnreadCount = async () => {
  return await serverFetch.get<ApiResponse<number>>('/chat/unread-count', {
    cache: 'no-store',
  });
};

export const deleteConversation = async (conversationId: string) => {
  return await serverFetch.delete<ApiResponse<null>>(`/chat/${conversationId}`);
};
