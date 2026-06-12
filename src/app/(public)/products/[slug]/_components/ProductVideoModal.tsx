'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface ProductVideoModalProps {
  videoUrl: string;
}

export default function ProductVideoModal({
  videoUrl,
}: ProductVideoModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!videoUrl || !isOpen) {
    return null;
  }

  return (
    <div className="ring-border fixed right-4 bottom-24 z-50 w-32 overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl ring-1 backdrop-blur-md md:right-6 md:bottom-64 md:w-48">
      <div className="group relative flex w-full items-center justify-center bg-black">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
        >
          <X className="h-3 w-3" />
        </button>

        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          controls
          playsInline
          className="h-auto max-h-[40vh] w-full object-contain"
        />
      </div>
    </div>
  );
}
