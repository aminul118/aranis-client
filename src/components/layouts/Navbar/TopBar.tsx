'use client';

import { FileText, Gift, Phone } from 'lucide-react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="hidden w-full border-b border-gray-100 bg-white py-2 transition-colors md:block dark:border-white/5 dark:bg-[#0a0a0a]">
      <div className="container mx-auto flex items-center justify-between px-4 text-[10px] font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
        {/* Left Side: Contact */}
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400 dark:text-gray-600" />
          <span>01633501122</span>
        </div>

        {/* Right Side: Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/track-order"
            className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span>Order Tracking</span>
          </Link>
          <Link
            href="/gift"
            className="group flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Gift
              size={12}
              className="text-orange-400 transition-transform group-hover:scale-110"
            />
            <span>Gift</span>
          </Link>
          <Link
            href="/blog"
            className="group flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FileText
              size={12}
              className="text-orange-400 transition-transform group-hover:scale-110"
            />
            <span>Blog</span>
          </Link>
          <Link
            href="/emi"
            className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span>EMI Policy</span>
          </Link>
          <Link
            href="/location"
            className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span>Store Location</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
