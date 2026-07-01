'use client';

import Image from '@/components/common/SafeImage';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

const MobileZoomViewer = dynamic(() => import('./MobileZoomViewer'), {
  ssr: false,
});

interface ProductImageGalleryProps {
  thumbnails: string[];
  productName: string;
  saleBadge?: ReactNode;
}

const ZOOM_SCALE = 2.4;

const ProductImageGallery = ({
  thumbnails,
  productName,
  saleBadge,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(thumbnails[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [shouldPreload, setShouldPreload] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload all gallery images immediately for instant switching
    setShouldPreload(true);
  }, []);

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

  const hasMultiple = thumbnails.length > 1;
  const currentIdx = thumbnails.indexOf(selectedImage);

  return (
    <div className="relative flex gap-3 select-none">
      {/* ── Preload full-size images for fast switching ──────────────── */}
      {shouldPreload && (
        <div
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          {thumbnails.map((img) => {
            if (img === thumbnails[0]) return null;
            return (
              <Image
                key={`preload-${img}`}
                src={img}
                alt=""
                width={800}
                height={1000}
                quality={60}
                priority={true}
              />
            );
          })}
        </div>
      )}

      {/* ── Left Thumbnail Strip ─────────────────────────────────────────── */}
      {hasMultiple && (
        <div
          ref={thumbsRef}
          onMouseEnter={() => setShouldPreload(true)}
          className="scrollbar-none flex w-[72px] shrink-0 flex-col gap-2 overflow-y-auto py-0.5"
        >
          {thumbnails.map((img, idx) => {
            const active = selectedImage === img;
            return (
              <button
                key={img + idx}
                type="button"
                aria-label={`View image ${idx + 1}`}
                onClick={() => handleSelectImage(img)}
                className={[
                  'relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-300',
                  active
                    ? 'border-blue-500 ring-2 shadow-blue-500/20 ring-blue-500/30'
                    : 'border-border/40 opacity-60 hover:border-blue-400/50 hover:opacity-100',
                ].join(' ')}
              >
                <Image
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  fill
                  sizes="72px"
                  draggable={false}
                  className="pointer-events-none object-cover"
                  quality={60}
                />
                {active && <div className="absolute inset-0 bg-blue-500/10" />}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Main Viewer (Desktop) ───────────────────────────────────────── */}
      <div className="relative hidden aspect-[4/5] flex-1 md:block">
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="border-border/50 bg-secondary/30 absolute inset-0 cursor-crosshair overflow-hidden rounded-3xl border backdrop-blur-sm"
          style={{ isolation: 'isolate' }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <Image
                src={selectedImage}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                fetchPriority="high"
                draggable={false}
                onLoad={() => setIsLcpLoaded(true)}
                className="pointer-events-none object-cover"
                quality={60}
              />
              {/* The Lens that follows the cursor */}
              {isZoomed && (
                <div
                  className="pointer-events-none absolute border border-black/10 bg-white/30 shadow-xl backdrop-blur-[2px] transition-opacity duration-200"
                  style={{
                    width: '30%',
                    height: '30%',
                    left: `calc(${zoomOrigin.x}% - 15%)`,
                    top: `calc(${zoomOrigin.y}% - 15%)`,
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {saleBadge && (
            <div className="absolute top-4 left-4 z-10">{saleBadge}</div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isZoomed ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute right-3 bottom-10 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/80 backdrop-blur-sm"
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

          {hasMultiple && (
            <div className="absolute right-3 bottom-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {currentIdx + 1} / {thumbnails.length}
            </div>
          )}
        </div>

        {/* ── Zoom Portal (Desktop) ─────────────────────────────────────── */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="border-border/50 pointer-events-none absolute top-0 left-[calc(100%+24px)] z-50 h-full w-full overflow-hidden rounded-3xl border bg-white shadow-2xl"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                backgroundSize: `${ZOOM_SCALE * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Viewer (Mobile) ────────────────────────────────────────── */}
      <div
        className="border-border/50 bg-secondary/30 relative aspect-[4/5] flex-1 overflow-hidden rounded-3xl border backdrop-blur-sm md:hidden"
        style={{ isolation: 'isolate' }}
      >
        {/* SSR Image for instant LCP */}
        <div className="absolute inset-0">
          <Image
            src={selectedImage}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            fetchPriority="high"
            draggable={false}
            onLoad={() => setIsLcpLoaded(true)}
            className="object-cover"
            quality={60}
          />
        </div>

        {/* Interactive Zoom Overlay (Client-only) */}
        <div className="absolute inset-0 z-10">
          <MobileZoomViewer
            selectedImage={selectedImage}
            productName={productName}
            hasMultiple={hasMultiple}
            thumbnailsLength={thumbnails.length}
            currentIdx={currentIdx}
          />
        </div>

        {saleBadge && (
          <div className="pointer-events-none absolute top-4 left-4 z-20">
            {saleBadge}
          </div>
        )}

        <div className="pointer-events-none absolute right-3 bottom-10 z-20 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/80 backdrop-blur-sm">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
          Pinch to zoom
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
