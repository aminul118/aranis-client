'use client';

import { BaseEditorKit } from '@/components/rich-text/kits/editor-base-kit';
import { EditorStatic } from '@/components/rich-text/ui/editor-static';
import { createSlateEditor } from 'platejs';
import { useEffect, useMemo, useState } from 'react';

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

  const staticEditor = useMemo(() => {
    if (!isPlate) return null;
    return createSlateEditor({ plugins: BaseEditorKit });
  }, [isPlate]);

  if (isPlate && staticEditor) {
    // Server renders an empty placeholder; client fills in PlateStatic after
    // mount — prevents the className mismatch hydration error from PlateStatic
    // adding classes (m-0 px-0 py-1) that the server never emitted.
    if (!mounted) {
      return <div className={className} suppressHydrationWarning />;
    }
    return (
      <div className={className} suppressHydrationWarning>
        <EditorStatic value={value} editor={staticEditor} variant="none" />
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
