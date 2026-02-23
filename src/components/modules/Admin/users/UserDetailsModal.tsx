'use client';

import DateFormat from '@/components/common/formater/date-format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { IModal } from '@/types';
import { IUser } from '@/types/api.types';

interface Props extends IModal {
  user: IUser;
}

export function UserDetailsModal({ user, open, setOpen }: Props) {
  const { fullName, email, createdAt, picture, role, isVerified } = user;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="scrollbar-thin max-h-[80vh] w-full overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            User Details
          </DialogTitle>
          <div className="text-muted-foreground text-xs">
            Joined on <DateFormat date={createdAt} />
          </div>
        </DialogHeader>

        {/* Profile section */}
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-20 w-20 rounded-lg">
            <AvatarImage src={picture || '/profile.jpg'} alt={fullName} />
            <AvatarFallback className="rounded-lg">
              {fullName?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-medium">{fullName}</span>
            <span className="text-muted-foreground text-sm">{email}</span>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{role}</Badge>
              {isVerified && (
                <Badge className="bg-green-500 text-green-950">Verified</Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Additional info */}
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Full Name</dt>
            <dd className="font-medium">{fullName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium">{role}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">
              {isVerified ? 'Verified' : 'Unverified'}
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
