'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
] as const;

const FooterThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            {themes.map(({ value, icon: Icon, label }) => {
                const isActive = theme === value;
                return (
                    <motion.button
                        key={value}
                        onClick={() => setTheme(value)}
                        title={label}
                        aria-label={`Switch to ${label} theme`}
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`relative flex items-center justify-center rounded-full p-2
              ${isActive
                                ? 'text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="footer-theme-pill"
                                className="absolute inset-0 rounded-full bg-primary shadow-sm"
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            />
                        )}
                        <Icon className="relative z-10 h-3.5 w-3.5" />
                    </motion.button>
                );
            })}
        </div>
    );
};

export default FooterThemeToggle;
