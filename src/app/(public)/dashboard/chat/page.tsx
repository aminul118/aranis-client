import { Metadata } from 'next';
import ChatClient from './_components/ChatClient';

export const metadata: Metadata = {
  title: 'Customer Support | Aranis',
  description: 'Live customer support chat for Aranis users',
};

export default function UserChatPage() {
  return <ChatClient />;
}
