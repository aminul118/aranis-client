'use client';

import { Ban } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlockedPage() {
  const [timeLeft, setTimeLeft] = useState<string>('02:00');

  useEffect(() => {
    // Helper to get cookie value robustly
    const getCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)'),
      );
      if (match) return match[2];
      return null;
    };

    let blockUntilStr = getCookie('aranis_block_until');

    // Fallback to localStorage if the cookie cannot be read
    if (!blockUntilStr) {
      try {
        const stored = localStorage.getItem('aranis_block_info');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.blockUntil) {
            blockUntilStr = parsed.blockUntil.toString();
          }
        }
      } catch (e) {
        // ignore parsing errors
      }
    }

    // Fallback to 2 minutes from now if the timestamp is missing to prevent UI freezing
    const blockUntil = blockUntilStr
      ? parseInt(blockUntilStr, 10)
      : Date.now() + 120 * 1000;

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-lg">
      <div className="relative flex w-full max-w-lg flex-col items-center overflow-hidden rounded-[2rem] border border-red-500/20 bg-white p-10 text-center shadow-2xl dark:bg-zinc-950">
        {/* Ambient red glow behind icon */}
        <div className="absolute top-0 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 rounded-full bg-red-500/20 blur-[50px]" />

        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-50 text-red-500 ring-8 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400">
          <Ban className="h-10 w-10 animate-pulse" />
        </div>

        <h2 className="mb-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Access Temporarily Blocked
        </h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          We detected an unusually high number of page reloads. To protect our
          servers, your access has been paused.
        </p>

        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-50/50 p-6 dark:bg-red-500/5">
          <span className="mb-2 text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">
            Time Remaining
          </span>
          <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
            <span className="font-mono text-5xl font-black tracking-tighter">
              {timeLeft}
            </span>
          </div>
        </div>

        <p className="mt-8 text-xs font-medium text-zinc-500">
          Your access will be automatically restored when the timer reaches
          zero.
        </p>
      </div>
    </div>
  );
}
