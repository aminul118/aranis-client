import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { AlertCircleIcon, UploadIcon, VideoIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';

interface VideoDropProps {
  onChange: (file: File | null) => void;
  defaultValue?: string;
  recommendation?: string;
}

const SingleVideoUploader = ({
  onChange,
  defaultValue,
  recommendation,
}: VideoDropProps) => {
  const maxSizeMB = 30;
  const maxSize = maxSizeMB * 1024 * 1024;

  const initialFiles = defaultValue
    ? [
        {
          name: 'Video',
          size: 0,
          type: 'video/mp4',
          url: defaultValue,
          id: 'initial-video',
        },
      ]
    : [];

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'video/mp4,video/webm',
    maxSize,
    initialFiles,
  });

  const previewUrl = files[0]?.preview || (files[0]?.file as any)?.url || null;

  // Propagate value to parent (react-hook-form)
  useEffect(() => {
    if (files.length > 0) {
      const currentFile = files[0].file;
      if (currentFile instanceof File) {
        onChange(currentFile);
      } else {
        onChange((currentFile as any).url);
      }
    } else {
      onChange(null);
    }
  }, [files, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload video file"
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <video
                src={previewUrl}
                controls
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <VideoIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your video here</p>
              <p className="text-muted-foreground text-xs">
                MP4 or WebM (max. {maxSizeMB}MB)
              </p>
              {recommendation && (
                <p className="mt-2 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-wider text-blue-600 uppercase dark:bg-blue-500/20 dark:text-blue-400">
                  {recommendation}
                </p>
              )}
              {/* IMPORTANT: type="button" so this doesn't submit the parent form */}
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select video
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove video"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};

export default SingleVideoUploader;
