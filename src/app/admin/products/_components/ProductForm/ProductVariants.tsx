import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultiImageUploader from '@/components/ui/multi-image-uploader';
import { cn } from '@/lib/utils';
import type { IColor } from '@/services/color/color.interface';
import { IProductUpload } from '@/services/product/product.interface';
import type { ISize } from '@/services/size/size.interface';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import QuickAddColor from '../../../colors/_componnets/QuickAddColor';

interface Props {
  localColors: IColor[];
  setLocalColors: React.Dispatch<React.SetStateAction<IColor[]>>;
  sizes: ISize[];
}

export default function ProductVariants({
  localColors,
  setLocalColors,
  sizes,
}: Props) {
  const form = useFormContext<IProductUpload>();
  const watchedColor = form.watch('color');
  const watchedSizes = form.watch('sizes') || [];

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  return (
    <>
      {/* Main Product Layout: Color & Sizes (Left) | Gallery (Right) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Side: Color & Sizes */}
        <div className="space-y-6 md:col-span-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-9 items-center justify-between">
                  <FormLabel className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                    Product Color <span className="text-red-500">*</span>
                  </FormLabel>
                </div>
                <div className="border-border/50 bg-muted/10 flex flex-wrap gap-3 rounded-xl border p-4">
                  {localColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => field.onChange(color.name)}
                      className={cn(
                        'group relative flex flex-col items-center gap-2 transition-all',
                        field.value === color.name
                          ? 'scale-110'
                          : 'opacity-60 hover:opacity-100',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                          field.value === color.name
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-transparent',
                        )}
                        style={{ backgroundColor: color.hex }}
                      >
                        {field.value === color.name && (
                          <Check
                            className={cn(
                              'h-5 w-5',
                              ['White', 'Beige', 'Silk White', 'Gold'].includes(
                                color.name,
                              )
                                ? 'text-black'
                                : 'text-white',
                            )}
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold tracking-tighter uppercase">
                        {color.name}
                      </span>
                    </button>
                  ))}
                  <QuickAddColor
                    customTrigger={
                      <button
                        type="button"
                        className="group relative flex flex-col items-center gap-2 opacity-60 transition-all hover:opacity-100"
                      >
                        <div className="border-muted-foreground/50 group-hover:border-foreground/50 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed bg-transparent transition-all">
                          <Plus className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-bold tracking-tighter uppercase">
                          New
                        </span>
                      </button>
                    }
                    onSuccess={(newColor) => {
                      setLocalColors((prev) => [...prev, newColor]);
                      form.setValue('color', newColor.name);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-9 items-center">
                  <FormLabel className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                    Available Sizes <span className="text-red-500">*</span>
                  </FormLabel>
                </div>
                <div className="border-border/50 bg-muted/10 flex flex-wrap items-center gap-2 rounded-xl border p-4">
                  {sizes.map((size) => (
                    <button
                      key={size._id}
                      type="button"
                      onClick={() => {
                        const current = field.value || [];
                        const updated = current.includes(size.name)
                          ? current.filter((s: string) => s !== size.name)
                          : [...current, size.name];
                        field.onChange(updated);
                      }}
                      className={cn(
                        'flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-lg border px-4 text-xs font-black transition-all',
                        field.value?.includes(size.name)
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : 'border-border/50 bg-background text-muted-foreground hover:border-foreground/30',
                      )}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right Side: Gallery Images */}
        <div className="md:col-span-8">
          <FormField
            control={form.control}
            name="thumbnails"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUploader
                    label="Main Gallery Images"
                    value={field.value}
                    max={6}
                    required={true}
                    onChange={(files) => field.onChange(files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      {/* Main Product Size-wise Stock */}
      {watchedSizes.length > 0 && (
        <div className="bg-muted/10 space-y-4 rounded-2xl border border-white/10 p-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black tracking-tight uppercase">
              Main Color ({watchedColor || 'None'}) Size Stock
            </h3>
            <p className="text-muted-foreground text-[10px] font-medium">
              Set stock levels for each size of the main product color.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {watchedSizes.map((sizeName) => {
              const mainSizeStock = form.watch('sizeStock') || [];
              const entryIdx = mainSizeStock.findIndex(
                (s) => s.size === sizeName,
              );
              if (entryIdx === -1) return null;

              return (
                <div key={sizeName} className="space-y-2">
                  <FormLabel className="text-[10px] font-bold text-slate-500 uppercase">
                    {sizeName}
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name={`sizeStock.${entryIdx}.stock`}
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="rounded-xl border-2 font-bold"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Variants */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight uppercase">
              Product Color Variants
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              Add color variants with their own dedicated image galleries
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              appendVariant({
                color: '',
                sizes: watchedSizes.map((s) => ({ size: s, stock: 0 })),
                thumbnails: [],
                sku: '',
              })
            }
            className="rounded-xl bg-blue-600 font-black text-white shadow-md transition-all hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Variant
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {variantFields.map((field, index) => (
            <div
              key={field.id}
              className="border-border/50 bg-background group relative rounded-2xl border-2 p-6 shadow-sm transition-all hover:border-blue-500/30"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeVariant(index)}
                className="text-muted-foreground absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                {/* Variant Color Section */}
                <div className="space-y-4 md:col-span-4">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                          Variant Color <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex flex-wrap gap-3">
                          {localColors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => field.onChange(color.name)}
                              title={color.name}
                              className={cn(
                                'group relative flex flex-col items-center justify-center gap-2 transition-all',
                                field.value === color.name
                                  ? 'scale-110'
                                  : 'opacity-60 hover:scale-105 hover:opacity-100',
                              )}
                            >
                              <div
                                className={cn(
                                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                                  field.value === color.name
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                    : 'border-transparent',
                                )}
                                style={{ backgroundColor: color.hex }}
                              >
                                {field.value === color.name && (
                                  <Check
                                    className={cn(
                                      'h-5 w-5',
                                      [
                                        'White',
                                        'Beige',
                                        'Silk White',
                                        'Gold',
                                      ].includes(color.name)
                                        ? 'text-black'
                                        : 'text-white',
                                    )}
                                  />
                                )}
                              </div>
                              <span className="text-[10px] font-bold tracking-tighter uppercase">
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-2 text-center text-[10px] font-black uppercase">
                          {field.value || 'Select a color'}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Variant Sizes Selector */}
                  <div className="space-y-4">
                    <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      Variant Sizes <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="border-border/50 bg-muted/10 flex flex-wrap items-center gap-2 rounded-xl border p-4">
                      {sizes.map((size) => {
                        const variantSizes =
                          form.watch(`variants.${index}.sizes`) || [];
                        const isSelected = variantSizes.some(
                          (s: { size: string }) => s.size === size.name,
                        );

                        return (
                          <button
                            key={size._id}
                            type="button"
                            onClick={() => {
                              const current = [...variantSizes];
                              const existingIdx = current.findIndex(
                                (s: { size: string }) => s.size === size.name,
                              );
                              if (existingIdx >= 0) {
                                current.splice(existingIdx, 1);
                              } else {
                                current.push({ size: size.name, stock: 0 });
                              }
                              form.setValue(
                                `variants.${index}.sizes`,
                                current,
                                {
                                  shouldValidate: true,
                                },
                              );
                            }}
                            className={cn(
                              'flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-lg border px-4 text-xs font-black transition-all',
                              isSelected
                                ? 'bg-foreground text-background border-foreground shadow-md'
                                : 'border-border/50 bg-background text-muted-foreground hover:border-foreground/30',
                            )}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      Size-wise Stock
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {(form.watch(`variants.${index}.sizes`) || []).map(
                        (sizeObj: { size: string }, sizeEntryIdx: number) => {
                          const sizeName = sizeObj.size;

                          return (
                            <div key={sizeName} className="space-y-1">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold text-slate-500">
                                  {sizeName}
                                </span>
                              </div>
                              <FormField
                                control={form.control}
                                name={`variants.${index}.sizes.${sizeEntryIdx}.stock`}
                                render={({ field }) => (
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="h-8 rounded-lg border-2 text-xs"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                )}
                              />
                            </div>
                          );
                        },
                      )}
                    </div>
                    {(form.watch(`variants.${index}.sizes`) || []).length ===
                      0 && (
                      <p className="text-muted-foreground text-[10px] italic">
                        Please select sizes above first.
                      </p>
                    )}
                  </div>
                </div>

                {/* Variant Gallery Section */}
                <div className="md:col-span-8">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.thumbnails`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiImageUploader
                            label="Variant Gallery Images"
                            value={field.value}
                            max={6}
                            onChange={(files) => field.onChange(files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.sku`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                          Variant SKU
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Variant SKU"
                            className="rounded-xl border-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {variantFields.length === 0 && (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed p-12 text-center">
            <div className="bg-background text-muted-foreground flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm">
              <Plus size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">No variants added yet</p>
              <p className="text-muted-foreground text-xs">
                Click "Add Variant" to start adding color options
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
