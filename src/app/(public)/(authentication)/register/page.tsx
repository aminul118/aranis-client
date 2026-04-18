import RegisterForm from '@/components/modules/Authentication/RegisterForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';

const RegisterPage = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Register Image"
              />
            </div>

            {/* Right side form */}
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Register
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Join The Aranis today and experience premium shopping.
                </p>
              </div>
              <RegisterForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegisterPage;

// SEO Metadata
export const metadata: Metadata = generateMetaTags({
  title: 'Register | Lumiere Fashion',
  description:
    'Create your The Aranis account to enjoy a personalized shopping experience, track your orders, and receive exclusive offers.',
  keywords:
    'register, create account, sign up, Lumiere Fashion, fashion registration, join platform',
  websitePath: '/register',
});
