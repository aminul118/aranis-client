import icons from '@/constants/icons';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  className?: string;
  logoUrl?: string;
}

const Logo = ({ className, logoUrl }: Props) => {
  const src = logoUrl || icons.logo;

  return (
    <>
      <Link
        aria-label="Navigate to home page"
        href="/"
        className={cn('flex items-center text-2xl font-semibold', className)}
      >
        <Image
          src={src}
          height={80}
          width={180}
          alt="Lumiere logo"
          priority={true}
          className="object-contain"
        />
      </Link>
    </>
  );
};

export default Logo;
