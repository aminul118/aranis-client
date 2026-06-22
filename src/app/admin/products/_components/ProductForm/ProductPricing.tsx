import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IProductUpload } from '@/services/product/product.interface';
import { useFormContext } from 'react-hook-form';

export default function ProductPricing() {
  const form = useFormContext<IProductUpload>();

  const watchedSizeStock = form.watch('sizeStock');
  const watchedVariants = form.watch('variants');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-6">
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main SKU</FormLabel>
            <FormControl>
              <Input placeholder="e.g. SKU-12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="buyPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Buy Price (৳) <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Sale Price (৳) <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="discountPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 20"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const percentage = Number(e.target.value);
                  const price = Number(form.getValues('price'));
                  if (price > 0) {
                    if (percentage > 0 && percentage < 100) {
                      const salePrice = Math.round(
                        price - (price * percentage) / 100,
                      );
                      form.setValue('salePrice', salePrice);
                    } else if (percentage === 0) {
                      form.setValue('salePrice', 0);
                    }
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="salePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discounted Price (৳)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const salePrice = Number(e.target.value);
                  const price = Number(form.getValues('price'));
                  if (price > 0) {
                    if (salePrice > 0 && salePrice < price) {
                      const discountPercentage = Math.round(
                        ((price - salePrice) / price) * 100,
                      );
                      form.setValue('discountPercentage', discountPercentage);
                    } else if (salePrice === 0) {
                      form.setValue('discountPercentage', 0);
                    }
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {(() => {
        let autoStock = 0;
        if (watchedSizeStock && watchedSizeStock.length > 0) {
          watchedSizeStock.forEach((s) => (autoStock += Number(s.stock) || 0));
        }
        if (watchedVariants && watchedVariants.length > 0) {
          watchedVariants.forEach((v) => {
            if (v.sizes && v.sizes.length > 0) {
              v.sizes.forEach((s) => (autoStock += Number(s.stock) || 0));
            }
          });
        }

        return (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Total Stock <span className="text-red-500">*</span>
            </span>
            <div className="border-input bg-muted text-muted-foreground flex h-10 w-full cursor-not-allowed items-center rounded-md border px-3 py-2 text-sm opacity-80">
              {autoStock} pcs
            </div>
          </div>
        );
      })()}
      {/* Stock is entirely auto-calculated and hidden from UI as per request */}
    </div>
  );
}
