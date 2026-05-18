'use client';

import { EditorKit } from '@/components/rich-text/kits/editor-kit';
import { deserializeHtml } from '@/components/rich-text/lib/html-serializer';
import { Editor, EditorContainer } from '@/components/rich-text/ui/editor';
import { Plate, usePlateEditor } from 'platejs/react';
import { useEffect, useState } from 'react';

interface PlateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface PlateEditorInnerProps {
  initialValue: any[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function PlateEditorInner({
  initialValue,
  onChange,
  placeholder,
}: PlateEditorInnerProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,
  });

  return (
    <Plate
      editor={editor}
      onValueChange={({ value }) => {
        onChange(JSON.stringify(value));
      }}
    >
      <EditorContainer>
        <Editor placeholder={placeholder} variant="demo" />
      </EditorContainer>
    </Plate>
  );
}

export function PlateEditor({
  value,
  onChange,
  placeholder,
}: PlateEditorProps) {
  const [initialValue, setInitialValue] = useState<any[] | null>(null);

  useEffect(() => {
    if (!initialValue && value) {
      try {
        const parsed = JSON.parse(value);
        setInitialValue(
          Array.isArray(parsed) ? parsed : deserializeHtml(value),
        );
      } catch (e) {
        setInitialValue(deserializeHtml(value));
      }
    } else if (!initialValue && !value) {
      setInitialValue([{ type: 'p', children: [{ text: '' }] }]);
    }
  }, [value, initialValue]);

  if (!initialValue) {
    return (
      <div className="flex h-48 w-full animate-pulse items-center justify-center rounded-2xl border border-white/5 bg-[#151722]/50 text-xs font-bold tracking-wider text-zinc-500 uppercase">
        Loading editor...
      </div>
    );
  }

  return (
    <PlateEditorInner
      initialValue={initialValue}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default PlateEditor;
