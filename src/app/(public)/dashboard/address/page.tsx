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
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Address Book
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your saved delivery addresses for faster checkout.
        </p>
      </div>

      <div className="border-border/50 bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
        <AddressManagement user={user} />
      </div>
    </div>
  );
}
