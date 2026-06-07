'use client';

import Spinner from '@/components/common/loader/ButtonSpinner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { logOut } from '@/services/auth/logout';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useUser } from '@/context/UserContext';

const LogOutDropDown = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 dark:focus:bg-red-500/10 dark:focus:text-red-300"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner /> Logging out...
        </>
      ) : (
        <>
          <LogOut size={16} /> <span className="text-sm">Log out</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default LogOutDropDown;
