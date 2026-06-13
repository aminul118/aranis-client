import icons from '@/config/icons';
import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/services/settings/settings';
import Image from 'next/image';
import Link from 'next/link';

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
  try {
    const res = await getSiteSettings();
    settings = res?.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch site settings for logo:', error);
  }

  const src = settings?.logo || logoUrl || icons.logo;

  return (
    <Link
      aria-label="Navigate to home page"
      href="/"
      className={cn('flex items-center text-2xl font-semibold', className)}
    >
      <Image
        src={src}
        height={48}
        width={140}
        alt="Aranis logo"
        priority={true}
        fetchPriority="high"
        className="h-[48px] w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
