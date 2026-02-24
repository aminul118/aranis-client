import VerifyOTPForm from '@/components/modules/Authentication/VerifyOTPForm';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import { Suspense } from 'react';

const VerifyOTPPage = () => {
  return (
    <section className="center">
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyOTPForm />
      </Suspense>
    </section>
  );
};

export default VerifyOTPPage;

// SEO Metatg
export const metadata: Metadata = generateMetaTags({
  title: 'Verify OTP | Lumiere Fashion',
  description:
    'Verify your account with a one-time password (OTP) to securely access your Lumiere Fashion profile.',
  keywords:
    'verify otp, one time password, Lumiere Fashion, account verification, secure access',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/verify',
});
