import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import AdminChatContent from './_components/AdminChatContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetaTags({
  title: 'Customer Support Chat | Aranis Admin',
  description:
    'Manage customer support requests and active chat conversations.',
  websitePath: '/admin/chat',
  keywords: 'support, chat, admin, customer service',
});

export default function AdminChatPage() {
  return <AdminChatContent />;
}
