'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aranis_popup_dismissed';

interface PopupData {
  _id: string;
  image: string;
  link?: string;
  title?: string;
}

const GlobalOfferModal = () => {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if user previously manually closed the banner
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

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
          // Small delay so page loads first
          setTimeout(() => setVisible(true), 800);
        }
      } catch {
        // silently fail — popup is non-critical
      }
    };

    fetchPopup();
  }, []);

  // Auto-close after 10 seconds (does NOT persist — banner will show again next visit)
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [visible]);

  // Manual close — persist in localStorage so it never shows again
  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!popup) return null;

  const content = (
    <div className="relative mx-4 w-full max-w-lg">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-transform hover:scale-110 dark:bg-[#111] dark:text-white"
        aria-label="Close popup"
      >
        <X size={16} />
      </button>

      {/* Banner image wrapped in link */}
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        {popup.link ? (
          <Link href={popup.link} onClick={handleClose}>
            <Image
              src={popup.image}
              alt={popup.title || 'Special Offer'}
              width={600}
              height={400}
              className="w-full object-cover"
              priority
            />
          </Link>
        ) : (
          <Image
            src={popup.image}
            alt={popup.title || 'Special Offer'}
            width={600}
            height={400}
            className="w-full object-cover"
            priority
          />
        )}
      </div>

      {popup.link && (
        <div className="mt-3 flex justify-center">
          <Link
            href={popup.link}
            onClick={handleClose}
            className="rounded-full bg-blue-600 px-8 py-2.5 text-sm font-black tracking-widest text-white uppercase transition-colors hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalOfferModal;
