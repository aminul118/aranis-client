import type { IHeroBanner } from '@/services/banners/hero-banner/hero-banner.interface';
import type { IMiniBanner } from '@/services/banners/mini-banner/mini-banner.interface';
import MainHeroCarousel from './MainHeroCarousel';
import MiniBanners from './MiniBanners';

interface HeroBannerProps {
  mainSlides?: IHeroBanner[];
  miniBanners?: IMiniBanner[];
}

const HeroBanner = ({ mainSlides, miniBanners }: HeroBannerProps) => {
  const slides = mainSlides || [];
  const minis = miniBanners || [];

  if (slides.length === 0 && minis.length === 0) {
    return null;
  }

  return (
    <section className="bg-background w-full pb-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <MainHeroCarousel slides={slides} />
          <MiniBanners minis={minis} />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
