'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImagePlus, X, Star, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
    /** Existing URLs or Files */
    value: (string | File)[];
    onChange: (values: (string | File)[]) => void;
    /** Max number of gallery images */
    max?: number;
    label?: string;
}

const MultiImageUploader = ({ value = [], onChange, max = 8, label = 'Gallery Images' }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const newPreviews = value.map(item => {
            if (typeof item === 'string') return item;
            return URL.createObjectURL(item);
        });
        setPreviews(newPreviews);

        // Cleanup
        return () => {
            newPreviews.forEach(p => {
                if (!value.includes(p)) URL.revokeObjectURL(p);
            });
        };
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (value.length + files.length > max) {
            toast.error(`Maximum ${max} images allowed`);
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} is too large (> 2MB)`);
                return false;
            }
            return true;
        });

        onChange([...value, ...validFiles]);
        if (inputRef.current) inputRef.current.value = '';
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
                <div>
                    <p className="text-sm font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Recommended: 4:5 aspect ratio, max 2MB each</p>
                </div>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">{value.length}/{max} images</span>
            </div>

            <div
                onClick={() => inputRef.current?.click()}
                className="group relative border-2 border-dashed border-border hover:border-blue-500/50 rounded-2xl p-8 transition-all cursor-pointer bg-muted/30 hover:bg-muted/50 overflow-hidden"
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Upload size={20} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to {max} images</p>
                    </div>
                </div>
            </div>

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {value.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'relative aspect-[4/5] rounded-2xl overflow-hidden border-2 group transition-all duration-300 shadow-sm',
                                idx === 0
                                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-border hover:border-blue-500/40'
                            )}
                        >
                            {previews[idx] && (
                                <Image
                                    src={previews[idx]}
                                    alt={`Gallery ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}

                            {/* Overlay controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                {idx !== 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleSetFirst(idx); }}
                                        className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all transform hover:scale-110"
                                        title="Set as first"
                                    >
                                        <Star size={16} fill="currentColor" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
                                    className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all transform hover:scale-110"
                                    title="Remove"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
                                {idx === 0 && (
                                    <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
                                        PRIMARY
                                    </div>
                                )}
                                {typeof item !== 'string' && (
                                    <div className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
                                        NEW
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-lg font-bold">
                                {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                The first image in the gallery will be used as the secondary view on hover in shop pages.
            </p>
        </div>
    );
};

export default MultiImageUploader;

