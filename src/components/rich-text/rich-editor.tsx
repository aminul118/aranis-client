'use client';

import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/rich-text/kits/editor-kit';
import { Editor, EditorContainer } from '@/components/rich-text/ui/editor';
import { useEffect, useState } from 'react';

interface PlateEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function PlateEditor({ value, onChange, placeholder }: PlateEditorProps) {
    const [initialValue, setInitialValue] = useState<any[] | null>(null);

    useEffect(() => {
        if (!initialValue && value) {
            try {
                const parsed = JSON.parse(value);
                setInitialValue(Array.isArray(parsed) ? parsed : [{ type: 'p', children: [{ text: value }] }]);
            } catch (e) {
                setInitialValue([{ type: 'p', children: [{ text: value }] }]);
            }
        } else if (!initialValue && !value) {
            setInitialValue([{ type: 'p', children: [{ text: '' }] }]);
        }
    }, [value, initialValue]);

    const editor = usePlateEditor({
        plugins: EditorKit,
        value: initialValue || [{ type: 'p', children: [{ text: '' }] }],
    });

    if (!initialValue) return null;

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

export default PlateEditor;
