import { Ban } from 'lucide-react';

export const dynamic = 'force-static'; // Ensure this page is completely static and makes no API calls

export default function BlockedPage() {
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
            from visiting any page for 5 minutes to prevent server overload.
            Please wait.
          </p>
        </div>
      </div>
    </div>
  );
}
