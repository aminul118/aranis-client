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
  title: 'Reset Password | Lumiere Fashion',
  description:
    'Set a new password for your Lumiere Fashion account to keep your data and preferences secure.',
  keywords:
    'reset password, password recovery, Lumiere Fashion, secure account, fashion updates',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/reset-password',
});
// >> SEO End
