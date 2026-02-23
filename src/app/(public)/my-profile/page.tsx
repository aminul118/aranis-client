import { redirect } from 'next/navigation';

const MyProfilePage = async () => {
  redirect('/user/settings/profile');
};

export default MyProfilePage;
