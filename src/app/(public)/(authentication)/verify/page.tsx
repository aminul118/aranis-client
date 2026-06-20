import VerifyOTPForm from '@/app/(public)/(authentication)/verify/_components/VerifyOTPForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const VerifyOTPPage = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col justify-center p-8">
              <VerifyOTPForm />
            </div>

            {/* Image Section */}
            <div className="relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Verify Image"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
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
