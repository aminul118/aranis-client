'use client';

import { cn } from '@/lib/utils';
import { Star, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  /** Existing URLs or Files */
  value: (string | File)[];
  onChange: (values: (string | File)[]) => void;
  /** Max number of gallery images */
  max?: number;
  label?: string;
  required?: boolean;
}

const MultiImageUploader = ({
  value = [],
  onChange,
  max = 8,
  label = 'Gallery Images',
  required = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = value.map((item) => {
      if (typeof item === 'string') return item;
      return URL.createObjectURL(item);
    });
    setPreviews(newPreviews);

    // Cleanup
    return () => {
      newPreviews.forEach((p) => {
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

    const validFiles = files.filter((file) => {
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
          <p className="text-foreground text-sm font-bold">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            Recommended: Portrait aspect ratio (3:4 or 4:5, e.g., 900x1200 px or
            800x1000 px), max 2MB each
          </p>
        </div>
        <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
          {value.length}/{max} images
        </span>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="group border-border bg-muted/30 hover:bg-muted/50 relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all hover:border-blue-500/50"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="bg-background flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
            <Upload size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Click to upload or drag and drop
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, WebP up to {max} images
            </p>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'group relative aspect-[4/5] overflow-hidden rounded-2xl border-2 shadow-sm transition-all duration-300',
                idx === 0
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-border hover:border-blue-500/40',
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
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetFirst(idx);
                    }}
                    className="transform rounded-xl bg-amber-500 p-2 text-white transition-all hover:scale-110 hover:bg-amber-600"
                    title="Set as first"
                  >
                    <Star size={16} fill="currentColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="transform rounded-xl bg-red-500 p-2 text-white transition-all hover:scale-110 hover:bg-red-600"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Badges */}
              <div className="pointer-events-none absolute top-2 left-2 flex flex-col gap-1.5">
                {idx === 0 && (
                  <div className="rounded-lg bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white shadow-lg">
                    PRIMARY
                  </div>
                )}
                {typeof item !== 'string' && (
                  <div className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[9px] font-black text-white shadow-lg">
                    NEW
                  </div>
                )}
              </div>

              <div className="absolute right-2 bottom-2 rounded-lg bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-muted-foreground bg-muted/30 border-border/50 flex items-center gap-1.5 rounded-xl border p-3 text-[11px]">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
        The first image in the gallery will be used as the secondary view on
        hover in shop pages.
      </p>
    </div>
  );
};

export default MultiImageUploader;
