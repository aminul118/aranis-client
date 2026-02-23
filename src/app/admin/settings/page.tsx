import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  redirect('/admin/settings/profile');
};

export default SettingsPage;
