import VerifyOTPForm from '@/app/(public)/(authentication)/verify/_components/VerifyOTPForm';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';

const VerifyOTPPage = () => {
  return (
    <section className="center">
      <VerifyOTPForm />
    </section>
  );
};

export default VerifyOTPPage;

// SEO Metatg
export const metadata: Metadata = generateMetaTags({
  title: 'Verify OTP | Aranis Fashion',
  description:
    'Verify your account with a one-time password (OTP) to securely access your The Aranis profile.',
  keywords:
    'verify otp, one time password, Aranis Fashion, account verification, secure access',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/verify',
});
