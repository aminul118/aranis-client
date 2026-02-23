'use client';

import * as React from 'react';

import type { WithRequiredKey } from 'platejs';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  FloatingMedia as FloatingMediaPrimitive,
  FloatingMediaStore,
  useFloatingMediaValue,
  useImagePreviewValue,
} from '@platejs/media/react';
import { cva } from 'class-variance-authority';
import {
  AlignCenter,
  AlignCenterVertical,
  AlignEndVertical,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  Link,
  MoveDown,
  MoveUp,
  Trash2Icon,
} from 'lucide-react';
import {
  useEditorRef,
  useEditorSelector,
  useElement,
  useFocusedLast,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
} from 'platejs/react';
import { toast } from 'sonner';
import { deleteImage } from '../actions/cloudinary';
import { CaptionButton } from './caption';

const inputVariants = cva(
  'flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent md:text-sm',
);

// Helper to extract Cloudinary public ID from URL
function getPublicIdFromUrl(url: string) {
  try {
    if (!url || !url.includes('cloudinary.com')) return null;
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove version (e.g., v16151515/)
    path = path.replace(/^v\d+\//, '');
    // Remove extension
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch (e) {
    return null;
  }
}

export function MediaToolbar({
  children,
  plugin,
}: {
  children: React.ReactNode;
  plugin: WithRequiredKey;
}) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const selected = useSelected();
  const isFocusedLast = useFocusedLast();
  const selectionCollapsed = useEditorSelector(
    (editor) => !editor.api.isExpanded(),
    [],
  );
  const isImagePreviewOpen = useImagePreviewValue('isOpen', editor.id);
  const open =
    isFocusedLast &&
    !readOnly &&
    selected &&
    selectionCollapsed &&
    !isImagePreviewOpen;
  const isEditing = useFloatingMediaValue('isEditing');

  React.useEffect(() => {
    if (!open && isEditing) {
      FloatingMediaStore.set('isEditing', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const element = useElement();
  const { props: buttonProps } = useRemoveNodeButton({ element });

  return (
    <Popover open={open} modal={false}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col">
            <div className="flex items-center">
              <div className="text-muted-foreground flex items-center pr-1 pl-2">
                <Link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants()}
                placeholder="Paste the embed link..."
                options={{ plugin }}
              />
            </div>
          </div>
        ) : (
          <div className="box-content flex items-center">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ size: 'sm', variant: 'ghost' })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <CaptionButton size="sm" variant="ghost">
              Caption
            </CaptionButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className={cn(element.align === 'left' && 'bg-muted')}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ align: 'left' }, { at: path });
                  }
                }}
              >
                <AlignLeft className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  (!element.align || element.align === 'center') && 'bg-muted',
                )}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ align: 'center' }, { at: path });
                  }
                }}
              >
                <AlignCenter className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(element.align === 'right' && 'bg-muted')}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ align: 'right' }, { at: path });
                  }
                }}
              >
                <AlignRight className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className={cn(element.objectPosition === 'top' && 'bg-muted')}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ objectPosition: 'top' }, { at: path });
                  }
                }}
                title="Crop Top"
              >
                <AlignStartVertical className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  (!element.objectPosition ||
                    element.objectPosition === 'center') &&
                    'bg-muted',
                )}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes(
                      { objectPosition: 'center' },
                      { at: path },
                    );
                  }
                }}
                title="Crop Center"
              >
                <AlignCenterVertical className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  element.objectPosition === 'bottom' && 'bg-muted',
                )}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes(
                      { objectPosition: 'bottom' },
                      { at: path },
                    );
                  }
                }}
                title="Crop Bottom"
              >
                <AlignEndVertical className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className={cn(element.width === '50%' && 'bg-muted')}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ width: '50%' }, { at: path });
                  }
                }}
              >
                50%
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(element.width === '75%' && 'bg-muted')}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ width: '75%' }, { at: path });
                  }
                }}
              >
                75%
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  (!element.width || element.width === '100%') && 'bg-muted',
                )}
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.setNodes({ width: '100%' }, { at: path });
                  }
                }}
              >
                100%
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path && path[0] > 0) {
                    editor.tf.moveNodes({
                      at: path,
                      to: [path[0] - 1],
                    });
                  }
                }}
                title="Move Up"
              >
                <MoveUp className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const path = editor.api.findPath(element);
                  if (path) {
                    editor.tf.moveNodes({
                      at: path,
                      to: [path[0] + 1],
                    });
                  }
                }}
                title="Move Down"
              >
                <MoveDown className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              size="sm"
              variant="ghost"
              {...buttonProps}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const elementData = element as any;
                const publicId =
                  elementData.publicId || getPublicIdFromUrl(elementData.url);

                if (publicId) {
                  const toastId = toast.loading('Deleting image...');
                  try {
                    const result = await deleteImage(publicId);
                    if (result.success) {
                      toast.success('Image deleted', { id: toastId });
                    } else {
                      console.error('Cloudinary delete error:', result.error);
                      toast.error('Failed to delete image from cloud', {
                        id: toastId,
                      });
                    }
                  } catch (error) {
                    console.error('Failed to delete image:', error);
                    toast.error('Error deleting image', { id: toastId });
                  }
                } else {
                  // toast.warning('Image ID not found, removing locally only');
                }

                // @ts-ignore
                buttonProps.onClick?.(e);
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
