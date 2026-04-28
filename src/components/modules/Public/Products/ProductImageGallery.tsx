'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  saleBadge?: React.ReactNode;
}

const ZOOM_SCALE = 2.4;

const ProductImageGallery = ({
  images,
  productName,
  saleBadge,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // ── Cursor-tracking zoom ──────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsZoomed(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  }, []);

  const handleSelectImage = (img: string) => {
    if (img === selectedImage) return;
    setSelectedImage(img);
    setIsZoomed(false);
  };

  const hasMultiple = images.length > 1;
  const currentIdx = images.indexOf(selectedImage);

  return (
    <div className="flex flex-col-reverse gap-4 select-none lg:h-[700px] lg:flex-row">
      {/* ── Thumbnail Strip (Left side on desktop, bottom on mobile) ── */}
      {hasMultiple && (
        <div
          ref={thumbsRef}
          className="scrollbar-none flex snap-x gap-3 overflow-x-auto px-1 py-2 lg:w-24 lg:snap-y lg:flex-col lg:overflow-y-auto"
        >
          {images.map((img, idx) => {
            const active = selectedImage === img;
            return (
              <button
                key={img + idx}
                type="button"
                aria-label={`View image ${idx + 1}`}
                onClick={() => handleSelectImage(img)}
                className={[
                  'relative h-20 w-16 shrink-0 snap-start overflow-hidden rounded-2xl border-2 shadow-sm transition-all duration-300 lg:h-24 lg:w-full',
                  active
                    ? 'scale-105 border-blue-500 ring-4 shadow-blue-500/25 ring-blue-500/20'
                    : 'border-border/40 opacity-55 hover:scale-[1.03] hover:border-blue-500/40 hover:opacity-100',
                ].join(' ')}
              >
                <Image
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  fill
                  draggable={false}
                  className="pointer-events-none object-cover"
                />
                {/* Active overlay shimmer */}
                {active && (
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Main Viewer ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="border-border/50 bg-secondary/30 relative min-h-[400px] flex-1 cursor-crosshair overflow-hidden rounded-4xl border backdrop-blur-sm"
        style={{ isolation: 'isolate' }}
      >
        {/* Crossfade switcher */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              priority
              draggable={false}
              className="pointer-events-none object-cover"
              style={{
                transform: isZoomed ? `scale(${ZOOM_SCALE})` : 'scale(1)',
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                transition: isZoomed
                  ? 'transform 0.08s ease-out'
                  : 'transform 0.35s ease-out',
                willChange: 'transform',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Sale badge */}
        {saleBadge && (
          <div className="absolute top-6 left-6 z-10">{saleBadge}</div>
        )}

        {/* Zoom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isZoomed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute right-4 bottom-14 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/80 backdrop-blur-sm"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
          Hover to zoom
        </motion.div>

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute right-4 bottom-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            {currentIdx + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
