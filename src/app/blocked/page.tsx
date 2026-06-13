'use client';

import { Ban } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlockedPage() {
  const [timeLeft, setTimeLeft] = useState<string>('02:00');

  useEffect(() => {
    // Helper to get cookie value
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const blockUntilStr = getCookie('aranis_block_until');
    if (!blockUntilStr) return;

    const blockUntil = parseInt(blockUntilStr, 10);

    const updateTimer = () => {
      const now = Date.now();
      const diff = blockUntil - now;

      if (diff <= 0) {
        setTimeLeft('00:00');
        // Once the timer is up, clear the block and reload the page to return to normal access
        document.cookie = 'aranis_block_until=; Max-Age=0; path=/';
        window.location.href = '/';
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-md gap-4 rounded-lg border border-red-600 bg-white p-6 shadow-2xl dark:bg-zinc-950">
        <Ban className="h-6 w-6 shrink-0 text-red-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Access Blocked
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            You have reached the maximum allowed page reloads. You are blocked
            from visiting any page for 2 minutes to prevent server overload.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center rounded-md bg-red-50 p-4 dark:bg-red-500/10">
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
              Time Remaining
            </span>
            <span className="mt-1 font-mono text-3xl font-black text-red-600">
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
