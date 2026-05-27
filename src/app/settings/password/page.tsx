import ChangePasswordClient from '@/app/admin/settings/_components/ChangePasswordClient';
import { Metadata } from 'next';

export default function PasswordPage() {
  return <ChangePasswordClient />;
}

export const metadata: Metadata = {
  title: 'Change Password | Aranis',
};
