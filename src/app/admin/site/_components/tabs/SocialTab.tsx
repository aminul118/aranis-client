import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
  Share2,
  Twitter,
  Youtube,
} from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface SocialTabProps {
  form: UseFormReturn<any>;
}

const platformIcons: Record<string, any> = {
  Facebook,
  WhatsApp: MessageCircle,
  Telegram: Send,
  LinkedIn: Linkedin,
  X: Twitter,
  YouTube: Youtube,
  Instagram: Instagram,
  GitHub: Globe,
};

export const SocialTab = ({ form }: SocialTabProps) => {
  return (
    <TabsContent value="social" className="outline-none">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {form.getValues('socialLinks').map((link: any, index: number) => {
          const Icon = platformIcons[link.platform] || Globe;
          return (
            <div
              key={link.platform}
              className="group border-border bg-card/80 hover:bg-muted relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-8 transition-all hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-muted/50 text-muted-foreground flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:bg-purple-600/10 group-hover:text-purple-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground text-sm font-semibold transition-colors">
                    {link.platform}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.isActive`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8">
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder={`https://${link.platform.toLowerCase()}.com/thearanis`}
                            className="border-border bg-background text-foreground placeholder:text-muted-foreground h-12 pl-4 focus:border-purple-500/50 focus:ring-purple-500/10"
                            {...field}
                          />
                          <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                            <Share2 className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </TabsContent>
  );
};
