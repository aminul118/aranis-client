'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IHeroBanner, IMiniBanner } from '@/services/hero-banner/hero-banner';

// ─── Fallback data (shown when DB has no banners yet) ───────────────────────
const FALLBACK_SLIDES: IHeroBanner[] = [
  {
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
    tag: "Women's Collection",
    title: 'Timeless Beauty,\nModern Edge',
    subtitle: "Discover our curated women's fashion for every occasion.",
    cta: 'Explore Women',
    ctaHref: '/shop?category=Women',
    accentColor: 'from-pink-500 to-rose-400',
    bgGlow: 'bg-pink-600/20',
    order: 1,
    isActive: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
    tag: "Men's Essentials",
    title: 'Dress Sharp,\nLive Bold',
    subtitle: "Premium men's fashion — from casual to formal.",
    cta: 'Shop Men',
    ctaHref: '/shop?category=Men',
    accentColor: 'from-slate-600 to-gray-400',
    bgGlow: 'bg-slate-600/20',
    order: 3,
    isActive: true,
  },
];

const FALLBACK_MINI: IMiniBanner[] = [
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
    label: 'Featured Picks',
    title: 'Staff Favourites',
    href: '/shop?featured=true',
    accent: 'from-purple-600/80 to-indigo-800/90',
    order: 0,
    isActive: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800&auto=format&fit=crop',
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
  const slides = (mainSlides && mainSlides.length > 0) ? mainSlides : FALLBACK_SLIDES;
  const minis = (miniBanners && miniBanners.length > 0) ? miniBanners : FALLBACK_MINI;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent((index + slides.length) % slides.length);
  }, [current, slides.length]);

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
    <section className="w-full pt-20 pb-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">

          {/* ── Main Carousel ─────────────────────────────────────── */}
          <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden group bg-muted">

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
                <Link href={slide.ctaHref} className="block w-full h-full">
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
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 max-w-xl">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-4 w-fit backdrop-blur-sm"
                    >
                      {slide.tag}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3 whitespace-pre-line`}
                    >
                      {slide.title.split('\n').map((line, i) =>
                        i === 1 ? (
                          <span key={i} className={`block text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor}`}>
                            {line}
                          </span>
                        ) : (
                          <span key={i} className="block">{line}</span>
                        )
                      )}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/75 text-sm md:text-base mb-6 leading-relaxed"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`inline-flex items-center gap-2 self-start px-6 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r ${slide.accentColor} shadow-lg hover:opacity-90 transition-opacity`}
                    >
                      {slide.cta} →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Arrow controls */}
            <button
              onClick={(e) => { e.preventDefault(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s._id ?? i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
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
          <div className="hidden lg:flex flex-col gap-3">
            {minis.map((banner, i) => (
              <Link
                key={banner._id ?? i}
                href={banner.href}
                className="relative flex-1 rounded-2xl overflow-hidden group block"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="320px"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.accent}`} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                    {banner.label}
                  </span>
                  <p className="text-white font-black text-lg leading-tight">{banner.title}</p>
                  <span className="mt-2 text-xs text-white/80 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile mini banners (horizontal) ────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mt-3 lg:hidden">
          {minis.map((banner, i) => (
            <Link
              key={(banner._id ?? i) + '-m'}
              href={banner.href}
              className="relative h-28 rounded-xl overflow-hidden group"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.accent}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <p className="text-white font-black text-sm leading-tight">{banner.title}</p>
                <span className="text-xs text-white/80 mt-0.5">Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
