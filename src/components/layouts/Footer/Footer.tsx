import AminulLogo from '@/components/common/AminulLogo';
import SocialLinks from '@/components/modules/Public/Home/SocialLinks';
import Link from 'next/link';
import { FiMapPin, FiPhone } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';

const quickLinks = [
  { title: 'Shop All', href: '/shop' },
  { title: 'New Arrivals', href: '/new-arrivals' },
  { title: 'Men', href: '/men' },
  { title: 'Women', href: '/women' },
  { title: 'Accessories', href: '/accessories' },
];

const customerServiceLinks = [
  { title: 'My Account', href: '/profile' },
  { title: 'Track Order', href: '/track-order' },
  { title: 'Returns & Exchanges', href: '/returns' },
  { title: 'Shipping Policy', href: '/shipping' },
  { title: 'Help Center', href: '/help' },
];

const Footer = () => {
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
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <AminulLogo />
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
              Lumiere Fashion - Discover the latest trends in high-quality apparel.
              Elevate your style with our curated collections of modern clothing.
            </p>

            {/* Social Icons */}
            <SocialLinks />
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

          {/* Contact Info */}
          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="mailto:mr.aminul118@gmail.com"
                  className="group flex items-start gap-3 text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                >
                  <HiOutlineMail className="mt-0.5 shrink-0 text-base text-blue-400/70" />
                  <span>mr.aminul118@gmail.com</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/8801781082064"
                  target="_blank"
                  className="group flex items-start gap-3 text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                >
                  <FiPhone className="mt-0.5 shrink-0 text-base text-blue-400/70" />
                  <span>+880 1781-082064</span>
                </Link>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <FiMapPin className="mt-0.5 shrink-0 text-base text-blue-400/70" />
                <span>Dhaka, Bangladesh</span>
              </li>
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
          <p className="hidden items-center gap-1.5 text-xs text-slate-500 lg:flex">
            Crafted with
            <span className="inline-block animate-pulse text-red-400">♥</span>
            using
            <span className="font-medium text-slate-400">Next.js</span>&
            <span className="font-medium text-slate-400">TypeScript</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
