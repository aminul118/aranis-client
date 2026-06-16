import { getMessages, getOrCreateConversation } from '@/services/chat/chat';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';
import ChatClient from './_components/ChatClient';

export const metadata: Metadata = {
  title: 'Customer Support | Aranis',
  description: 'Live customer support chat for Aranis users',
};

export default async function UserChatPage() {
  const meRes = await getMe();
  const initialUser = meRes?.data || null;

  let initialConversation = null;
  let initialMessages: any[] = [];

  if (initialUser) {
    const convRes = await getOrCreateConversation([initialUser._id]);
    if (convRes?.success && convRes.data) {
      initialConversation = convRes.data;
      const msgRes = await getMessages(convRes.data._id);
      if (msgRes?.success) {
        initialMessages = msgRes.data || [];
      }
    }
  }

  return (
    <ChatClient
      initialUser={initialUser}
      initialConversation={initialConversation}
      initialMessages={initialMessages}
    />
  );
}
