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
      formData.append('file', values.logo);
    } else if (typeof values.logo === 'string') {
      formData.append('logo', values.logo);
    }

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
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-white">
            <Globe className="h-5 w-5 text-blue-400" /> Branding
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

        {/* Social Links Section */}
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-white">
            <Globe className="h-5 w-5 text-purple-400" /> Social Media Links
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {form.getValues('socialLinks').map((link, index) => {
              const Icon = platformIcons[link.platform] || Globe;
              return (
                <div
                  key={link.platform}
                  className="space-y-3 rounded-lg border border-white/5 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
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
                            className="bg-slate-900/50"
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
