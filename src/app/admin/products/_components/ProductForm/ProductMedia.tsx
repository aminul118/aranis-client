import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SingleVideoUploader from '@/components/ui/single-video-uploader';
import { getYoutubeEmbedUrl } from '@/lib/utils';
import { IProductUpload } from '@/services/product/product.interface';
import { useFormContext } from 'react-hook-form';

export default function ProductMedia() {
  const form = useFormContext<IProductUpload>();

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="youtubeVideoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Video URL</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    {...field}
                  />
                  {field.value && getYoutubeEmbedUrl(field.value) ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
                      <iframe
                        src={getYoutubeEmbedUrl(field.value) || ''}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted/50 text-muted-foreground flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed">
                      <span className="text-sm">Preview will appear here</span>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-16"></FormLabel>
              <FormControl>
                <SingleVideoUploader
                  defaultValue={
                    typeof field.value === 'string' ? field.value : ''
                  }
                  onChange={(file) => field.onChange(file)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
