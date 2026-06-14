'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IUser } from '@/types/api.types';
import { Mail, PencilLine, Phone, User } from 'lucide-react';

type Props = {
  user: IUser;
  setIsEditing: (value: boolean) => void;
};

const ProfileDetails = ({ user, setIsEditing }: Props) => {
  const displayFullName = user.fullName;
  const displayPicture = user.picture || '';

  const displayInitials = displayFullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="font-bold text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <PencilLine className="mr-2 h-5 w-5" /> Edit Profile
        </Button>
      </div>

      {/* Avatar Section */}
      <div className="my-12 flex justify-center">
        <Avatar className="h-44 w-44 border-[6px] border-gray-300 shadow-sm dark:border-gray-700">
          <AvatarImage
            src={displayPicture}
            alt={displayFullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-blue-100 text-5xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {displayInitials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info Grid */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {/* Full Name */}
        <div className="flex min-w-[200px] flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>Full Name:</span>
          </div>
          <div className="text-lg font-black text-gray-900 dark:text-white">
            {displayFullName}
          </div>
        </div>

        {/* Contact Number */}
        {user.phone && (
          <div className="flex min-w-[200px] flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>Contact Number:</span>
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-white">
              {user.phone}
            </div>
          </div>
        )}

        {/* Email Address */}
        {user.email && (
          <div className="flex min-w-[200px] flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>Email:</span>
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-white">
              {user.email}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
