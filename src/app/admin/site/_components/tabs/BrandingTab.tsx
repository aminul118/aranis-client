import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import { TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, Info, Layout } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface BrandingTabProps {
  form: UseFormReturn<any>;
}

export const BrandingTab = ({ form }: BrandingTabProps) => {
  return (
    <TabsContent value="branding" className="space-y-8 outline-none">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="group border-border bg-card hover:bg-muted relative rounded-[32px] border p-10 transition-all">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
              <Layout className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-foreground text-xl font-black tracking-tight uppercase italic">
                Identity Logo
              </h4>
              <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                Main website branding asset
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SingleImageUploader
                    defaultValue={field.value}
                    onChange={(file) => field.onChange(file)}
                    recommendation="Recommended: Landscape logo (e.g. 300x100 px, 3:1)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col justify-center space-y-6 rounded-[32px] bg-blue-600/5 p-10 ring-1 ring-blue-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
            <Info className="h-6 w-6" />
          </div>
          <h4 className="text-foreground text-2xl font-black tracking-tighter italic">
            Branding Guidelines
          </h4>
          <ul className="space-y-3">
            {[
              'Use high-resolution PNG or SVG',
              'Ensure logo is clear on dark/light backgrounds',
              'Maintain a minimum height of 40px',
            ].map((text) => (
              <li
                key={text}
                className="text-muted-foreground flex items-start gap-3 text-sm font-medium"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TabsContent>
  );
};
