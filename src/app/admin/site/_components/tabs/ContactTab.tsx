import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Mail, MapPin, Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface ContactTabProps {
  form: UseFormReturn<any>;
}

export const ContactTab = ({ form }: ContactTabProps) => {
  return (
    <TabsContent value="contact" className="space-y-8 outline-none">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Phone Card */}
        <div className="border-border bg-card hover:bg-muted space-y-6 rounded-[32px] border p-8 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <Phone className="h-6 w-6" />
          </div>
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-500">Public Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+880 1XXX-XXXXXX"
                    className="border-border bg-muted/50 h-12 focus:border-amber-500/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email Card */}
        <div className="border-border bg-card hover:bg-muted space-y-6 rounded-[32px] border p-8 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Mail className="h-6 w-6" />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-500">Official Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hello@aranis.com"
                    className="border-border bg-muted/50 h-12 focus:border-blue-500/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Card */}
        <div className="border-border bg-card hover:bg-muted space-y-6 rounded-[32px] border p-8 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <MapPin className="h-6 w-6" />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-500">
                  Store Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Dhaka, Bangladesh"
                    className="border-border bg-muted/50 h-12 focus:border-emerald-500/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </TabsContent>
  );
};
