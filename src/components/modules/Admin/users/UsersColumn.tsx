import DateFormat from '@/components/common/formater/date-format';
import PlaceHolderImage from '@/components/common/PlaceHolderImage';
import { Column } from '@/components/common/table/TableManageMent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IUser } from '@/types';
import { BadgeCheck } from 'lucide-react';
import UserActions from './user-actions';

const UsersColumn: Column<IUser>[] = [
  {
    header: 'SI',
    accessor: (_, i) => i + 1,
  },
  {
    header: 'Photo',
    accessor: (u) =>
      u.picture ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={u.picture} alt={u.fullName} />
          <AvatarFallback>{u.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <PlaceHolderImage className="rounded-full" />
      ),
  },
  {
    header: 'Name',
    accessor: (u) => u.fullName,
  },
  {
    header: 'Email',
    accessor: (u) => u.email,
  },
  {
    header: 'Role',
    accessor: (u) => u.role,
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
  },
  {
    header: 'User Join Date & Time',
    accessor: (u) => <DateFormat date={u.createdAt} />,
  },
  {
    header: 'Actions',
    accessor: (u) => <UserActions user={u} />,
  },
];

export default UsersColumn;
