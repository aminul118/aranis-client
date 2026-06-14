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
import { createNavbar, INavItem, updateNavbar } from '@/services/navbar/navbar';
import { addNavItemSchema } from '@/zod/navbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface FormValues {
  title: string;
  href: string;
  order: string | number;
  subItems: {
    title: string;
    href: string;
    items: { label: string; url: string }[];
  }[];
}

interface Props {
  navbar?: INavItem;
}

const NavbarForm = ({ navbar }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!navbar;

  const form = useForm<FormValues>({
    resolver: zodResolver(addNavItemSchema) as any,
    defaultValues: {
      title: navbar?.title || '',
      href: navbar?.href || '',
      order: navbar?.order || 0,
      subItems:
        navbar?.subItems?.map((item) => ({
          ...item,
          items: item.items || [],
        })) || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'subItems',
  });

  const onSubmit = async (values: any) => {
    const data = values as z.infer<typeof addNavItemSchema>;
    const payload = {
      ...data,
      order: Number(data.order),
      subItems: data.subItems,
    };

    if (isEdit && navbar) {
      await executePost({
        action: () => updateNavbar(payload as any, navbar._id as string),
        success: {
          onSuccess: () => {
            router.push('/admin/navbar');
            router.refresh();
          },
          loadingText: 'Navbar updating...',
          message: 'Navbar updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createNavbar(payload as INavItem),
        success: {
          onSuccess: () => {
            router.push('/admin/navbar');
            router.refresh();
          },
          loadingText: 'Navbar item adding...',
          message: 'Navbar item added successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Pakistani, Shop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="href"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="/shop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Sub Sections (Mega Menu)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', href: '', items: [] })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
          {fields.map((field, index) => (
            <SectionDraggable
              key={field.id}
              form={form}
              index={index}
              remove={remove}
              move={move}
            />
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Menu Item' : 'Add Menu Item'}
            loadingEffect
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

const SectionDraggable = ({ form, index, remove, move }: any) => {
  const {
    fields,
    append,
    remove: removeItem,
    move: moveItem,
  } = useFieldArray({
    control: form.control,
    name: `subItems.${index}.items`,
  });

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('sectionIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    const sourceIndex = e.dataTransfer.getData('sectionIndex');
    if (sourceIndex) {
      const src = parseInt(sourceIndex, 10);
      if (src !== index && !isNaN(src)) {
        move(src, index);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex items-start gap-4">
        <div className="mt-8 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing dark:hover:text-gray-200">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`subItems.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sarabahar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subItems.${index}.href`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="/shop/sarabahar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 rounded-lg border border-dashed border-gray-200 p-3 dark:border-white/10">
            <div className="flex items-center justify-between pb-2">
              <FormLabel className="text-xs">
                Links inside this section
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => append({ label: '', url: '' })}
              >
                <Plus className="mr-1 h-3 w-3" /> Add Link
              </Button>
            </div>

            {fields.map((itemField, itemIndex) => (
              <ItemDraggable
                key={itemField.id}
                form={form}
                sectionIndex={index}
                itemIndex={itemIndex}
                remove={removeItem}
                move={moveItem}
              />
            ))}
            {fields.length === 0 && (
              <p className="text-center text-xs text-gray-500">
                No links added yet.
              </p>
            )}
          </div>
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
  );
};

const ItemDraggable = ({
  form,
  sectionIndex,
  itemIndex,
  remove,
  move,
}: any) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('itemIndex', itemIndex.toString());
    e.dataTransfer.setData('sectionIndex', sectionIndex.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const sourceItemIndex = e.dataTransfer.getData('itemIndex');
    const sourceSectionIndex = e.dataTransfer.getData('sectionIndex');

    // Only allow drag and drop within the same section for simplicity
    if (sourceItemIndex && sourceSectionIndex === sectionIndex.toString()) {
      const src = parseInt(sourceItemIndex, 10);
      if (src !== itemIndex && !isNaN(src)) {
        move(src, itemIndex);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex items-center gap-2 rounded bg-gray-50 p-2 dark:bg-white/5"
    >
      <div className="cursor-grab text-gray-400 active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>
      <FormField
        control={form.control}
        name={`subItems.${sectionIndex}.items.${itemIndex}.label`}
        render={({ field }) => (
          <FormControl>
            <Input
              className="h-8 text-xs"
              placeholder="Link Label"
              {...field}
            />
          </FormControl>
        )}
      />
      <FormField
        control={form.control}
        name={`subItems.${sectionIndex}.items.${itemIndex}.url`}
        render={({ field }) => (
          <FormControl>
            <Input className="h-8 text-xs" placeholder="/url" {...field} />
          </FormControl>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500"
        onClick={() => remove(itemIndex)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavbarForm;
