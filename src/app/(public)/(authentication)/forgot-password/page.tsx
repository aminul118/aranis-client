import ForgotPasswordForm from '@/app/(public)/(authentication)/forgot-password/_components/ForgotPasswordForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';

const ForgotPasswordPage = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Forgot Password
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Enter your email or phone number to receive a reset link.
                </p>
              </div>
              <ForgotPasswordForm />
            </div>

            {/* Image Section */}
            <div className="relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Forgot Password Image"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;

// >> SEO Start
export const metadata: Metadata = generateMetaTags({
  title: 'Forgot Password | The Aranis',
  description: 'Reset your password for your Aranis account.',
  keywords: 'forgot password, reset password, The Aranis, account recovery',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/forgot-password',
});
// >> SEO End
