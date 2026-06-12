'use client';

import { motion } from 'framer-motion';
import { Maximize, X } from 'lucide-react';
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
        className="fixed right-4 bottom-24 z-50 w-32 cursor-grab overflow-hidden rounded-2xl shadow-2xl active:cursor-grabbing md:right-6 md:bottom-64 md:w-48"
      >
        <div className="group relative flex w-full flex-col items-center justify-center">
          <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  } else if ((videoRef.current as any).webkitEnterFullscreen) {
                    (videoRef.current as any).webkitEnterFullscreen(); // For iOS Safari
                  }
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <Maximize className="h-3 w-3" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
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
            controls
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when interacting with controls
            className="h-auto max-h-[40vh] w-full object-contain"
          />
        </div>
      </motion.div>
    </>
  );
}
