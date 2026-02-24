'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export const getMyConversations = async () => {
  return await serverFetch.get<ApiResponse<any[]>>('/chat/my-conversations');
};

export const getOrCreateConversation = async (participants: string[]) => {
  return await serverFetch.post<ApiResponse<any>>(
    '/chat/get-or-create-conversation',
    {
      body: JSON.stringify({ participants }),
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export const getMessages = async (conversationId: string) => {
  return await serverFetch.get<ApiResponse<any[]>>(
    `/chat/messages/${conversationId}`,
  );
};

export const markAsSeen = async (conversationId: string) => {
  return await serverFetch.patch<ApiResponse<null>>(
    `/chat/mark-as-seen/${conversationId}`,
  );
};
