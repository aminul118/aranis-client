import ResetPassword from '@/components/modules/Authentication/ResetPassword';
import generateMetaTags from '@/seo/generateMetaTags';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const ResetPasswordPage = async ({ searchParams }: SearchParams) => {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="center">
      <ResetPassword props={resolvedSearchParams} />
    </div>
  );
};

export default ResetPasswordPage;

// >> SEO Start
export const metadata: Metadata = generateMetaTags({
  title: 'Reset Password | Md Aminul Islam',
  description:
    'Reset your password for the Md Aminul Islam portfolio admin dashboard to regain access to content management tools.',
  keywords:
    'reset password, password recovery, Aminul Islam, portfolio admin, secure login, content management',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/reset-password',
});
// >> SEO End
