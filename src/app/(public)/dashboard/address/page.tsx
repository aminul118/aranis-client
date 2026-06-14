import AddressManagement from '@/app/admin/settings/_components/profile/AddressManagement';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Address Book | Aranis',
};

export default async function AddressBookPage() {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <AddressManagement user={user} />
    </div>
  );
}
