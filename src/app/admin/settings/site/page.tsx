import SiteSettingsForm from '@/components/modules/Admin/settings/site/SiteSettingsForm';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SiteSettingsPage = async () => {
  const res = await getSiteSettings();
  const settings = res?.data;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl">
        {settings && <SiteSettingsForm settings={settings} />}
      </div>
    </div>
  );
};

export default SiteSettingsPage;

export const metadata: Metadata = {
  title: 'Site Settings | Admin',
};
