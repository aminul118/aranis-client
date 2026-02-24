'use client';

import ProductCard from '@/components/common/ProductCard';
import { IProduct } from '@/services/product/product';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const TopRatedSwiper = ({ products }: { products: IProduct[] }) => {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="pb-8"
    >
      {products.map((product, index) => (
        <SwiperSlide key={product._id}>
          <ProductCard product={product} index={index} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TopRatedSwiper;
