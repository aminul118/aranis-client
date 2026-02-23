'use client';

import PlateEditor from '@/components/rich-text/rich-editor';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
    return (
        <div className={className}>
            <PlateEditor
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
