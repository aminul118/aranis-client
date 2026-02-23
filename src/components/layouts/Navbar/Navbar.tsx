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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NavMenu } from './nav-menu';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import UserAvatar from './NavUser';
import PortalButton from './PortalButton';

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ user, navItems = [] }: { user: IUser; navItems?: NavMenu[] }) => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

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
        'fixed top-0 left-0 z-50 w-full transition-all duration-300',
        scrolled || hoveredItem
          ? 'border-b border-white/5 bg-slate-900/80 py-4 shadow-lg backdrop-blur-md'
          : 'bg-transparent py-4',
      )}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <AminulLogo className="ml-2 lg:ml-0" />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2 py-1.5 shadow-sm backdrop-blur-sm lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href;
            const hasSubItems = !!item.subItems;

            return (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setHoveredItem(hasSubItems ? item.title : null)}
              >
                <Link
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  className={cn(
                    'relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1',
                    isActive || hoveredItem === item.title ? 'text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-blue-600/20"
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                  {hasSubItems && <ChevronDown size={14} className={cn("relative z-10 transition-transform", hoveredItem === item.title && "rotate-180")} />}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/cart" className="relative text-slate-400 transition-colors hover:text-white">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <div className="h-6 w-px bg-white/10" />
          {user ? <UserAvatar user={user} /> : <PortalButton />}
        </div>

        <div className="lg:hidden">
          <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={24} color="#fff" rounded />
        </div>
      </nav>

      {/* Mega Menu Content */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full w-full border-b border-white/5 bg-slate-900/90 py-12 shadow-2xl backdrop-blur-xl"
          >
            <div className="container mx-auto grid grid-cols-3 gap-8">
              {navItems.find(i => i.title === hoveredItem)?.subItems?.map((sub) => (
                <div key={sub.title} className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">{sub.title}</h3>
                  <div className="flex flex-col gap-2">
                    {sub.items.map((subItem) => (
                      <Link
                        key={subItem}
                        href={`/shop?category=${hoveredItem}&subCategory=${sub.title}&type=${subItem}`}
                        className="text-slate-400 hover:text-blue-400 transition-colors text-base font-medium"
                        onClick={() => setHoveredItem(null)}
                      >
                        {subItem} {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border-b border-white/10 bg-slate-900/95 backdrop-blur-xl lg:hidden"
    >
      <div className="container mx-auto flex flex-col items-center gap-1 p-4">
        {navItems.map(({ title, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={title}
              href={href}
              className={cn(
                'relative w-full rounded-lg py-2.5 text-center text-base font-medium transition-all',
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
              onClick={() => setMenuOpen(false)}
            >
              {title}
            </Link>
          );
        })}
        <div className="mt-4 flex w-full justify-center border-t border-white/5 pt-4">
          <Button asChild size="sm" className="group relative w-full max-w-xs overflow-hidden rounded-full bg-slate-900 font-bold text-white shadow-lg">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <div className="absolute inset-0 rounded-full border border-white/10 p-px">
                <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#06b6d4_50%,#3b82f6_100%)]" />
              </div>
              <div className="absolute inset-px rounded-full bg-slate-900" />
              <span className="relative z-10 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Portal / Login
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
