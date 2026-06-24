import { BaseEditorKit } from '@/components/rich-text/kits/editor-base-kit';
import { EditorStatic } from '@/components/rich-text/ui/editor-static';
import { createSlateEditor } from 'platejs';
import { useMemo } from 'react';

export const PlateRenderer = ({ value }: { value: any }) => {
  const staticEditor = useMemo(() => {
    return createSlateEditor({ plugins: BaseEditorKit });
  }, []);

  return <EditorStatic value={value} editor={staticEditor} variant="none" />;
};
