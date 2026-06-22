'use client';

import type { IUser } from '@/services/user/user.interface';
import { useState } from 'react';
import ProfileDetails from './ProfileDetails';
import UpdateProfileForm from './UpdateProfileForm';

interface Props {
  user: IUser;
}

const ProfileClient = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="w-full py-2">
      <div className="w-full">
        {isEditing ? (
          <UpdateProfileForm user={user} setIsEditing={setIsEditing} />
        ) : (
          <ProfileDetails user={user} setIsEditing={setIsEditing} />
        )}
      </div>
    </section>
  );
};

export default ProfileClient;
