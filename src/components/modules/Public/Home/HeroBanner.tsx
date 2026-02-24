'use client';

import { IHeroBanner, IMiniBanner } from '@/services/hero-banner/hero-banner';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// ─── Fallback data (shown when DB has no banners yet) ───────────────────────
const FALLBACK_SLIDES: IHeroBanner[] = [
  {
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
    tag: 'New Collection 2026',
    title: 'Elevate Your\nSignature Style',
    subtitle: 'Up to 40% OFF on premium fashion picks. Limited time offer.',
    cta: 'Shop Now',
    ctaHref: '/shop',
    accentColor: 'from-blue-600 to-cyan-400',
    bgGlow: 'bg-blue-600/20',
    order: 0,
    isActive: true,
  },
  {
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
    tag: "Women's Collection",
    title: 'Timeless Beauty,\nModern Edge',
    subtitle: "Discover our curated women's fashion for every occasion.",
    cta: 'Explore Women',
    ctaHref: '/women',
    accentColor: 'from-pink-500 to-rose-400',
    bgGlow: 'bg-pink-600/20',
    order: 1,
    isActive: true,
  },
  {
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    tag: 'Summer Sale',
    title: 'Hot Deals,\nCooler Looks',
    subtitle: 'Shop our biggest summer sale before it ends!',
    cta: 'View Offers',
    ctaHref: '/shop?featured=true',
    accentColor: 'from-amber-500 to-orange-400',
    bgGlow: 'bg-amber-600/20',
    order: 2,
    isActive: true,
  },
  {
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
    tag: "Men's Essentials",
    title: 'Dress Sharp,\nLive Bold',
    subtitle: "Premium men's fashion — from casual to formal.",
    cta: 'Shop Men',
    ctaHref: '/men',
    accentColor: 'from-slate-600 to-gray-400',
    bgGlow: 'bg-slate-600/20',
    order: 3,
    isActive: true,
  },
];

const FALLBACK_MINI: IMiniBanner[] = [
  {
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
    label: 'Featured Picks',
    title: 'Staff Favourites',
    href: '/shop?featured=true',
    accent: 'from-purple-600/80 to-indigo-800/90',
    order: 0,
    isActive: true,
  },
  {
    image:
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800&auto=format&fit=crop',
    label: 'Best Sellers',
    title: 'Top Rated Styles',
    href: '/shop?sort=-rating',
    accent: 'from-emerald-600/80 to-teal-800/90',
    order: 1,
    isActive: true,
  },
];

const SLIDE_INTERVAL = 5000;

interface HeroBannerProps {
  mainSlides?: IHeroBanner[];
  miniBanners?: IMiniBanner[];
}

const HeroBanner = ({ mainSlides, miniBanners }: HeroBannerProps) => {
  const slides =
    mainSlides && mainSlides.length > 0 ? mainSlides : FALLBACK_SLIDES;
  const minis =
    miniBanners && miniBanners.length > 0 ? miniBanners : FALLBACK_MINI;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent((index + slides.length) % slides.length);
    },
    [current, slides.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="bg-background w-full pt-20 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
          {/* ── Main Carousel ─────────────────────────────────────── */}
          <div className="group bg-muted relative h-[340px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[480px]">
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
                <Link href={slide.ctaHref} className="block h-full w-full">
                  {/* Background image */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

                  {/* Text content */}
                  <div className="absolute inset-0 flex max-w-xl flex-col justify-center px-8 md:px-12">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-4 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/80 uppercase backdrop-blur-sm"
                    >
                      {slide.tag}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`mb-3 text-3xl leading-tight font-black whitespace-pre-line text-white sm:text-4xl md:text-5xl`}
                    >
                      {slide.title.split('\n').map((line, i) =>
                        i === 1 ? (
                          <span
                            key={i}
                            className={`block bg-gradient-to-r bg-clip-text text-transparent ${slide.accentColor}`}
                          >
                            {line}
                          </span>
                        ) : (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ),
                      )}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6 text-sm leading-relaxed text-white/75 md:text-base"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r px-6 py-3 text-sm font-bold text-white ${slide.accentColor} shadow-lg transition-opacity hover:opacity-90`}
                    >
                      {slide.cta} →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Arrow controls */}
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

            {/* Dot indicators */}
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

            {/* Progress bar */}
            <div className="absolute right-0 bottom-0 left-0 z-20 h-0.5 bg-white/10">
              <motion.div
                key={current}
                className={`h-full bg-gradient-to-r ${slide.accentColor}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
              />
            </div>
          </div>

          {/* ── Mini Banners ──────────────────────────────────────── */}
          <div className="hidden flex-col gap-3 lg:flex">
            {minis.map((banner, i) => (
              <Link
                key={banner._id ?? i}
                href={banner.href}
                className="group relative block flex-1 overflow-hidden rounded-2xl"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="320px"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${banner.accent}`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="mb-1 text-[10px] font-bold tracking-widest text-white/70 uppercase">
                    {banner.label}
                  </span>
                  <p className="text-lg leading-tight font-black text-white">
                    {banner.title}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition-all group-hover:gap-2">
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile mini banners (horizontal) ────────────────────── */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
          {minis.map((banner, i) => (
            <Link
              key={(banner._id ?? i) + '-m'}
              href={banner.href}
              className="group relative h-28 overflow-hidden rounded-xl"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${banner.accent}`}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <p className="text-sm leading-tight font-black text-white">
                  {banner.title}
                </p>
                <span className="mt-0.5 text-xs text-white/80">Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
