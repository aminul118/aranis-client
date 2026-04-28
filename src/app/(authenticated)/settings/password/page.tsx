import ChangePasswordClient from '@/components/modules/Admin/settings/ChangePasswordClient';
import { Metadata } from 'next';

export default function PasswordPage() {
  return <ChangePasswordClient />;
}

export const metadata: Metadata = {
  title: 'Change Password | Aranis',
};
