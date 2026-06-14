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
import {
  Fingerprint,
  Mail,
  PencilLine,
  Phone,
  Shield,
  User,
} from 'lucide-react';

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
    <div className="flex flex-col">
      {/* Dynamic Gradient Header */}
      <CardHeader className="border-border/10 relative overflow-hidden rounded-t-xl border-b bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-6 pt-6 pb-8 sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Avatar with Glow */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 opacity-30 blur-md transition-all duration-500 group-hover:opacity-60 group-hover:blur-lg"></div>
              <Avatar className="ring-background relative h-28 w-28 shadow-2xl ring-4 transition-transform duration-300 group-hover:scale-105">
                <AvatarImage
                  src={displayPicture}
                  alt={displayFullName}
                  className="object-cover"
                />
                <AvatarFallback className="text-primary bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-3xl font-black">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Details */}
            <div className="space-y-2 text-center sm:text-left">
              <CardTitle className="from-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                {displayFullName}
              </CardTitle>
              <CardDescription className="flex flex-col items-center gap-1 text-base font-medium opacity-80 sm:items-start sm:text-lg">
                {user.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {user.email}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {user.phone}
                  </span>
                )}
              </CardDescription>
              <div className="mt-4 inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-black tracking-widest text-indigo-600 uppercase shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400">
                {formatRole(user.role)}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
          >
            <PencilLine className="mr-2 h-5 w-5" /> Edit Profile
          </Button>
        </div>
      </CardHeader>

      {/* Info Grid */}
      <CardContent className="bg-card px-4 py-8 sm:px-12 sm:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Grid Item: Full Name */}
          <div className="group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
              <User className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Full Name
                </h3>
              </div>
              <p className="text-foreground text-xl font-bold">
                {user.fullName}
              </p>
            </div>
          </div>

          {/* Grid Item: Email Address */}
          {user.email && (
            <div className="group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <Mail className="h-24 w-24" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                    Email Address
                  </h3>
                </div>
                <p className="text-foreground truncate text-xl font-bold">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Grid Item: Phone Number */}
          {user.phone && (
            <div className="group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <Phone className="h-24 w-24" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                    Phone Number
                  </h3>
                </div>
                <p className="text-foreground text-xl font-bold">
                  {user.phone}
                </p>
              </div>
            </div>
          )}

          {/* Grid Item: Role */}
          <div className="group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
              <Shield className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-pink-500" />
                <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Role
                </h3>
              </div>
              <p className="text-foreground text-xl font-bold">
                {formatRole(user.role)}
              </p>
            </div>
          </div>

          {/* Grid Item: User ID */}
          <div className="group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 md:col-span-full xl:col-span-1">
            <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
              <Fingerprint className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-blue-500" />
                <h3 className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  User ID
                </h3>
              </div>
              <p className="text-foreground truncate font-mono text-sm font-semibold opacity-70">
                {user._id}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ProfileDetails;
