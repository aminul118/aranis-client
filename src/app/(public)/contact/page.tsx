import Contact from '@/components/modules/Public/contact/Contact';
import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { Metadata } from 'next';

const ContactPage = () => {
  return (
    <>
      <Contact />
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
