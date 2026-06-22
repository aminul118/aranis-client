'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logger } from '../../lib/logger';

const RELOAD_LIMIT = 5;
const WARNING_RELOAD = 4;
const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const TIME_WINDOW_MS = 10 * 1000; // 10 seconds window for rapid reloads
const STORAGE_KEY = 'aranis_reload_tracker';

interface ReloadData {
  timestamps: number[];
  date: string;
  blockUntil?: number;
}

export default function ReloadTracker() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const today = new Date().toDateString();
    let reloadData: ReloadData = { timestamps: [], date: today };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReloadData;
        if (parsed.date === today) {
          reloadData = parsed;
        }
      }
    } catch (e) {
      logger.error('Failed to parse reload tracker data', e);
    }

    const now = Date.now();

    if (reloadData.blockUntil && now < reloadData.blockUntil) {
      // Still blocked

      document.cookie = `aranis_block_until=${reloadData.blockUntil}; path=/; max-age=${Math.ceil((reloadData.blockUntil - now) / 1000)}`;
    } else {
      // Block expired or not blocked
      if (reloadData.blockUntil && now >= reloadData.blockUntil) {
        // Reset after block expires
        reloadData.timestamps = [];
        delete reloadData.blockUntil;
      }

      // Filter out timestamps that are older than the time window
      reloadData.timestamps = (reloadData.timestamps || []).filter(
        (t) => now - t <= TIME_WINDOW_MS,
      );

      // Add current reload timestamp
      reloadData.timestamps.push(now);

      const currentReloads = reloadData.timestamps.length;
      setWarningCount(currentReloads);

      if (currentReloads >= RELOAD_LIMIT) {
        reloadData.blockUntil = now + BLOCK_DURATION_MS;

        // Set a cookie so Next.js middleware knows this user is blocked
        document.cookie = `aranis_block_until=${reloadData.blockUntil}; path=/; max-age=${2 * 60}`;
      } else if (currentReloads >= WARNING_RELOAD) {
        setShowWarning(true);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reloadData));

    // If blocked, set a timeout to automatically unblock them when the time expires
    if (reloadData.blockUntil && reloadData.blockUntil > Date.now()) {
      const timeRemaining = reloadData.blockUntil - Date.now();
      const timeoutId = setTimeout(() => {
        reloadData.timestamps = [];
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

  if (showWarning) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-500 ease-in-out">
        <Alert
          variant="destructive"
          className="w-full max-w-lg border-red-500 bg-white shadow-2xl dark:bg-zinc-950"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between font-bold">
            <span>Warning</span>
            <button
              onClick={() => setShowWarning(false)}
              className="text-zinc-500 transition-colors hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-relaxed">
            You have rapidly reloaded the page {warningCount} times. If you
            reload again within 10 seconds, you will be blocked for 2 minutes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}
