'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const MobileBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // If we are exactly on the dashboard overview, don't show the back button
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="mb-4 px-4 lg:hidden">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
  );
};

export default MobileBackButton;
