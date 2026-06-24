'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

// Dynamically import the heavy Plate renderer to avoid bundling it unconditionally
const PlateRenderer = dynamic(
  () =>
    import('@/components/rich-text/core/plate-renderer').then(
      (mod) => mod.PlateRenderer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-20 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
    ),
  },
);

interface IHtml {
  content: string;
  className?: string;
}

const HtmlContent = ({ content, className }: IHtml) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isPlate, value } = useMemo(() => {
    if (!content || typeof content !== 'string')
      return { isPlate: false, value: null };
    if (!content.trim().startsWith('[')) return { isPlate: false, value: null };

    try {
      const parsed = JSON.parse(content);
      return { isPlate: Array.isArray(parsed), value: parsed };
    } catch {
      return { isPlate: false, value: null };
    }
  }, [content]);

  if (isPlate && value) {
    if (!mounted) {
      return <div className={className} suppressHydrationWarning />;
    }
    return (
      <div className={className} suppressHydrationWarning>
        <PlateRenderer value={value} />
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HtmlContent;
