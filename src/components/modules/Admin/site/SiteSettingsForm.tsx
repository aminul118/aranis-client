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
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Save,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const siteSettingSchema = z.object({
  logo: z.any().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  baseImage: z.any().optional(),
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
  Facebook: Facebook,
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
      title: settings.title || '',
      description: settings.description || '',
      keywords: settings.keywords || '',
      baseImage: settings.baseImage || '',
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
    const formData = new FormData();

    if (values.logo instanceof File) {
      formData.append('logo', values.logo);
    } else if (typeof values.logo === 'string') {
      formData.append('logo', values.logo);
    }

    if (values.baseImage instanceof File) {
      formData.append('baseImage', values.baseImage);
    } else if (typeof values.baseImage === 'string') {
      formData.append('baseImage', values.baseImage);
    }

    formData.append('title', values.title || '');
    formData.append('description', values.description || '');
    formData.append('keywords', values.keywords || '');
    formData.append('socialLinks', JSON.stringify(values.socialLinks));

    await executePost({
      action: () => updateSiteSettings(formData),
      success: {
        loadingText: 'Updating site settings...',
        message: 'Site settings updated successfully',
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Logo Section */}
        <div className="space-y-4 rounded-3xl border-none bg-[#151722] p-8 shadow-2xl transition-all hover:scale-[1.01]">
          <h3 className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            Branding
          </h3>
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Logo</FormLabel>
                <FormControl>
                  <SingleImageUploader
                    defaultValue={field.value}
                    onChange={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SEO Configuration Section */}
        <div className="space-y-4 rounded-3xl border-none bg-[#151722] p-8 shadow-2xl transition-all hover:scale-[1.01]">
          <h3 className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <Globe className="h-5 w-5 text-emerald-400" />
            </div>
            SEO Configuration
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                    Site Title (SEO)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. The Aranis | Premium Contemporary Clothing"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                    SEO Keywords
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Fashion, Luxury, Apparel"
                      {...field}
                    />
                  </FormControl>
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
                <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  SEO Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta description for search engines..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Social Share Image (OG Image)
                </FormLabel>
                <FormControl>
                  <SingleImageUploader
                    defaultValue={field.value}
                    onChange={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Social Links Section */}
        <div className="space-y-4 rounded-3xl border-none p-8 shadow-2xl transition-all hover:scale-[1.01]">
          <h3 className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
            <div className="rounded-xl bg-purple-500/10 p-2.5">
              <Globe className="h-5 w-5 text-purple-400" />
            </div>
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {form.getValues('socialLinks').map((link, index) => {
              const Icon = platformIcons[link.platform] || Globe;
              return (
                <div
                  key={link.platform}
                  className="space-y-4 rounded-2xl p-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm font-black tracking-wider uppercase">
                      <Icon className="h-4 w-4" /> {link.platform}
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
                              className="scale-75"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text="Save Changes"
            loadingEffect
            icon={<Save className="h-4 w-4" />}
          />
        </div>
      </form>
    </Form>
  );
};

export default SiteSettingsForm;
