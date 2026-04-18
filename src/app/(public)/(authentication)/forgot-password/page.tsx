import ForgotPasswordForm from '@/components/modules/Authentication/ForgotPasswordForm';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';

const ForgotPasswordPage = () => {
  return (
    <div className="center">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;

// SEO Metatags
export const metadata: Metadata = generateMetaTags({
  title: 'Forgot Password | Lumiere Fashion',
  description:
    'Recover your The Aranis account password to resume your premium shopping experience.',
  keywords:
    'forgot password, password recovery, Lumiere Fashion, secure account, fashion e-commerce',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/forgot-password',
});
