import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ICategory } from '@/services/category/category.interface';
import { IProductUpload } from '@/services/product/product.interface';
import { useFormContext } from 'react-hook-form';
import QuickAddCategory from '../../../categories/_components/QuickAddCategory';

interface Props {
  localCategories: ICategory[];
  setLocalCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

export default function ProductGeneralInfo({
  localCategories,
  setLocalCategories,
}: Props) {
  const form = useFormContext<IProductUpload>();

  const selectedCategory = localCategories.find(
    (c) => c.name === form.watch('category'),
  );
  const subCategories = selectedCategory?.subCategories || [];
  const selectedSubCategory = subCategories.find(
    (s) => s.title === form.watch('subCategory'),
  );
  const types = selectedSubCategory?.items || [];

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-bold tracking-widest text-blue-600 uppercase">
              Product Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Premium Silk Pakistani Suit"
                className="text-lg font-bold"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug (Unique ID)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. classic-silk-shirt" {...field} />
            </FormControl>
            <FormDescription>
              Auto-generated from name if left empty.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="flex h-9 items-center justify-between">
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <QuickAddCategory
                  onSuccess={(newCategory) => {
                    setLocalCategories((prev) => [...prev, newCategory]);
                    field.onChange(newCategory.name);
                  }}
                />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {localCategories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subCategory"
          render={({ field }) => (
            <FormItem>
              <div className="flex h-9 items-center">
                <FormLabel>Sub Category</FormLabel>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!form.watch('category')}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subCategories.map((s, idx) => (
                    <SelectItem
                      key={s.title || `sub-${idx}`}
                      value={s.title || ''}
                    >
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <div className="flex h-9 items-center">
                <FormLabel>Type</FormLabel>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!form.watch('subCategory')}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <PlateRichEditor value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormDescription>
              <span className="font-bold text-blue-500">Note:</span> This
              content will be displayed in the Description tab on the product
              page.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
