'use client';

import SubmitButton from '@/components/common/button/submit-button';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useActionHandler from '@/hooks/useActionHandler';
import { createCategory, updateCategory } from '@/services/category/category';
import type { ICategory } from '@/services/category/category.interface';
import { addCategorySchema } from '@/services/category/category.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof addCategorySchema>;

interface Props {
  category?: ICategory;
}

const CategoryForm = ({ category }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!category;

  const form = useForm<FormValues>({
    resolver: zodResolver(addCategorySchema) as any,
    defaultValues: {
      name: category?.name || '',
      subCategories: category?.subCategories || [{ title: '', items: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subCategories',
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
    };

    if (isEdit && category) {
      await executePost({
        action: () => updateCategory(payload, category._id as string),
        success: {
          onSuccess: () => {
            router.push('/admin/categories');
            router.refresh();
          },
          loadingText: 'Category updating...',
          message: 'Category updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createCategory(payload as ICategory),
        success: {
          onSuccess: () => {
            router.push('/admin/categories');
            router.refresh();
          },
          loadingText: 'Category adding...',
          message: 'Category added successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Men" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Sub Categories</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', items: [] })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Sub Category
            </Button>
          </div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 rounded-lg border border-white/10 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`subCategories.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Category Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="eg. Shirts" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subCategories.${index}.items`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Types (comma separated, Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Formal, Casual, Oversized"
                            value={
                              Array.isArray(field.value)
                                ? field.value.join(', ')
                                : field.value
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive mt-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Category' : 'Add Category'}
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

export default CategoryForm;
