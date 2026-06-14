'use client';

import { IUser } from '@/types';
import { useState } from 'react';
import AddressManagement from './AddressManagement';
import ProfileDetails from './ProfileDetails';
import UpdateProfileForm from './UpdateProfileForm';

interface Props {
  user: IUser;
}

const ProfileClient = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="space-y-6">
      <div className="border-border/50 bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
        {isEditing ? (
          <UpdateProfileForm user={user} setIsEditing={setIsEditing} />
        ) : (
          <ProfileDetails user={user} setIsEditing={setIsEditing} />
        )}
      </div>

      {!isEditing && (
        <div className="border-border/50 bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
          <AddressManagement user={user} />
        </div>
      )}
    </section>
  );
};

export default ProfileClient;
