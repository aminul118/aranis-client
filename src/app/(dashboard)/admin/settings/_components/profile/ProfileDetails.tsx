'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatRole } from '@/lib/utils';
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
    <div className="flex flex-col gap-6">
      <CardHeader className="border-border/50 rounded-t-2xl border-b bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pt-12 pb-10">
        <div className="flex flex-col items-center gap-8 px-4 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
              <Avatar className="ring-background relative h-28 w-28 shadow-2xl ring-4 transition-transform duration-300 hover:scale-105">
                <AvatarImage
                  src={displayPicture}
                  alt={displayFullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-3xl font-black">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <CardTitle className="text-3xl font-black tracking-tight sm:text-4xl">
                {displayFullName}
              </CardTitle>
              <CardDescription className="text-base font-medium opacity-80 sm:text-lg">
                {user.email}
              </CardDescription>
              <div className="mt-2 inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-black tracking-widest text-blue-600 uppercase shadow-sm dark:bg-blue-500/20 dark:text-blue-400">
                {formatRole(user.role)}
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            size="lg"
            className="rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
          >
            <PencilLine className="mr-2 h-5 w-5" /> Edit Profile
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-6 pb-12 sm:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-border/50 bg-muted/20 hover:bg-muted/40 space-y-2 rounded-2xl border p-6 transition-colors">
            <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Full Name
            </h3>
            <p className="text-xl font-bold">{user.fullName}</p>
          </div>
          <div className="border-border/50 bg-muted/20 hover:bg-muted/40 space-y-2 rounded-2xl border p-6 transition-colors">
            <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Email Address
            </h3>
            <p className="truncate text-xl font-bold">{user.email}</p>
          </div>
          <div className="border-border/50 bg-muted/20 hover:bg-muted/40 space-y-2 rounded-2xl border p-6 transition-colors">
            <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              Role
            </h3>
            <p className="text-xl font-bold">{formatRole(user.role)}</p>
          </div>
          <div className="border-border/50 bg-muted/20 hover:bg-muted/40 space-y-2 rounded-2xl border p-6 transition-colors">
            <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              User ID
            </h3>
            <p className="truncate font-mono text-sm font-semibold opacity-70">
              {user._id}
            </p>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ProfileDetails;
