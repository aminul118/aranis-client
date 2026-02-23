import Logo from '@/assets/Logo';
import LoginForm from '@/components/modules/Authentication/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/config/images';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <section className="center">
      <div className="flex w-full max-w-sm items-center justify-center rounded-lg shadow-lg md:max-w-4xl">
        <Card className="w-full max-w-5xl overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6">
              <div className="mb-6 grid place-items-center">
                <Link href={'/'}>
                  <Logo />
                </Link>
                <p className="text-muted-foreground mt-4 text-center">
                  Login to your portfolio portal
                </p>
              </div>
              {/* Form Section */}
              <LoginForm />
            </div>

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
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginPage;

// >> SEO Start
export const metadata: Metadata = generateMetaTags({
  title: 'Login | Md Aminul Islam',
  description:
    'Login to the Md Aminul Islam portfolio admin dashboard to manage projects, blogs, and other content.',
  keywords:
    'login, sign in, Aminul Islam, portfolio admin, project management, blog management, secure access',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/login',
});
// >> SEO End
