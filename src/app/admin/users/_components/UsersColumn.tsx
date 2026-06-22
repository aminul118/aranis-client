import DateFormat from '@/components/common/formater/date-format';
import PlaceHolderImage from '@/components/common/PlaceHolderImage';
import { Column } from '@/components/common/table/TableManageMent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { IUser } from '@/services/user/user.interface';
import { BadgeCheck } from 'lucide-react';
import UserActions from './user-actions';

const UsersColumn: Column<IUser>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Photo',
    accessor: (u) =>
      u.picture ? (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={u.picture}
            alt={u.fullName || u.firstName || 'User'}
          />
          <AvatarFallback>
            {(u.fullName || u.firstName || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <PlaceHolderImage className="rounded-full" />
      ),
  },
  {
    header: 'Name',
    accessor: (u) =>
      u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A',
    sortKey: 'firstName',
  },
  {
    header: 'Email / Phone',
    accessor: (u) => (
      <div className="flex flex-col gap-0.5">
        {u.email && <span className="text-sm font-medium">{u.email}</span>}
        {u.phone && (
          <span className="text-muted-foreground text-xs font-semibold">
            {u.phone}
          </span>
        )}
        {!u.email && !u.phone && (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
    sortKey: 'email',
  },
  {
    header: 'Role',
    accessor: (u) => u.role,
    sortKey: 'role',
  },
  {
    header: 'Verify',
    accessor: (u) =>
      u.isVerified ? (
        <Badge className="bg-green-800 text-white">
          <BadgeCheck /> Verified
        </Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
      ),
    sortKey: 'isVerified',
  },
  {
    header: 'User Join Date & Time',
    accessor: (u) => <DateFormat date={u.createdAt} />,
    sortKey: 'createdAt',
  },
  {
    header: 'Actions',
    accessor: (u) => <UserActions user={u} />,
  },
];

export default UsersColumn;
