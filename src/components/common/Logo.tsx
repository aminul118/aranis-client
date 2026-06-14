import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/services/settings/settings';
import Image from 'next/image';
import Link from 'next/link';
import { logger } from '../../lib/logger';

interface Props {
  className?: string;
  logoUrl?: string; // Optional override
}

/**
 * Logo Component (Server Component)
 * Fetches site settings with Next.js caching (revalidate: 3600)
 */
const Logo = async ({ className, logoUrl }: Props) => {
  let settings = null;
  if (!logoUrl) {
    try {
      const res = await getSiteSettings();
      settings = res?.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error('Failed to fetch site settings for logo:', error);
    }
  }

  const src = logoUrl || settings?.logo;

  if (!src) {
    return null; // Return null instead of falling back to static logo to strictly enforce server logo
  }

  return (
    <Link
      aria-label="Navigate to home page"
      href="/"
      className={cn('flex items-center text-2xl font-semibold', className)}
    >
      <Image
        src={src}
        height={60}
        width={240}
        alt="Aranis logo"
        priority={true}
        fetchPriority="high"
        className="h-[60px] w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
