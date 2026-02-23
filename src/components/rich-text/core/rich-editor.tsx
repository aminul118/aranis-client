'use client';

import { BlogEditorKit } from '@/components/rich-text/kits/blog-editor-kit';
import { deserializeHtml } from '@/components/rich-text/lib/html-serializer';
import { Editor, EditorContainer } from '@/components/rich-text/ui/editor';
import { Plate, usePlateEditor } from 'platejs/react';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface PlateRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

const PlateRichEditor = ({
  value,
  onChange,
  height = 800,
}: PlateRichEditorProps) => {
  const initialValue = useMemo(() => {
    if (!value) return [{ type: 'p', children: [{ text: '' }] }];
    try {
      return JSON.parse(value);
    } catch (e) {
      return deserializeHtml(value);
    }
  }, [value]);

  const editor = usePlateEditor({
    plugins: BlogEditorKit,
    value: initialValue,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={({ value }) => {
          onChange(JSON.stringify(value));
        }}
      >
        <EditorContainer
          style={{ height: height }}
          className="bg-background scrollbar-small overflow-y-auto rounded-md border"
        >
          <Editor variant="fullWidth" className="p-4 focus:outline-none" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
};

export default PlateRichEditor;
