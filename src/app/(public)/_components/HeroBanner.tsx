'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { IHeroBanner } from '@/services/banners/hero-banner/hero-banner.interface';
import type { IMiniBanner } from '@/services/banners/mini-banner/mini-banner.interface';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const SLIDE_INTERVAL = 5000;

interface HeroBannerProps {
  mainSlides?: IHeroBanner[];
  miniBanners?: IMiniBanner[];
}

const HeroBanner2 = ({ mainSlides, miniBanners }: HeroBannerProps) => {
  const slides = mainSlides || [];
  const minis = miniBanners || [];

  const plugin = useRef(
    Autoplay({ delay: SLIDE_INTERVAL, stopOnInteraction: true }),
  );

  if (slides.length === 0 && minis.length === 0) {
    return null;
  }

  return (
    <section className="bg-background w-full pb-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* ── Main Carousel ─────────────────────────────────────── */}
          {slides.length > 0 && (
            <div className="group bg-muted relative aspect-[16/9] w-full flex-1 overflow-hidden rounded-2xl">
              <Carousel
                plugins={[plugin.current]}
                className="h-full w-full"
                opts={{
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {slides.map((slide, currentSafe) => (
                    <CarouselItem
                      key={slide._id ?? String(currentSafe)}
                      className="relative h-full w-full"
                    >
                      <Link
                        href={slide.link || '#'}
                        className="relative block aspect-[16/9] h-full w-full"
                        aria-label={`Main Banner ${currentSafe + 1}`}
                      >
                        {/* Background image */}
                        <Image
                          src={slide.image}
                          alt="Hero Banner"
                          fill
                          className="object-cover object-top"
                          priority={currentSafe === 0}
                          fetchPriority={currentSafe === 0 ? 'high' : 'auto'}
                          sizes="(max-width: 1024px) 100vw, 75vw"
                          unoptimized
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Arrow controls */}
                {slides.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute top-1/2 left-3 z-20 h-11 w-11 -translate-y-1/2 rounded-full border-none bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70 hover:text-white" />
                    <CarouselNext className="absolute top-1/2 right-3 z-20 h-11 w-11 -translate-y-1/2 rounded-full border-none bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70 hover:text-white" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* ── Mini Banners ──────────────────────────────────────── */}
          {minis.length > 0 && (
            <div className="hidden gap-3 lg:flex lg:w-[320px] lg:flex-col">
              {minis.slice(0, 2).map((banner, i) => (
                <Link
                  key={banner._id ?? i}
                  href={banner.link || '#'}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:flex-1"
                  aria-label={`Mini Banner ${i + 1}`}
                >
                  <Image
                    src={banner.image}
                    alt="Mini Banner"
                    fill
                    priority={i < 2}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 320px"
                    unoptimized
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile mini banners (horizontal) ────────────────────── */}
        {minis.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
            {minis.slice(0, 2).map((banner, i) => (
              <Link
                key={(banner._id ?? i) + '-m'}
                href={banner.link || '#'}
                className="group relative h-28 overflow-hidden rounded-xl"
                aria-label={`Mobile Mini Banner ${i + 1}`}
              >
                <Image
                  src={banner.image}
                  alt="Mini Banner"
                  fill
                  priority={i < 2}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="50vw"
                  quality={60}
                  unoptimized
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner2;
