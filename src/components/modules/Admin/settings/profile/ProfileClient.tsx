'use client';

import { Card } from '@/components/ui/card';
import { IUser } from '@/types/api.types';
import { useState } from 'react';
import ProfileDetails from './ProfileDetails';
import UpdateProfileForm from './UpdateProfileForm';

type Props = {
  user: IUser;
};

const ProfileClient = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section>
      <Card>
        {isEditing ? (
          <UpdateProfileForm user={user} setIsEditing={setIsEditing} />
        ) : (
          <ProfileDetails user={user} setIsEditing={setIsEditing} />
        )}
      </Card>
    </section>
  );
};

export default ProfileClient;
