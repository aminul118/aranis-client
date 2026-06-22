import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { IOffer } from '@/services/offer/offer.interface';
import { IProductUpload } from '@/services/product/product.interface';
import type { ISizeGuide } from '@/services/size-guide/size-guide.interface';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import QuickAddOffer from './QuickAddOffer';

interface Props {
  sizeGuides: ISizeGuide[];
  localOffers: IOffer[];
  setLocalOffers: React.Dispatch<React.SetStateAction<IOffer[]>>;
  setSelectedSizeGuideImage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setIsSizeGuidePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductSettings({
  sizeGuides,
  localOffers,
  setLocalOffers,
  setSelectedSizeGuideImage,
  setIsSizeGuidePreviewOpen,
}: Props) {
  const form = useFormContext<IProductUpload>();
  const watchedIsOffer = form.watch('isOffer');

  const [showCustomRefund, setShowCustomRefund] = useState(
    !!form.getValues('refundPolicy'),
  );
  const [showCustomReturn, setShowCustomReturn] = useState(
    !!form.getValues('returnPolicy'),
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-muted/5 space-y-4 rounded-xl border border-white/10 p-4">
          <FormField
            control={form.control}
            name="isOffer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-black tracking-widest text-blue-500 uppercase">
                    Special Offer
                  </FormLabel>
                  <FormDescription>
                    Enable this to show this product in the Offer section.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {watchedIsOffer && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="offerTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Tag</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {localOffers.map((o) => (
                            <SelectItem key={o._id} value={o.tag}>
                              {o.name} ({o.tag})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <QuickAddOffer
                        onSuccess={(newOffer) => {
                          setLocalOffers((prev) => [...prev, newOffer]);
                          form.setValue('offerTag', newOffer.tag);
                          if (!form.watch('discountPercentage')) {
                            form.setValue(
                              'discountPercentage',
                              newOffer.discountPercentage,
                            );
                            const price = Number(form.getValues('price'));
                            if (price > 0 && newOffer.discountPercentage > 0) {
                              form.setValue(
                                'salePrice',
                                Math.round(
                                  price -
                                    (price * newOffer.discountPercentage) / 100,
                                ),
                              );
                            }
                          }
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="sizeGuide"
          render={({ field }) => {
            const selectedSg = sizeGuides.find((sg) => sg._id === field.value);
            return (
              <FormItem>
                <FormLabel>Size Guide</FormLabel>
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Size Guide" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {sizeGuides.map((sg) => (
                          <SelectItem key={sg._id} value={sg._id}>
                            {sg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a size guide to display inline on the product
                      details page. <br />
                      <span className="font-bold text-blue-500">Tip:</span> For
                      the best visual appearance, ensure the uploaded size guide
                      image has a clean white or transparent background and
                      clear typography.
                    </FormDescription>
                  </div>

                  {selectedSg?.image && (
                    <div
                      className="bg-muted border-border/50 group relative h-20 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105"
                      onClick={() => {
                        setSelectedSizeGuideImage(selectedSg.image);
                        setIsSizeGuidePreviewOpen(true);
                      }}
                    >
                      <Image
                        src={selectedSg.image}
                        alt="Size Guide Preview"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-white/10 p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-black tracking-widest text-emerald-500 uppercase">
                  Active Status
                </FormLabel>
                <FormDescription>
                  Enable to show this product on the public store.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-white/10 p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  This product will be highlighted on the home page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="bg-muted/5 space-y-6 rounded-xl border border-white/10 p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight uppercase">
            Policies (Optional)
          </h3>
          <p className="text-muted-foreground text-xs font-medium">
            Override the global refund and return policies for this specific
            product.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={showCustomRefund}
                  onCheckedChange={(checked) => {
                    setShowCustomRefund(!!checked);
                    if (!checked) form.setValue('refundPolicy', '');
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable Custom Refund Policy</FormLabel>
                <FormDescription>
                  Checking this will allow you to write a refund policy specific
                  to this product.
                </FormDescription>
              </div>
            </div>

            {showCustomRefund && (
              <FormField
                control={form.control}
                name="refundPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-input bg-card min-h-[200px] rounded-xl border">
                        <PlateRichEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={showCustomReturn}
                  onCheckedChange={(checked) => {
                    setShowCustomReturn(!!checked);
                    if (!checked) form.setValue('returnPolicy', '');
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable Custom Return Policy</FormLabel>
                <FormDescription>
                  Checking this will allow you to write a return policy specific
                  to this product.
                </FormDescription>
              </div>
            </div>

            {showCustomReturn && (
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-input bg-card min-h-[200px] rounded-xl border">
                        <PlateRichEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted/5 space-y-4 rounded-xl border border-white/10 p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight uppercase">
            SEO Configuration
          </h3>
          <p className="text-muted-foreground text-xs font-medium">
            Define custom metadata for Search Engine Optimization.
          </p>
        </div>

        <FormField
          control={form.control}
          name="seo.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Meta Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Premium Silk Pakistani Suit | Aranis"
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex justify-between">
                <span>Ideal length: 50-60 characters.</span>
                <span
                  className={cn(
                    (field.value?.length || 0) > 60
                      ? 'font-bold text-red-500'
                      : 'text-muted-foreground',
                  )}
                >
                  {field.value?.length || 0} / 60
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seo.keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Meta Keywords <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. silk suit, pakistani dress, luxury fashion"
                  {...field}
                />
              </FormControl>
              <FormDescription>Comma-separated keywords.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seo.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Meta Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="h-36"
                  placeholder="A brief description of this product for search engines..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex justify-between">
                <span>Ideal length: 150-160 characters.</span>
                <span
                  className={cn(
                    (field.value?.length || 0) > 160
                      ? 'font-bold text-red-500'
                      : 'text-muted-foreground',
                  )}
                >
                  {field.value?.length || 0} / 160
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
