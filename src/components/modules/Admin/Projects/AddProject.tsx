'use client';

import SubmitButton from '@/components/common/button/submit-button';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import GradientTitle from '@/components/ui/gradientTitle';
import ImageDrop from '@/components/ui/image-drop';
import { Input } from '@/components/ui/input';
import MultipleImageDrop from '@/components/ui/multiple-image-drop';
import useActionHandler from '@/hooks/useActionHandler';
import { createProject } from '@/services/project/projects';
import { projectValidationSchema } from '@/zod/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

type FormValues = z.infer<typeof projectValidationSchema>;

const AddProjects = () => {
  const { executePost } = useActionHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(projectValidationSchema),
    defaultValues: {
      title: '',
      slug: '',
      liveLink: '',
      github: '',
      content: '',
      technology: [],
      isFeatured: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    // Exclude the raw File from the JSON blob
    const { thumbnail, photos, ...rest } = data;
    formData.append('data', JSON.stringify(rest));

    if (thumbnail instanceof File) {
      formData.append('thumbnail', thumbnail);
    }
    if (photos && photos.length > 0) {
      photos.forEach((photo: File) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
    }

    await executePost({
      action: () => createProject(formData),
      success: {
        onSuccess: () => {
          form.reset();
        },
        loadingText: 'Project adding...',
        message: 'Project added successfully',
        redirectPath: '/admin/projects',
      },
      errorMessage: 'Failed to add project.',
    });
  };

  return (
    <div className="w-full">
      <div className="mb-12 flex justify-between">
        <GradientTitle title="Create Projects" className="text-left" />
        <Button asChild>
          <Link href={'/admin/projects'}>
            <Undo2 />
            Back to Projects
          </Link>
        </Button>
      </div>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <FieldGroup className="grid grid-cols-2">
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

              {/* Thumbnail */}
              <Controller
                name="thumbnail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Thumbnail</FieldLabel>
                    <ImageDrop onChange={field.onChange} />
                  </Field>
                )}
              />

              {/* Photos */}
              <Controller
                name="photos"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Gallery Images (optional)</FieldLabel>
                    <MultipleImageDrop onChange={field.onChange} />
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              {/* Content */}
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
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
          <SubmitButton className="mt-4" icon={<Plus />} text="Add Project" />
        </form>
      </CardContent>
    </div>
  );
};

export default AddProjects;
