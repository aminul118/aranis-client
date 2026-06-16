import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import AdminLocationsContent from './_components/AdminLocationsContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetaTags({
  title: 'Outlet Locations | Aranis Admin',
  description: 'Manage physical store presence and outlet details.',
  websitePath: '/admin/locations',
  keywords: 'locations, outlets, admin, stores',
});

export default function AdminLocationsPage() {
  return <AdminLocationsContent />;
}
