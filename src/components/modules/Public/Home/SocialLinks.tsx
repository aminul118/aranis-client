import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  FaFacebook,
  FaGithub,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa';

interface Props {
  className?: string;
}

const socialLinks = [
  {
    icon: FaGithub,
    href: 'https://github.com/aminul118',
    label: 'GitHub',
    hoverColor: 'hover:bg-gray-700 hover:text-white',
  },
  {
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/in/aminul118',
    label: 'LinkedIn',
    hoverColor: 'hover:bg-blue-600 hover:text-white',
  },
  {
    icon: FaFacebook,
    href: 'https://www.facebook.com/aminul118',
    label: 'Facebook',
    hoverColor: 'hover:bg-blue-500 hover:text-white',
  },
  {
    icon: FaWhatsapp,
    href: 'https://wa.me/8801781082064',
    label: 'WhatsApp',
    hoverColor: 'hover:bg-green-500 hover:text-white',
  },
  {
    icon: FaTelegram,
    href: 'https://t.me/aminul118',
    label: 'Telegram',
    hoverColor: 'hover:bg-sky-500 hover:text-white',
  },
];

const SocialLinks = ({ className }: Props) => {
  return (
    <div className={cn('flex gap-2.5', className)}>
      {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-lg',
            hoverColor,
          )}
        >
          <Icon className="text-base" />
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;
