'use client';

import { IHeroBanner, IMiniBanner } from '@/services/hero-banner/hero-banner';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const SLIDE_INTERVAL = 5000;

interface HeroBannerProps {
  mainSlides?: IHeroBanner[];
  miniBanners?: IMiniBanner[];
}

const HeroBanner = ({ mainSlides, miniBanners }: HeroBannerProps) => {
  const slides = mainSlides || [];
  const minis = miniBanners || [];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setDirection(index > current ? 1 : -1);
      setCurrent((index + slides.length) % slides.length);
    },
    [current, slides.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0 && minis.length === 0) {
    return null;
  }

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-background w-full pb-4"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
          {/* ── Main Carousel ─────────────────────────────────────── */}
          {slides.length > 0 && (
            <div className="group bg-muted relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
              {/* Slides */}
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={slide._id ?? String(current)}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Link
                    href={slide.link || '#'}
                    className="block h-full w-full"
                  >
                    {/* Background image */}
                    <Image
                      src={slide.image}
                      alt="Hero Banner"
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Arrow controls */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prev();
                    }}
                    className="absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      next();
                    }}
                    className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70"
                    aria-label="Next"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s._id ?? i}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {slides.length > 1 && (
                <div className="absolute right-0 bottom-0 left-0 z-20 h-0.5 bg-white/10">
                  <motion.div
                    key={current}
                    className={`h-full bg-white`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: SLIDE_INTERVAL / 1000,
                      ease: 'linear',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Mini Banners ──────────────────────────────────────── */}
          {minis.length > 0 && (
            <div className="hidden flex-col gap-3 lg:flex">
              {minis.map((banner, i) => (
                <Link
                  key={banner._id ?? i}
                  href={banner.link || '#'}
                  className="group relative block flex-1 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={banner.image}
                    alt="Mini Banner"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="320px"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile mini banners (horizontal) ────────────────────── */}
        {minis.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
            {minis.map((banner, i) => (
              <Link
                key={(banner._id ?? i) + '-m'}
                href={banner.link || '#'}
                className="group relative h-28 overflow-hidden rounded-xl"
              >
                <Image
                  src={banner.image}
                  alt="Mini Banner"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="50vw"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroBanner;
