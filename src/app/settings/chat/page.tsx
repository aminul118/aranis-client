import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import ChatSettingsContent from './_components/ChatSettingsContent';

export const metadata: Metadata = generateMetaTags({
  title: 'Customer Support Chat | Aranis Fashion',
  description:
    'Chat with Aranis Fashion customer support for any inquiries or issues.',
  websitePath: '/settings/chat',
  keywords: 'support, chat, customer service, help',
});

export default function ChatSettingsPage() {
  return <ChatSettingsContent />;
}
