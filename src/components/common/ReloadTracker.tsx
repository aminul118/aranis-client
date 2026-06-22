'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { logger } from '../../lib/logger';

const RELOAD_LIMIT = 5;
const WARNING_RELOAD = 4;
const BLOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const TIME_WINDOW_MS = 10 * 1000; // 10 seconds window for rapid reloads
const STORAGE_KEY = 'aranis_reload_tracker';
const BLOCK_INFO_KEY = 'aranis_block_info';

interface ReloadData {
  timestamps: number[];
  lastPath: string;
}

let sessionLoadCounted = false;

export default function ReloadTracker() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    if (sessionLoadCounted) return;
    sessionLoadCounted = true;

    const today = new Date().toDateString();

    // Read block status from localStorage
    let blockUntil: number | undefined;
    try {
      const storedBlock = localStorage.getItem(BLOCK_INFO_KEY);
      if (storedBlock) {
        const parsed = JSON.parse(storedBlock);
        if (parsed.date === today && parsed.blockUntil) {
          blockUntil = parsed.blockUntil;
        }
      }
    } catch (e) {
      // ignore
    }

    // Read timestamps from sessionStorage
    let reloadData: ReloadData = { timestamps: [], lastPath: '' };
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        reloadData = JSON.parse(stored);
      }
    } catch (e) {
      logger.error('Failed to parse reload tracker data', e);
    }

    const now = Date.now();
    const currentPath = window.location.pathname;

    if (blockUntil && now < blockUntil) {
      // Still blocked
      document.cookie = `aranis_block_until=${blockUntil}; path=/; max-age=${Math.ceil((blockUntil - now) / 1000)}`;
    } else {
      // Block expired or not blocked
      if (blockUntil && now >= blockUntil) {
        // Reset after block expires
        blockUntil = undefined;
        localStorage.removeItem(BLOCK_INFO_KEY);
      }

      // If they navigated to a different path, it's not a reload spam. Reset timestamps.
      if (reloadData.lastPath !== currentPath) {
        reloadData.timestamps = [];
      } else {
        // Filter out timestamps that are older than the time window
        reloadData.timestamps = (reloadData.timestamps || []).filter(
          (t) => now - t <= TIME_WINDOW_MS,
        );
      }

      // Add current reload timestamp
      reloadData.timestamps.push(now);
      reloadData.lastPath = currentPath;

      const currentReloads = reloadData.timestamps.length;
      setWarningCount(currentReloads);

      if (currentReloads >= RELOAD_LIMIT) {
        blockUntil = now + BLOCK_DURATION_MS;

        // Save block info to localStorage
        localStorage.setItem(
          BLOCK_INFO_KEY,
          JSON.stringify({ blockUntil, date: today }),
        );

        // Set a cookie so Next.js middleware knows this user is blocked
        document.cookie = `aranis_block_until=${blockUntil}; path=/; max-age=${2 * 60}`;

        // Force an immediate redirect so they see the blocked page automatically
        if (!window.location.pathname.startsWith('/blocked')) {
          window.location.href = '/blocked';
        }
      } else if (currentReloads >= WARNING_RELOAD) {
        setShowWarning(true);
      }
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reloadData));

    // If blocked, set a timeout to automatically unblock them when the time expires
    if (blockUntil && blockUntil > Date.now()) {
      const timeRemaining = blockUntil - Date.now();
      const timeoutId = setTimeout(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(BLOCK_INFO_KEY);
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
