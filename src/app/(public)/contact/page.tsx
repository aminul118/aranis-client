import Contact from '@/components/modules/Public/contact/Contact';
import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';

const ContactPage = async () => {
  const settingsRes = await getSiteSettings();
  const settings = settingsRes?.data;

  return (
    <>
      <Contact settings={settings} />
    </>
  );
};

export default ContactPage;

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMeta(
    '/contact',
    'Contact Us',
    'Get in touch with The Aranis for any inquiries, project collaborations, or support.',
  );
}
