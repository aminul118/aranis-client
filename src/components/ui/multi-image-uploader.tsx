'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
    /** Existing URLs (edit mode) */
    value: string[];
    onChange: (urls: string[]) => void;
    /** Max number of gallery images */
    max?: number;
    label?: string;
}

const MultiImageUploader = ({ value = [], onChange, max = 8, label = 'Gallery Images' }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleAddUrl = () => {
        const url = urlInput.trim();
        if (!url) return;
        if (!url.startsWith('http')) {
            toast.error('Please enter a valid image URL starting with http(s)://');
            return;
        }
        if (value.includes(url)) {
            toast.error('This image URL is already added');
            return;
        }
        if (value.length >= max) {
            toast.error(`Maximum ${max} images allowed`);
            return;
        }
        onChange([...value, url]);
        setUrlInput('');
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleSetFirst = (index: number) => {
        if (index === 0) return;
        const next = [...value];
        const [moved] = next.splice(index, 1);
        next.unshift(moved);
        onChange(next);
        toast.success('Set as primary gallery image');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">{label}</p>
                <span className="text-xs text-muted-foreground">{value.length}/{max} images</span>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                    placeholder="Paste image URL and press Enter or click Add"
                    className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim() || value.length >= max}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold disabled:opacity-40 transition-all flex items-center gap-2"
                >
                    <ImagePlus size={16} />
                    Add
                </button>
            </div>

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {value.map((url, idx) => (
                        <div
                            key={url + idx}
                            className={cn(
                                'relative aspect-square rounded-xl overflow-hidden border-2 group transition-all',
                                idx === 0
                                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                                    : 'border-border hover:border-blue-500/40'
                            )}
                        >
                            <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />

                            {/* Overlay controls */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                {idx !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetFirst(idx)}
                                        title="Set as first image"
                                        className="p-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-white transition-colors"
                                    >
                                        <Star size={13} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(idx)}
                                    title="Remove"
                                    className="p-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white transition-colors"
                                >
                                    <X size={13} />
                                </button>
                            </div>

                            {/* Primary badge */}
                            {idx === 0 && (
                                <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                    FIRST
                                </div>
                            )}

                            <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                                {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {value.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
                    <ImagePlus className="mx-auto mb-2 h-8 w-8 opacity-30" />
                    <p>No gallery images yet. Paste a URL above to add images.</p>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                💡 Hover an image to reorder or remove. The first image is shown as the primary gallery view. Max {max} images.
            </p>
        </div>
    );
};

export default MultiImageUploader;
