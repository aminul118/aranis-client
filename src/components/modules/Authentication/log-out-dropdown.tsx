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
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner /> Logging out...
        </>
      ) : (
        <>
          <LogOut /> Log out
        </>
      )}
    </DropdownMenuItem>
  );
};

export default LogOutDropDown;
