'use client';

import AminulLogo from '@/components/common/AminulLogo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { IUser } from '@/types';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import HeaderUser from '../shared/HeaderUser';
import NotificationBell from '../shared/NotificationBell';
import { NavMenu } from './nav-menu';
import NavSearch from './NavSearch';
import PortalButton from './PortalButton';

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({
  user,
  navItems = [],
}: {
  user: IUser;
  navItems?: NavMenu[];
}) => {
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
          ? 'border-border bg-background/80 border-b py-4 shadow-lg backdrop-blur-md'
          : 'bg-transparent py-4',
      )}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <AminulLogo className="ml-2 lg:ml-0" />

        {/* Desktop Navigation */}
        <div className="border-border bg-muted/50 hidden items-center gap-1 rounded-full border px-2 py-1.5 shadow-sm backdrop-blur-sm lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href;
            const hasSubItems = !!item.subItems && item.subItems.length > 0;

            return (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() =>
                  setHoveredItem(hasSubItems ? item.title : null)
                }
              >
                <Link
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  className={cn(
                    'relative flex items-center gap-1 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive || hoveredItem === item.title
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-blue-600/20"
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                  {hasSubItems && (
                    <ChevronDown
                      size={14}
                      className={cn(
                        'relative z-10 transition-transform',
                        hoveredItem === item.title && 'rotate-180',
                      )}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden lg:block">
              <NotificationBell user={user} />
            </div>
          )}
          <NavSearch />
          <Link
            href="/cart"
            className="text-muted-foreground hover:text-foreground relative transition-colors"
          >
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
          <div className="bg-border h-6 w-px" />
          {user ? <HeaderUser user={user} /> : <PortalButton />}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <NavSearch />
          <Hamburger
            toggled={menuOpen}
            toggle={setMenuOpen}
            size={24}
            rounded
          />
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
            className="border-border bg-background/95 absolute top-full left-0 w-full border-b py-12 shadow-2xl backdrop-blur-xl"
          >
            <div className="container mx-auto grid grid-cols-3 gap-8">
              {navItems
                .find((i) => i.title === hoveredItem)
                ?.subItems?.map((sub) => (
                  <div key={sub.title} className="flex flex-col gap-4">
                    <h3 className="text-muted-foreground/60 text-sm font-bold tracking-widest uppercase">
                      {sub.title}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {sub.items.map((subItem) => (
                        <Link
                          key={subItem}
                          href={`/shop?category=${hoveredItem}&subCategory=${sub.title}&type=${subItem}`}
                          className="text-muted-foreground text-base font-medium transition-colors hover:text-blue-500"
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
      className="border-border bg-background/95 overflow-hidden border-b backdrop-blur-xl lg:hidden"
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
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              onClick={() => setMenuOpen(false)}
            >
              {title}
            </Link>
          );
        })}
        <div className="border-border mt-4 flex w-full justify-center border-t pt-4">
          <Button
            asChild
            size="sm"
            className="group bg-primary text-primary-foreground relative w-full max-w-xs overflow-hidden rounded-full font-bold shadow-lg"
          >
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <div className="border-border absolute inset-0 rounded-full border p-px">
                <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#06b6d4_50%,#3b82f6_100%)]" />
              </div>
              <div className="bg-primary absolute inset-px rounded-full" />
              <span className="relative z-10 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Login
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
