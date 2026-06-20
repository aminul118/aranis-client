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
  // Use a ref to store the initial value to avoid re-parsing on every keystroke
  const initialValueRef = useMemo(() => {
    if (!value) return [{ type: 'p', children: [{ text: '' }] }];
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
      return deserializeHtml(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We only want the initial value once for the editor setup

  const editor = usePlateEditor({
    plugins: BlogEditorKit,
    value: initialValueRef,
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
