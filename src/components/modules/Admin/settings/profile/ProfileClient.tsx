'use client';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import AddressManagement from './AddressManagement';
import ProfileDetails from './ProfileDetails';

const ProfileClient = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="space-y-6">
      <Card>
        {isEditing ? (
          <UpdateProfileForm user={user} setIsEditing={setIsEditing} />
        ) : (
          <ProfileDetails user={user} setIsEditing={setIsEditing} />
        )}
      </Card>

      {!isEditing && (
        <Card>
          <AddressManagement user={user} />
        </Card>
      )}
    </section>
  );
};

export default ProfileClient;
