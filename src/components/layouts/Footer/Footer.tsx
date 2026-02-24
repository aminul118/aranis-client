import AminulLogo from '@/components/common/Logo';
import SocialLinks from '@/components/modules/Public/Home/SocialLinks';
import { ISocialLink } from '@/services/settings/settings';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const quickLinks = [
  { title: 'Shop All', href: '/shop' },
  { title: 'New Arrivals', href: '/new-arrivals' },
  { title: 'Men', href: '/men' },
  { title: 'Women', href: '/women' },
  { title: 'Accessories', href: '/accessories' },
];

const authLinks = [
  { title: 'Login', href: '/login' },
  { title: 'Register', href: '/register' },
  { title: 'Forgot Password', href: '/forgot-password' },
];

const customerServiceLinks = [
  { title: 'My Account', href: '/user/my-profile' },
  { title: 'Track Order', href: '/track-order' },
  { title: 'Terms & Conditions', href: '/terms-conditions' },
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Help Center', href: '/help' },
];

interface FooterProps {
  socialLinks?: ISocialLink[];
  logoUrl?: string;
}

const Footer = ({ socialLinks = [], logoUrl }: FooterProps) => {
  return (
    <footer className="relative overflow-hidden bg-slate-900">
      {/* Top gradient line */}
      {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" /> */}

      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -bottom-20 h-60 w-60 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <AminulLogo logoUrl={logoUrl} />
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
              Lumiere Fashion - Discover the latest trends in high-quality
              apparel. Elevate your style with our curated collections of modern
              clothing.
            </p>

            {/* Social Icons */}
            <SocialLinks links={socialLinks} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                  >
                    <span className="mr-2 inline-block h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-4" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Authentication
            </h3>
            <ul className="space-y-3">
              {authLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                  >
                    <span className="mr-2 inline-block h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-4" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {customerServiceLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                  >
                    <span className="mr-2 inline-block h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-4" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-slate-700 to-transparent" />

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{' '}
            <span className="text-slate-400">Lumiere Fashion</span>. All rights
            reserved.
          </p>

          <ThemeToggle />

          <p className="hidden items-center gap-1.5 text-xs text-slate-500 lg:flex">
            Delevoped by
            <Link href="https://github.com/aminul-dev">
              <span className="font-medium text-slate-400">Aminul Islam</span>
            </Link>
            using
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
