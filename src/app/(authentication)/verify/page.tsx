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
  title: 'Verify OTP | Md Aminul Islam',
  description:
    'Verify your one-time password (OTP) to securely access the Md Aminul Islam portfolio admin panel.',
  keywords:
    'verify otp, one time password, Aminul Islam, account verification, secure login, authentication, portfolio admin',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/verify-otp',
});
