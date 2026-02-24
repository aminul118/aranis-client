'use client';

import AminulLogo from '@/components/common/AminulLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IUser } from '@/types';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import { ChevronDown, Clock, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import CategoryBar from './CategoryBar';
import MainNavbar from './MainNavbar';
import { NavMenu } from './nav-menu';
import TopBar from './TopBar';

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({
  user,
  navItems = [],
}: {
  user: IUser | null;
  navItems?: NavMenu[];
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      if (!hidden) setHidden(true);
    } else {
      if (hidden) setHidden(false);
    }
    if (latest > 50) {
      if (!scrolled) setScrolled(true);
    } else {
      if (scrolled) setScrolled(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 left-0 z-50 flex w-full flex-col',
        scrolled ? 'shadow-lg' : '',
      )}
    >
      <TopBar />
      <MainNavbar user={user} />
      <CategoryBar />

      {/* Mobile Header (Shown on mobile instead of the tiers above if desired, but image shows a more complex mobile nav) */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#111111] px-4 py-3 lg:hidden">
        <AminulLogo className="origin-left scale-75" />
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-white">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[8px]">
              0
            </span>
          </Link>
          <Hamburger
            toggled={menuOpen}
            toggle={setMenuOpen}
            size={20}
            color="white"
            rounded
          />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && <Mobile navItems={navItems} setMenuOpen={setMenuOpen} />}
      </AnimatePresence>
    </motion.header>
  );
};

const Mobile = ({ navItems, setMenuOpen }: MobileProps) => {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-60 bg-white transition-colors lg:hidden dark:bg-[#0a0a0a]"
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-8 flex items-center justify-between">
          <AminulLogo className="scale-90 text-black! dark:text-white!" />
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-900"
          >
            <ChevronDown className="rotate-90" size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map(({ title, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={title}
                href={href}
                className={cn(
                  'flex items-center justify-between rounded-xl border border-transparent px-4 py-4 text-sm font-bold tracking-widest uppercase transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:border-gray-100 hover:bg-gray-50 dark:text-gray-400 dark:hover:border-white/5 dark:hover:bg-white/5',
                )}
                onClick={() => setMenuOpen(false)}
              >
                {title}
                <ChevronDown className="-rotate-90 opacity-50" size={14} />
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-white/5">
          <Link
            href="/track-order"
            className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
          >
            <Clock size={16} /> Order Tracking
          </Link>
          <Button
            asChild
            className="w-full rounded-2xl bg-[#111111] py-7 text-base font-black tracking-widest text-white uppercase"
          >
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Login Account
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
