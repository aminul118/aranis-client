'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="bg-muted flex items-center gap-[2px] rounded-full p-[2px]">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;

        return (
          <Tooltip key={value} delayDuration={300}>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => setTheme(value)}
                aria-label={`Switch to ${label} theme`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`relative flex h-6 w-6 items-center justify-center rounded-full ${
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="footer-theme-pill"
                    className="bg-primary absolute inset-0 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                <Icon className="relative z-10 h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={12}
              className="text-[10px] font-bold tracking-widest uppercase"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
