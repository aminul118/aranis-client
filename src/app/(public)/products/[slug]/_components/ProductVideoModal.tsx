'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ProductVideoModalProps {
  videoUrl: string;
}

export default function ProductVideoModal({
  videoUrl,
}: ProductVideoModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const constraintsRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!videoUrl || !isOpen) {
    return null;
  }

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed inset-0 z-[60]"
      />
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ y: 0, x: 0 }}
        className="fixed right-4 bottom-32 z-50 w-28 cursor-grab overflow-hidden rounded-xl border border-white/20 shadow-2xl active:cursor-grabbing md:right-6 md:bottom-64 md:w-48"
      >
        <div className="group relative flex w-full flex-col items-center justify-center">
          <div className="absolute top-2 right-2 z-30 flex opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={() => setIsOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                } else if ((videoRef.current as any).webkitEnterFullscreen) {
                  (videoRef.current as any).webkitEnterFullscreen(); // For iOS Safari
                }
              }
            }}
            className="h-auto max-h-[40vh] w-full cursor-pointer object-contain"
          />
        </div>
      </motion.div>
    </>
  );
}
