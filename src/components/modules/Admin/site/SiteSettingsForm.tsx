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
  Search,
  Send,
  Share2,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import RichTextEditor from '@/components/ui/rich-text-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const siteSettingSchema = z.object({
  logo: z.any().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  baseImage: z.any().optional(),
  activeOfferTag: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
  location: z.string().optional(),
  returnPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
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

const DEFAULT_REFUND_POLICY = `<p>We believe in the quality of our products. If you are not completely satisfied with your purchase, we offer a straightforward refund policy.</p>
<ul class="mt-4 space-y-2">
  <li>Refunds must be requested within 30 days of delivery.</li>
  <li>The item must be in its original condition, unworn, unwashed, with all original tags attached.</li>
  <li>Refunds will be processed to the original payment method within 5-7 business days after we receive the returned item.</li>
  <li>Shipping costs are non-refundable unless the item received was damaged or incorrect.</li>
</ul>
<p class="mt-4">Please contact our support team at support@Aranis.com to initiate a refund request.</p>`;

const DEFAULT_RETURN_POLICY = `<p>Our return process is designed to be as seamless as possible for you.</p>
<ul class="mt-4 space-y-2">
  <li>You have 30 days from the date of delivery to return your item.</li>
  <li>To initiate a return, please log in to your account, navigate to "My Orders," and select the item you wish to return.</li>
  <li>You will receive a pre-paid return shipping label via email.</li>
  <li>Please package the item securely and drop it off at any authorized shipping location.</li>
</ul>
<p class="mt-4">Once your return is received and inspected, we will notify you of the approval or rejection of your return. Approved returns will be refunded or exchanged according to your preference.</p>`;

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
      activeOfferTag: settings.activeOfferTag || '',
      contactNumber: settings.contactNumber || '',
      email: settings.email || '',
      location: settings.location || '',
      returnPolicy: settings.returnPolicy || DEFAULT_RETURN_POLICY,
      refundPolicy: settings.refundPolicy || DEFAULT_REFUND_POLICY,
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
    formData.append('title', values.title || '');
    formData.append('description', values.description || '');
    formData.append('keywords', values.keywords || '');
    formData.append('activeOfferTag', values.activeOfferTag || '');
    formData.append('contactNumber', values.contactNumber || '');
    formData.append('email', values.email || '');
    formData.append('location', values.location || '');
    formData.append('returnPolicy', values.returnPolicy || '');
    formData.append('refundPolicy', values.refundPolicy || '');
    formData.append('socialLinks', JSON.stringify(values.socialLinks));

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
              value="seo"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Search className="h-4 w-4" /> SEO
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
            <TabsTrigger
              value="policies"
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Info className="h-4 w-4" /> Policies
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

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-8 outline-none">
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="border-border bg-card space-y-8 rounded-[32px] border p-10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
                      <Search className="h-6 w-6" />
                    </div>
                    <h4 className="text-foreground text-xl font-black tracking-tight uppercase italic">
                      Core Metadata
                    </h4>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                          Site Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-border bg-muted/50 h-12 rounded-xl font-bold focus:border-emerald-500/50"
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
                        <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                          Global Keywords
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-border bg-muted/50 h-12 rounded-xl font-bold focus:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activeOfferTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                          Active Offer Tag (e.g. Eid Offer)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-border bg-muted/50 h-12 rounded-xl font-bold focus:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-border bg-card space-y-8 rounded-[32px] border p-10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-400">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-foreground text-xl font-black tracking-tight uppercase italic">
                      Social Visibility
                    </h4>
                  </div>

                  <FormField
                    control={form.control}
                    name="baseImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black tracking-[0.2em] text-purple-500 uppercase">
                          OG Share Image
                        </FormLabel>
                        <FormControl>
                          <SingleImageUploader
                            defaultValue={field.value}
                            onChange={(file) => field.onChange(file)}
                            recommendation="Recommended: Landscape (e.g. 1200x630 px, 1.91:1)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-border bg-card rounded-[32px] border p-10">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                        Global Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          className="border-border bg-muted/50 rounded-2xl font-medium focus:border-emerald-500/50"
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

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-8 outline-none">
            <div className="border-border bg-card space-y-8 rounded-[32px] border p-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-red-500/10 p-4 text-red-400">
                  <Info className="h-6 w-6" />
                </div>
                <h4 className="text-foreground text-xl font-black tracking-tight uppercase italic">
                  Refund & Return Policies
                </h4>
              </div>

              <FormField
                control={form.control}
                name="refundPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">
                      Refund Policy
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={(val) => field.onChange(val)}
                        placeholder="Write dynamic refund policy..."
                        className="border-border bg-muted/50 rounded-2xl border p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">
                      Return Policy
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={(val) => field.onChange(val)}
                        placeholder="Write dynamic return policy..."
                        className="border-border bg-muted/50 rounded-2xl border p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
