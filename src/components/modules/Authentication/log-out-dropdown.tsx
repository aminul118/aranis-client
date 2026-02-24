'use client';

import Spinner from '@/components/common/loader/ButtonSpinner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { logOut } from '@/services/auth/logout';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const LogOutDropDown = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    toast.success('User Logout');
    router.push('/login');
  };

  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
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
