import ThemeClient from '@/components/modules/Admin/settings/ThemeClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default function AppearanceSettingsPage() {
  return <ThemeClient />;
}

export const metadata: Metadata = {
  title: 'Appearance Settings | Aranis',
};
