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
  title: 'Forgot Password | Md Aminul Islam',
  description:
    'Recover your account password for the Md Aminul Islam portfolio admin dashboard.',
  keywords:
    'forgot password, password recovery, Aminul Islam, portfolio admin, secure login',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/forgot-password',
});
