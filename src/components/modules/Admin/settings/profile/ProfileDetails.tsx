'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IUser } from '@/types/api.types';
import { PencilLine } from 'lucide-react';

type Props = {
  user: IUser;
  setIsEditing: (value: boolean) => void;
};

const ProfileDetails = ({ user, setIsEditing }: Props) => {
  const displayFullName = user.fullName;
  const displayPicture = user.picture || '/profile.jpg';

  const displayInitials = displayFullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <CardHeader>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayPicture} alt={displayFullName} />
              <AvatarFallback className="text-2xl">
                {displayInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{displayFullName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="text-muted-foreground mt-2 text-sm">
                Role: <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)} size="sm">
            <PencilLine className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-sm font-medium">
              Full Name
            </h3>
            <p className="text-lg font-medium">{user.fullName}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-sm font-medium">
              Email Address
            </h3>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-sm font-medium">Role</h3>
            <p className="text-lg font-medium capitalize">{user.role}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-sm font-medium">
              User ID
            </h3>
            <p className="text-muted-foreground font-mono text-sm">
              {user._id}
            </p>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ProfileDetails;
