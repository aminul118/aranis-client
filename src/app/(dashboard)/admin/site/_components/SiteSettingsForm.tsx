'use client';

import SubmitButton from '@/components/common/button/submit-button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useActionHandler from '@/hooks/useActionHandler';
import { ISiteSetting, updateSiteSettings } from '@/services/settings/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Facebook,
  Globe,
  Instagram,
  Layout,
  Linkedin,
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
import { logger } from '../../../../../lib/logger';
import { BrandingTab } from './tabs/BrandingTab';
import { ContactTab } from './tabs/ContactTab';
import { SocialTab } from './tabs/SocialTab';

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
    logger.info('SITE SETTINGS FORM SUBMIT VALUES:', values);
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
          <TabsList className="mb-12 flex h-12 w-full max-w-md overflow-hidden rounded-full bg-[#334155]/60 p-0 shadow-inner dark:bg-slate-800/80">
            <TabsTrigger
              value="branding"
              className="flex h-full flex-1 items-center justify-center gap-2 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Layout className="h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex h-full flex-1 items-center justify-center gap-2 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Phone className="h-4 w-4" /> Contact
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="flex h-full flex-1 items-center justify-center gap-2 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Share2 className="h-4 w-4" /> Social
            </TabsTrigger>
          </TabsList>

          <BrandingTab form={form} />
          <ContactTab form={form} />
          <SocialTab form={form} />
        </Tabs>

        {/* Global Action Bar */}
        <div className="flex items-center justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text="Sync Changes"
            loadingEffect
            icon={<Save className="h-5 w-5" />}
            className="h-12 rounded-xl bg-blue-600 px-8 text-sm transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          />
        </div>
      </form>
    </Form>
  );
};

export default SiteSettingsForm;
