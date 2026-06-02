import SiteSettingsForm from '@/app/(dashboard)/admin/site/_components/SiteSettingsForm';
import GradientTitle from '@/components/ui/gradientTitle';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SiteSettingsPage = async () => {
  const res = await getSiteSettings();
  const settings = res?.data;

  return (
    <section className="mx-auto w-full space-y-10 px-4 pb-20">
      <GradientTitle
        title="Site Configuration"
        description="Global settings for your e-commerce platform"
        className="text-left"
      />
      {settings && <SiteSettingsForm settings={settings} />}
    </section>
  );
};

export default SiteSettingsPage;

export const metadata: Metadata = {
  title: 'Site Settings | Admin',
};
