'use client';

import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import ImageDrop from '@/components/ui/image-drop';
import { Input } from '@/components/ui/input';
import MultipleImageDrop from '@/components/ui/multiple-image-drop';
import useActionHandler from '@/hooks/useActionHandler';
import { updateProject } from '@/services/project/projects';
import { IProject } from '@/types';
import { projectValidationSchema } from '@/zod/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { Suspense, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

type FormValues = z.infer<typeof projectValidationSchema>;

interface Props {
  project: IProject;
  onCancel: () => void;
  onUpdated?: () => void;
}

const EditProject = ({ project, onCancel, onUpdated }: Props) => {
  const { executePost } = useActionHandler();

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: project?.title || '',
      slug: project?.slug || '',
      liveLink: project?.liveLink || '',
      github: project?.github || '',
      content: project?.content || '',
      technology: project?.technology || [],
      isFeatured: !!project?.isFeatured,
      thumbnail: undefined as any,
      photos: undefined as any,
    }),
    [project],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(projectValidationSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    const { thumbnail, photos, ...rest } = data;
    formData.append('data', JSON.stringify(rest));

    if (thumbnail instanceof File) {
      formData.append('thumbnail', thumbnail);
    }

    if (Array.isArray(photos)) {
      photos.forEach((p) => {
        if (p instanceof File) formData.append('photos', p);
      });
    }

    await executePost({
      action: () => updateProject(formData, project._id),
      success: {
        onSuccess: () => {
          onUpdated?.();
        },
        loadingText: 'Project updating...',
        message: 'Project updated successfully',
      },
      errorMessage: 'Failed to update project.',
    });
  };

  return (
    <div className="rounded-2xl">
      <CardContent className="pt-6">
        <form id="edit-project-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <FieldGroup className="grid grid-cols-2 gap-6">
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input {...field} placeholder="Portfolio Website" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Slug */}
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Slug</FieldLabel>
                    <Input {...field} placeholder="portfolio-website" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Live Link */}
              <Controller
                name="liveLink"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Live URL</FieldLabel>
                    <Input {...field} placeholder="https://example.com" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* GitHub */}
              <Controller
                name="github"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>GitHub URL (optional)</FieldLabel>
                    <Input {...field} placeholder="https://github.com/..." />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Technology */}
              <Controller
                name="technology"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel>Technologies</FieldLabel>
                    <Input
                      defaultValue={(field.value || []).join(', ')}
                      placeholder="React, Next.js, Tailwind"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                    <FieldDescription>
                      Separate technologies with commas
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Thumbnail (new) */}
              <Controller
                name="thumbnail"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Thumbnail (optional new)</FieldLabel>
                    <ImageDrop onChange={field.onChange} />
                    <FieldDescription>
                      Leave empty to keep current thumbnail.
                    </FieldDescription>
                  </Field>
                )}
              />

              {/* Photos (new) */}
              <Controller
                name="photos"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Gallery Images (optional new)</FieldLabel>
                    <MultipleImageDrop onChange={field.onChange} />
                    <FieldDescription>
                      Leave empty to keep existing gallery.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              {/* Content */}
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Suspense fallback={<div>Loading editor...</div>}>
                      <PlateRichEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </Suspense>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Featured */}
          <Controller
            name="isFeatured"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="mt-4">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel>Featured Project</FieldLabel>
              </Field>
            )}
          />

          <CardFooter className="flex justify-end gap-2 border-t py-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </CardFooter>
        </form>
      </CardContent>
    </div>
  );
};

export default EditProject;
