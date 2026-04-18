import LoginForm from '@/components/modules/Authentication/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <section className="center">
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Login
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Welcome back to Lumiere Fashion. Please enter your details.
                </p>
              </div>
              <LoginForm />
            </div>

            {/* Image Section */}
            <div className="relative hidden md:block">
              <Image
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
                src={images.auth}
                height={400}
                width={400}
                alt="Login Image"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginPage;

// >> SEO Start
export const metadata: Metadata = generateMetaTags({
  title: 'Login | Lumiere Fashion',
  description:
    'Securely log in to your The Aranis account to manage your orders, wishlist, and profile.',
  keywords:
    'login, sign in, Lumiere Fashion, e-commerce login, secure access, fashion portal',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/login',
});
// >> SEO End
