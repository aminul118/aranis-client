'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface TrackOrderSearchProps {
  orderId: string;
  setOrderId: (id: string) => void;
  loading: boolean;
  message: { text: string; type: 'error' | 'success' } | null;
  onTrack: (e: React.FormEvent) => void;
}

export default function TrackOrderSearch({
  orderId,
  setOrderId,
  loading,
  message,
  onTrack,
}: TrackOrderSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/50 bg-card/80 overflow-hidden border shadow-2xl backdrop-blur-xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onTrack} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
                  size={18}
                />
                <Input
                  placeholder="Enter your Order ID (e.g. 6625...)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="border-border/50 h-12 rounded-xl bg-black/5 pl-11 text-sm transition-all focus:bg-black/10 focus:ring-blue-500/20 dark:bg-white/5 dark:focus:bg-white/10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 rounded-xl bg-blue-600 px-8 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Tracking...
                  </span>
                ) : (
                  'Track Now'
                )}
              </Button>
            </div>

            {/* Message Below the Field */}
            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'px-6 text-sm font-bold tracking-wide',
                    message.type === 'error'
                      ? 'text-red-400'
                      : 'text-emerald-400',
                  )}
                >
                  {message.text}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
