'use client';

import type { IMiniBanner } from '@/services/banners/mini-banner/mini-banner.interface';
import Image from 'next/image';
import Link from 'next/link';

interface MiniBannersProps {
  minis: IMiniBanner[];
}

export default function MiniBanners({ minis }: MiniBannersProps) {
  if (!minis || minis.length === 0) return null;

  return (
    <>
      {/* ── Mini Banners (Desktop) ──────────────────────────────────────── */}
      <div className="hidden gap-3 lg:flex lg:w-[320px] lg:flex-col">
        {minis.slice(0, 2).map((banner, i) => (
          <Link
            key={banner._id ?? i}
            href={banner.link || '#'}
            className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:flex-1"
            aria-label={`Mini Banner ${i + 1}`}
          >
            <Image
              src={banner.image}
              alt="Mini Banner"
              fill
              priority={i < 2}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 320px"
              unoptimized
            />
          </Link>
        ))}
      </div>

      {/* ── Mobile mini banners (horizontal) ────────────────────── */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
        {minis.slice(0, 2).map((banner, i) => (
          <Link
            key={(banner._id ?? i) + '-m'}
            href={banner.link || '#'}
            className="relative h-28 overflow-hidden rounded-xl"
            aria-label={`Mobile Mini Banner ${i + 1}`}
          >
            <Image
              src={banner.image}
              alt="Mini Banner"
              fill
              priority={i < 2}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="object-cover"
              sizes="50vw"
              quality={60}
              unoptimized
            />
          </Link>
        ))}
      </div>
    </>
  );
}
