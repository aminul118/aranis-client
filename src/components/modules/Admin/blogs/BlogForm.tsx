'use client';

import SubmitButton from '@/components/common/button/submit-button';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultipleImageDrop from '@/components/ui/multiple-image-drop';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import useActionHandler from '@/hooks/useActionHandler';
import { createBlog, updateBlog } from '@/services/blogs/blogs';
import { IBlog } from '@/types';
import { addBlogSchema, updateBlogSchema } from '@/zod/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type AddFormValues = z.infer<typeof addBlogSchema>;
type UpdateFormValues = z.infer<typeof updateBlogSchema>;

interface Props {
  blog?: IBlog;
}

const BlogForm = ({ blog }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!blog;

  const form = useForm<AddFormValues | UpdateFormValues>({
    resolver: zodResolver(isEdit ? updateBlogSchema : addBlogSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      thumbnail: blog?.thumbnail || undefined,
      photos: blog?.photos || [],
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        content: blog.content,
        thumbnail: blog.thumbnail,
        photos: blog.photos,
      });
    }
  }, [blog, form]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    if (isEdit && blog) {
      // Update Logic
      const { thumbnail, photos, ...rest } = data;

      const newPhotos =
        photos?.filter((p: any): p is File => p instanceof File) || [];
      const remainingPhotos =
        photos?.filter((p: any): p is string => typeof p === 'string') || [];

      formData.append(
        'data',
        JSON.stringify({
          ...rest,
          thumbnail: thumbnail instanceof File ? undefined : thumbnail,
          photos: remainingPhotos,
        }),
      );

      if (thumbnail instanceof File) {
        formData.append('thumbnail', thumbnail);
      }

      if (newPhotos.length > 0) {
        newPhotos.forEach((photo: File) => {
          formData.append('photos', photo);
        });
      }

      await executePost({
        action: () => updateBlog(formData, blog._id),
        success: {
          onSuccess: () => {
            router.push('/admin/blogs');
            router.refresh();
          },
          loadingText: 'Blog updating...',
          message: 'Blog updated successfully',
        },
      });
    } else {
      // Create Logic
      const { thumbnail, photos, ...rest } = data;
      formData.append('data', JSON.stringify(rest));

      if (thumbnail instanceof File) {
        formData.append('thumbnail', thumbnail);
      }

      if (photos && photos.length > 0) {
        photos.forEach((photo: File) => {
          formData.append('photos', photo);
        });
      }

      await executePost({
        action: () => createBlog(formData),
        success: {
          onSuccess: () => {
            router.push('/admin/blogs');
            router.refresh();
          },
          loadingText: 'Blog adding...',
          message: 'Blog added successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormDescription>
                The main heading for your blog post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Thumbnail Upload */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Thumbnail{' '}
                  {!isEdit && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <SingleImageUploader
                    defaultValue={field.value as string}
                    onChange={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Photos Upload */}
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <MultipleImageDrop
                    defaultValues={
                      (Array.isArray(field.value) ? field.value : []).filter(
                        (item) => typeof item === 'string',
                      ) as string[]
                    }
                    onChange={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Content/Bio */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Suspense fallback={<div>Loading editor…</div>}>
                  <PlateRichEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Suspense>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Blog' : 'Add Blog'}
            loadingEffect
            loadingText={isEdit ? 'Updating...' : 'Adding...'}
            icon={
              isEdit ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
