import RegisterForm from '@/components/modules/Authentication/RegisterForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';

const RegisterPage = () => {
  return (
    <section className="center">
      <div
        className="flex flex-col gap-6 rounded-lg shadow-lg"
        data-aos="fade-left"
      >
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Image Section */}
            <div className="bg-muted relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Login Image"
              />
            </div>

            {/* Right side form */}
            <div className="p-8">
              <div className="flex flex-col items-center gap-6 text-center">
                <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
                  Register
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Join Lumiere Fashion today and experience premium shopping.
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
    'Create your Lumiere Fashion account to enjoy a personalized shopping experience, track your orders, and receive exclusive offers.',
  keywords:
    'register, create account, sign up, Lumiere Fashion, fashion registration, join platform',
  websitePath: '/register',
});
