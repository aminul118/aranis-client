'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Moon, Palette, Sun } from 'lucide-react';
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
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Palette className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-medium">Theme</h3>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="grid gap-4">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = theme === themeOption.value;

                  return (
                    <Label
                      key={themeOption.value}
                      htmlFor={themeOption.value}
                      className={`hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <RadioGroupItem
                        value={themeOption.value}
                        id={themeOption.value}
                      />
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Icon className="text-primary h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{themeOption.label}</div>
                        <div className="text-muted-foreground text-sm">
                          {themeOption.description}
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          <div className="border-muted bg-muted/20 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Current theme:</strong>{' '}
              <span className="capitalize">{theme}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Changes are applied immediately and saved automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ThemeClient;
