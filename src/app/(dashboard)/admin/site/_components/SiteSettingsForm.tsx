'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import { Switch } from '@/components/ui/switch';
import useActionHandler from '@/hooks/useActionHandler';
import { ISiteSetting, updateSiteSettings } from '@/services/settings/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Facebook,
  Globe,
  Info,
  Instagram,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Send,
  Share2,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const siteSettingSchema = z.object({
  logo: z.any().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
  location: z.string().optional(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url('Invalid URL').or(z.literal('')),
      isActive: z.boolean(),
    }),
  ),
});

type FormValues = z.infer<typeof siteSettingSchema>;

interface Props {
  settings: ISiteSetting;
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

const SiteSettingsForm = ({ settings }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();

  const form = useForm<FormValues>({
    resolver: zodResolver(siteSettingSchema) as any,
    defaultValues: {
      logo: settings.logo || '',
      contactNumber: settings.contactNumber || '',
      email: settings.email || '',
      location: settings.location || '',
      socialLinks: settings.socialLinks || [
        { platform: 'Facebook', url: '', isActive: true },
        { platform: 'WhatsApp', url: '', isActive: true },
        { platform: 'Telegram', url: '', isActive: true },
        { platform: 'LinkedIn', url: '', isActive: true },
        { platform: 'X', url: '', isActive: true },
        { platform: 'YouTube', url: '', isActive: true },
        { platform: 'Instagram', url: '', isActive: true },
        { platform: 'GitHub', url: '', isActive: true },
      ],
    },
  });

  const onSubmit = async (values: FormValues) => {
    // eslint-disable-next-line no-console
    console.log('SITE SETTINGS FORM SUBMIT VALUES:', values);
    const formData = new FormData();

    // Text fields should be appended before files for reliable multer parsing
    formData.append('contactNumber', values.contactNumber || '');
    formData.append('email', values.email || '');
    formData.append('location', values.location || '');
    formData.append('socialLinks', JSON.stringify(values.socialLinks));

    if (values.logo instanceof File) {
      formData.append('logo', values.logo);
    } else if (typeof values.logo === 'string') {
      formData.append('logo', values.logo);
    }

    await executePost({
      action: () => updateSiteSettings(formData),
      success: {
        loadingText: 'Synchronizing site configuration...',
        message: 'Site settings have been optimized and saved',
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="bg-muted/50 mb-12 flex h-auto w-fit gap-2 rounded-2xl p-1.5 backdrop-blur-md">
            <TabsTrigger
              value="branding"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Layout className="h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              <Phone className="h-4 w-4" /> Contact
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Share2 className="h-4 w-4" /> Social
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
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

          {/* Contact Tab */}
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
                      <FormLabel className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase">
                        Public Contact
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+880 1XXX-XXXXXX"
                          className="border-border bg-muted/50 h-12 font-bold focus:border-amber-500/50"
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
                      <FormLabel className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">
                        Official Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@aranis.com"
                          className="border-border bg-muted/50 h-12 font-bold focus:border-blue-500/50"
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
                      <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                        Store Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dhaka, Bangladesh"
                          className="border-border bg-muted/50 h-12 font-bold focus:border-emerald-500/50"
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

          {/* Social Tab */}
          <TabsContent value="social" className="outline-none">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {form.getValues('socialLinks').map((link, index) => {
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
                        <span className="text-muted-foreground group-hover:text-foreground text-sm font-black tracking-widest uppercase transition-colors">
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
                                  className="border-border bg-background text-foreground placeholder:text-muted-foreground h-12 pl-4 font-bold focus:border-purple-500/50 focus:ring-purple-500/10"
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
        </Tabs>

        {/* Global Action Bar */}
        <div className="border-border mt-12 flex items-center justify-between border-t pt-12">
          <div className="bg-muted/50 flex items-center gap-4 rounded-2xl px-6 py-3">
            <div className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Live synchronization active
            </p>
          </div>
          <SubmitButton
            loading={form.formState.isSubmitting}
            text="Sync Changes"
            loadingEffect
            icon={<Save className="h-5 w-5" />}
            className="h-14 rounded-2xl bg-blue-600 px-12 text-sm font-black tracking-[0.2em] uppercase italic transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/20 active:scale-95"
          />
        </div>
      </form>
    </Form>
  );
};

export default SiteSettingsForm;
