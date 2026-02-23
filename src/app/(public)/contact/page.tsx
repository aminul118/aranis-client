import Contact from '@/components/modules/Public/contact/Contact';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';

const ContactPage = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default ContactPage;

//  SEO Metatag
export const metadata: Metadata = generateMetaTags({
  title: 'Contact Me | Hire Full Stack Developer Md. Aminul Islam',
  description:
    'Get in touch with Md. Aminul Islam for web development projects, collaborations, or inquiries. Available for freelance and full-time opportunities in MERN stack and Next.js.',
  keywords:
    'Contact Aminul Islam, Hire Full Stack Developer, Web Developer for Hire, Freelance React Developer, Next.js Expert, Contact Web Developer, Software Engineer Contact, Dhaka, Bangladesh',
  websitePath: '/contact',
});
