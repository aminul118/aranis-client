import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import BlockedContent from './_components/BlockedContent';

export const metadata: Metadata = generateMetaTags({
  title: 'Access Temporarily Blocked | Aranis Fashion',
  description:
    'Your access to Aranis Fashion has been temporarily paused to protect our servers from unusually high traffic.',
  websitePath: '/blocked',
  keywords: 'blocked, access, security',
});

export default function BlockedPage() {
  return <BlockedContent />;
}
