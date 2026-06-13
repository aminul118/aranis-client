'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Ban, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const RELOAD_LIMIT = 5;
const WARNING_RELOAD = 4;
const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const STORAGE_KEY = 'aranis_reload_tracker';

interface ReloadData {
  count: number;
  date: string;
  blockUntil?: number;
}

export default function ReloadTracker() {
  const [showWarning, setShowWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    let reloadData: ReloadData = { count: 0, date: today };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReloadData;
        if (parsed.date === today) {
          reloadData = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse reload tracker data', e);
    }

    const now = Date.now();

    if (reloadData.blockUntil && now < reloadData.blockUntil) {
      // Still blocked
      setIsBlocked(true);
      document.cookie = `aranis_block_until=${reloadData.blockUntil}; path=/; max-age=${Math.ceil((reloadData.blockUntil - now) / 1000)}`;
    } else {
      // Block expired or not blocked, increment count
      if (reloadData.blockUntil && now >= reloadData.blockUntil) {
        // Reset after block expires
        reloadData.count = 0;
        delete reloadData.blockUntil;
      }

      reloadData.count += 1;

      if (reloadData.count >= RELOAD_LIMIT) {
        reloadData.blockUntil = now + BLOCK_DURATION_MS;
        setIsBlocked(true);
        // Set a cookie so Next.js middleware knows this user is blocked
        document.cookie = `aranis_block_until=${reloadData.blockUntil}; path=/; max-age=${2 * 60}`;
      } else if (reloadData.count === WARNING_RELOAD) {
        setShowWarning(true);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reloadData));

    // If blocked, set a timeout to automatically unblock them when the time expires
    if (reloadData.blockUntil && reloadData.blockUntil > Date.now()) {
      const timeRemaining = reloadData.blockUntil - Date.now();
      const timeoutId = setTimeout(() => {
        setIsBlocked(false);
        reloadData.count = 0;
        delete reloadData.blockUntil;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reloadData));
        // Remove the cookie
        document.cookie = 'aranis_block_until=; path=/; max-age=0';

        // Optionally refresh the page so they can see the normal site again if they were on /blocked
        if (window.location.pathname === '/blocked') {
          window.location.href = '/';
        }
      }, timeRemaining);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <Alert
          variant="destructive"
          className="max-w-md border-red-600 bg-white shadow-2xl dark:bg-zinc-950"
        >
          <Ban className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Access Blocked</AlertTitle>
          <AlertDescription className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You have reached the maximum allowed page reloads. You are blocked
            from visiting any page for 2 minutes. Please wait.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showWarning) {
    return (
      <div className="fixed top-4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4 transition-all duration-500 ease-in-out">
        <Alert
          variant="destructive"
          className="border-red-500 bg-white shadow-lg dark:bg-zinc-950"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>Warning</span>
            <button
              onClick={() => setShowWarning(false)}
              className="text-zinc-500 transition-colors hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertTitle>
          <AlertDescription>
            You have reloaded the page {WARNING_RELOAD} times. If you reload
            again, you will be blocked for 2 minutes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}
