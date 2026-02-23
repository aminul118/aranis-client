import ChangePasswordClient from '@/components/modules/Admin/settings/ChangePasswordClient';
import { Metadata } from 'next';

export default function PasswordPage() {
  return <ChangePasswordClient />;
}

// SEO Metadata
export const metadata: Metadata = {
  title: 'Change Password | Md. Aminul Islam',
};
