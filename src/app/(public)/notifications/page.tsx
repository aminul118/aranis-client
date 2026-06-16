import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import NotificationsContent from './_components/NotificationsContent';

export const metadata: Metadata = generateMetaTags({
  title: 'Notifications | Aranis Fashion',
  description:
    'View your latest notifications, order updates, and messages from Aranis Fashion.',
  websitePath: '/notifications',
  keywords: 'notifications, updates, alerts, messages',
});

export default function NotificationsPage() {
  return <NotificationsContent />;
}
