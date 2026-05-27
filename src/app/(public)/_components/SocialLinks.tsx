import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';

interface Props {
  className?: string;
  links?: { platform: string; url: string; isActive: boolean }[];
}

const platformIcons: Record<string, any> = {
  Facebook: FaFacebook,
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegram,
  LinkedIn: FaLinkedinIn,
  X: FaTwitter,
  YouTube: FaYoutube,
  Instagram: FaInstagram,
  GitHub: FaGithub,
};

const platformColors: Record<string, string> = {
  Facebook: 'hover:bg-blue-500 hover:text-white',
  WhatsApp: 'hover:bg-green-500 hover:text-white',
  Telegram: 'hover:bg-sky-500 hover:text-white',
  LinkedIn: 'hover:bg-blue-600 hover:text-white',
  X: 'hover:bg-gray-800 hover:text-white',
  YouTube: 'hover:bg-red-600 hover:text-white',
  Instagram: 'hover:bg-pink-600 hover:text-white',
  GitHub: 'hover:bg-gray-700 hover:text-white',
};

const SocialLinks = ({ className, links }: Props) => {
  if (!links || links.length === 0) return null;

  const activeLinks = links.filter((link) => link.isActive && link.url);

  if (activeLinks.length === 0) return null;

  return (
    <div className={cn('flex gap-2.5', className)}>
      {activeLinks.map(({ platform, url }) => {
        const Icon = platformIcons[platform] || FaFacebook;
        const hoverColor =
          platformColors[platform] || 'hover:bg-blue-500 hover:text-white';

        return (
          <Link
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-lg',
              hoverColor,
            )}
          >
            <Icon className="text-base" />
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
