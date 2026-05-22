'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import placeholderImg from '../../../public/placeholder.jpg';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: any;
  fallbackSrc?: any;
}

export default function SafeImage({
  src,
  fallbackSrc = placeholderImg,
  alt,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<any>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const getValidSrc = (currentSrc: any) => {
    if (
      !currentSrc ||
      typeof currentSrc !== 'string' ||
      currentSrc === '[]' ||
      currentSrc === 'null' ||
      currentSrc === '' ||
      currentSrc.includes('placehold.co')
    ) {
      return fallbackSrc;
    }
    return currentSrc;
  };

  const finalSrc = hasError ? fallbackSrc : getValidSrc(imgSrc);

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || 'Image'}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
