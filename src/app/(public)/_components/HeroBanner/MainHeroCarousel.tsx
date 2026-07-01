'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { IHeroBanner } from '@/services/banners/hero-banner/hero-banner.interface';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const SLIDE_INTERVAL = 5000;

interface MainHeroCarouselProps {
  slides: IHeroBanner[];
}

export default function MainHeroCarousel({ slides }: MainHeroCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: SLIDE_INTERVAL, stopOnInteraction: true }),
  );

  if (!slides || slides.length === 0) return null;

  return (
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
  );
}
