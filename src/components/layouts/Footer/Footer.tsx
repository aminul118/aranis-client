import AminulLogo from '@/components/common/Logo';
import SocialLinks from '@/components/modules/Public/Home/SocialLinks';
import { INavItem } from '@/services/navbar/navbar';
import { ISocialLink } from '@/services/settings/settings';
import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface FooterProps {
  socialLinks?: ISocialLink[];
  navItems?: INavItem[];
  siteSettings?: any;
}

const Footer = ({
  socialLinks = [],
  navItems = [],
  siteSettings,
}: FooterProps) => {
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
              <AminulLogo />
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed font-medium text-slate-400 italic">
              The Aranis - Discover the latest trends in high-quality apparel.
              Elevate your style with our curated collections of modern
              clothing.
            </p>

            {/* Social Icons */}
            <SocialLinks links={socialLinks} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm font-medium text-slate-400 transition-colors duration-300 hover:text-blue-400"
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
            <h3 className="mb-5 text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { title: 'Track Order', href: '/track-order' },
                { title: 'Offers', href: '/offers' },
                { title: 'Wishlist', href: '/wishlist' },
                { title: 'Privacy Policy', href: '/privacy-policy' },
                { title: 'Outlet Locations', href: '/location' },
              ].map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm font-medium text-slate-400 transition-colors duration-300 hover:text-blue-400"
                  >
                    <span className="mr-2 inline-block h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-4" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-5 text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-blue-500/10 p-2 text-blue-400">
                  <MapPin size={14} />
                </div>
                <p className="text-sm leading-relaxed font-medium text-slate-400">
                  {siteSettings?.location || 'Block E, Road 11, Banani, Dhaka'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <Phone size={14} />
                </div>
                <a
                  href={`tel:${siteSettings?.contactNumber || '+8801886877730'}`}
                  className="text-sm font-bold text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {siteSettings?.contactNumber || '+880 1886-877730'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                  <Mail size={14} />
                </div>
                <a
                  href={`mailto:${siteSettings?.email || 'hello@aranis.com'}`}
                  className="text-sm font-bold text-slate-400 transition-colors hover:text-amber-400"
                >
                  {siteSettings?.email || 'hello@aranis.com'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-slate-700 to-transparent" />

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{' '}
            <span className="text-slate-400">Aranis Fashion</span>. All rights
            reserved.
          </p>

          <ThemeToggle />

          <p className="hidden items-center gap-1.5 text-xs text-slate-500 lg:flex">
            Developed by
            <Link target="_blank" href="https://rangdhanuit.com">
              <span className="font-medium text-slate-400">Rangdhanu IT</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
