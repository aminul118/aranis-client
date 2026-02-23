import Profile from '@/components/modules/Public/profile/Profile';
import generateMetaTags from '@/seo/generateMetaTags';
import { getMe } from '@/services/user/users';

const MyProfilePage = async () => {
  const { data } = await getMe();

  return (
    <>
      <Profile user={data} />
    </>
  );
};

export default MyProfilePage;

//  SEO Metatag
export async function generateMetadata() {
  const { data } = await getMe();

  return generateMetaTags({
    title: data?.fullName
      ? `${data.fullName} Profile | Aminul118`
      : 'User Profile | Aminul118',
    description:
      'Aminul Islam is a skilled Software Developer specializing in MERN stack, Next.js, and TypeScript. Building scalable, high-performance web applications.',
    keywords:
      'User Profile, Aminul Islam, Full Stack Developer, MERN Stack, Next.js, React, TypeScript, Software Engineer, Web Development, Dashboard',
    image: data?.picture || './user-placeholder.png',
    websitePath: '/my-profile',
  });
}
