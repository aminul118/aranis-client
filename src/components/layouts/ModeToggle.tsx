'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <Tooltip key={value} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(value)}
                aria-label={label}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-background text-foreground ring-border shadow-sm ring-1'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={8}
              className="text-[10px] font-bold tracking-widest uppercase"
            >
              {label} Theme
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ModeToggle;
