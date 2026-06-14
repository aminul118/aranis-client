import { redirect } from 'next/navigation';

const MyProfilePage = async () => {
  redirect('/dashboard/settings/profile');
};

export default MyProfilePage;
