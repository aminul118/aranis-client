import ResetPasswordForm from '@/app/(public)/(authentication)/reset-password/_components/ResetPasswordForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';

const ResetPasswordPage = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Reset Password
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Create a new password for your account.
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="border-primary mx-auto mt-20 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
                }
              >
                <ResetPasswordForm />
              </Suspense>
            </div>

            {/* Image Section */}
            <div className="relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Reset Password"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResetPasswordPage;

// >> SEO Start
export const metadata: Metadata = generateMetaTags({
  title: 'Reset Password | The Aranis',
  description: 'Reset your password for your Aranis account.',
  keywords: 'reset password, The Aranis, account recovery',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/reset-password',
});
// >> SEO End
