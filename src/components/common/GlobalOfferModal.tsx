'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aranis_popup_dismissed_at';

interface PopupData {
  _id: string;
  image: string;
  link?: string;
  title?: string;
}

const GlobalOfferModal = () => {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Show once every 24 hours
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const now = new Date().getTime();
      const lastDismissed = parseInt(dismissedAt);
      const hoursSinceDismissed = (now - lastDismissed) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) return;
    }

    const fetchPopup = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${baseUrl}/popup-banners/active`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.success && data?.data?.image) {
          setPopup(data.data);
          // Professional entrance delay
          setTimeout(() => setVisible(true), 1500);
        }
      } catch {
        // silently fail
      }
    };

    fetchPopup();
  }, []);

  // Progress bar and auto-close logic
  useEffect(() => {
    if (!visible) return;

    const duration = 12000; // 12 seconds
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          setVisible(false);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [visible]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, new Date().getTime().toString());
    setVisible(false);
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40, rotateX: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              delay: 0.1,
            }}
            className="relative w-full max-w-xl overflow-hidden rounded-[40px] border border-white/10 bg-[#111111] shadow-[0_0_80px_rgba(37,99,235,0.2)]"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-red-500 active:scale-90"
            >
              <X size={20} />
            </button>

            {/* Banner Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Link
                href={popup.link || '#'}
                onClick={handleClose}
                className={cn(!popup.link && 'cursor-default')}
              >
                <Image
                  src={popup.image}
                  alt={popup.title || 'Special Offer'}
                  fill
                  className="object-cover transition-transform duration-[3000ms] hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#111] via-transparent to-transparent opacity-60" />
              </Link>
            </div>

            {/* Content Area */}
            <div className="relative p-8 text-center sm:p-10">
              {popup.title && (
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 text-2xl font-black tracking-tighter text-white uppercase italic sm:text-4xl"
                >
                  {popup.title}
                </motion.h3>
              )}

              {popup.link && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href={popup.link}
                    onClick={handleClose}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-10 py-4 text-sm font-black tracking-[0.2em] text-white uppercase shadow-2xl shadow-blue-500/40 transition-all hover:bg-blue-700 hover:shadow-blue-500/60 active:scale-95"
                  >
                    <span className="relative z-10">Experience Now</span>
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-white"
                    />
                  </Link>
                </motion.div>
              )}

              <p className="text-muted-foreground/40 mt-8 text-[10px] font-black tracking-widest uppercase">
                Limited Time Opportunity
              </p>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/5">
              <motion.div
                className="h-full bg-linear-to-r from-blue-600 to-indigo-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalOfferModal;
