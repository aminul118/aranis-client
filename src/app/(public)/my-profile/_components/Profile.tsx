'use client';

import BackButton from '@/components/common/button/back-button';
import DateFormat from '@/components/common/formater/date-format';
import Spinner from '@/components/common/loader/ButtonSpinner';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IUser } from '@/types';
import { BadgeCheck, XCircle } from 'lucide-react';

const Profile = ({ user }: { user: IUser }) => {
  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="height-adjust flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <img
            src={user.picture || '/profile.jpg'}
            alt={user.fullName || 'User'}
            className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
          />

          {/* Name and Verified Badge */}
          <CardTitle className="mt-4 flex items-center text-2xl font-semibold">
            {user.fullName}
            {user.isVerified ? (
              <Badge
                variant="default"
                className="ml-2 flex items-center gap-1 bg-green-700 text-white hover:bg-green-600"
              >
                <BadgeCheck className="h-4 w-4" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="ml-2 flex items-center gap-1 bg-red-500 text-white hover:bg-red-600"
              >
                <XCircle className="h-4 w-4" />
                Unverified
              </Badge>
            )}
          </CardTitle>

          <CardDescription className="">
            <div className="space-y-2 text-center text-sm text-slate-400">
              <p className="font-medium">{user.email}</p>
              <p> {user.role}</p>
              <p>
                <span className="font-medium">Join Date :</span>{' '}
                <DateFormat date={user.createdAt} />
              </p>
              <p>User status : {user.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4 space-y-3 text-sm text-gray-700">
          <div></div>
        </CardContent>

        <CardFooter className="flex justify-center pt-4">
          <BackButton label="Back to previous page" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
