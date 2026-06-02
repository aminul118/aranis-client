import SiteSettingsForm from '@/app/(dashboard)/admin/site/_components/SiteSettingsForm';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SiteSettingsPage = async () => {
  const res = await getSiteSettings();
  const settings = res?.data;

  return (
    <div className="mx-auto w-11/12 space-y-12 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Site <span className="text-blue-600">Settings</span>
        </h1>
        <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
          Manage your website branding, SEO, and social presence
        </p>
      </div>

      <div className="shadow-3xl relative overflow-hidden rounded-[40px] border border-white/5 bg-[#0a0b10] p-10 backdrop-blur-3xl">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/5 blur-[120px]" />

        <div className="relative z-10">
          {settings && <SiteSettingsForm settings={settings} />}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsPage;

export const metadata: Metadata = {
  title: 'Site Settings | Admin',
};
