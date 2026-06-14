'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeClient = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor,
    },
  ];

  return (
    <section className="flex flex-1 items-center justify-center py-8">
      <div className="group relative w-full max-w-3xl overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm sm:p-10 dark:border-blue-900/30 dark:from-blue-950/20 dark:to-[#0a0a0a]">
        {/* Decorative dots (cutouts) */}
        <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />
        <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />

        <div className="flex flex-col gap-6">
          <div>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = theme === themeOption.value;

                  return (
                    <Label
                      key={themeOption.value}
                      htmlFor={themeOption.value}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all hover:border-blue-300 hover:bg-white dark:hover:border-blue-700 dark:hover:bg-black/50 ${
                        isSelected
                          ? 'border-blue-500 bg-white dark:border-blue-500 dark:bg-black/50'
                          : 'border-transparent bg-white/50 dark:bg-[#0a0a0a]/50'
                      }`}
                    >
                      <RadioGroupItem
                        value={themeOption.value}
                        id={themeOption.value}
                        className="sr-only"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {themeOption.label}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {themeOption.description}
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white/50 p-4 dark:border-blue-900/30 dark:bg-[#0a0a0a]/50">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Current theme:</strong>{' '}
              <span className="capitalize">{theme}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Changes are applied immediately and saved automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeClient;
