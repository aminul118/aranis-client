'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, PictureInPicture2, X } from 'lucide-react';
import { useState } from 'react';

interface DraggableVideoPlayerProps {
  videoUrl?: string;
  youtubeVideoUrl?: string;
  getYoutubeEmbedUrl: (url: string) => string;
}

export const DraggableVideoPlayer = ({
  videoUrl,
  youtubeVideoUrl,
  getYoutubeEmbedUrl,
}: DraggableVideoPlayerProps) => {
  const [isPoppedOut, setIsPoppedOut] = useState(false);

  if (!videoUrl && !youtubeVideoUrl) return null;

  const renderVideo = () => {
    if (youtubeVideoUrl) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={getYoutubeEmbedUrl(youtubeVideoUrl)}
          title="Product Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="origin"
          className="h-full w-full object-cover"
        ></iframe>
      );
    }
    return (
      <video
        src={videoUrl}
        controls
        autoPlay
        muted
        loop
        playsInline
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        className="h-full w-full object-contain"
      />
    );
  };

  if (!isPoppedOut) {
    // Default Inline View
    return (
      <div className="group relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl transition-all duration-300">
        <div
          className={
            youtubeVideoUrl
              ? 'aspect-video w-full'
              : 'flex h-auto max-h-[80vh] w-full items-center justify-center'
          }
        >
          {renderVideo()}
        </div>

        {/* Floating Action Button for PiP */}
        <button
          onClick={() => setIsPoppedOut(true)}
          className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-black/80"
          title="Pop out video"
        >
          <PictureInPicture2 className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Floating Draggable Miniplayer
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        drag
        dragMomentum={false}
        className="fixed right-6 bottom-6 z-[100] w-72 cursor-grab overflow-hidden rounded-xl border-4 border-white/20 bg-black shadow-2xl active:cursor-grabbing sm:w-80 md:w-96"
      >
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          {/* Restore inline button */}
          <button
            onClick={() => setIsPoppedOut(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/90"
            title="Restore video"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking button
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Close entirely (can also just restore) */}
          <button
            onClick={() => setIsPoppedOut(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/90"
            title="Close miniplayer"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking button
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* A drag handle overlay so dragging is easier than just grabbing the iframe */}
        <div
          className="absolute inset-0 z-10"
          style={{ pointerEvents: 'none' }}
        >
          {/* We need some area to grab without triggering iframe events. A top bar or overlay is good. */}
          <div className="pointer-events-auto flex h-8 w-full cursor-grab items-center bg-gradient-to-b from-black/60 to-transparent px-4 active:cursor-grabbing">
            <span className="text-[10px] font-semibold tracking-widest text-white/80 uppercase">
              Move
            </span>
          </div>
        </div>

        <div
          className={
            youtubeVideoUrl
              ? 'aspect-video w-full'
              : 'flex max-h-[50vh] w-full items-center justify-center bg-black'
          }
        >
          {renderVideo()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
