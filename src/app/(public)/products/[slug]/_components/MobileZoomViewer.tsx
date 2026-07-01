import Image from '@/components/common/SafeImage';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface MobileZoomViewerProps {
  selectedImage: string;
  productName: string;
  hasMultiple: boolean;
  thumbnailsLength: number;
  currentIdx: number;
}

export default function MobileZoomViewer({
  selectedImage,
  productName,
  hasMultiple,
  thumbnailsLength,
  currentIdx,
}: MobileZoomViewerProps) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={4}
      centerOnInit
      doubleClick={{ mode: 'zoomIn' }}
      wheel={{ step: 0.1 }}
      pinch={{ step: 5 }}
      panning={{ disabled: true }}
    >
      {() => (
        <>
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <div
              key={selectedImage}
              className="relative h-full w-full overflow-hidden"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Instant Cache Placeholder (Zero-delay cache hit from Shop page) */}
              <Image
                src={selectedImage}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                priority
                className="object-cover"
                quality={40}
              />
              {/* Fast loading base image (for initial crispness before zoom) */}
              <Image
                src={selectedImage}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
                fetchPriority="high"
                draggable={false}
                className="object-cover"
                quality={60}
              />
              {/* Ultra-sharp lazy-loaded overlay for zoom */}
              <Image
                src={selectedImage}
                alt={`${productName} full resolution`}
                fill
                unoptimized
                loading="lazy"
                draggable={false}
                className="object-cover"
              />
            </div>
          </TransformComponent>

          {hasMultiple && (
            <div className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {currentIdx + 1} / {thumbnailsLength}
            </div>
          )}
        </>
      )}
    </TransformWrapper>
  );
}
