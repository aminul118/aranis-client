'use client';

import DateFormat from '@/components/common/formater/date-format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { assignUserRole, getMe } from '@/services/user/users';
import { IModal, Role } from '@/types';
import { IUser } from '@/types/api.types';
import { ShieldCheck, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props extends IModal {
  user: IUser;
}

export function UserDetailsModal({ user, open, setOpen }: Props) {
  const { fullName, email, createdAt, picture, role, isVerified, phone } = user;
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role as Role);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchCurrent = async () => {
        try {
          const res = await getMe();
          if (res.success) {
            setCurrentUser(res.data!);
          }
        } catch (error) {
          console.error('Failed to fetch current user', error);
        }
      };
      fetchCurrent();
      setSelectedRole(user.role as Role);
    }
  }, [open, user.role]);

  const handleRoleChange = async () => {
    if (selectedRole === user.role) return;

    setLoading(true);
    try {
      const res = await assignUserRole(user._id!, selectedRole);
      if (res.success) {
        toast.success(res.message || 'Role updated successfully');
        setOpen(false);
      } else {
        toast.error(res.message || 'Failed to update role');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="scrollbar-thin bg-background max-h-[90vh] w-full gap-0 overflow-y-auto border-none p-0 shadow-2xl sm:max-w-2xl">
        <div className="h-24 w-full bg-gradient-to-r from-blue-600 to-indigo-700" />

        <div className="-mt-12 px-6 pb-6">
          <Avatar className="border-background bg-background h-24 w-24 rounded-2xl border-4 shadow-lg">
            <AvatarImage src={picture || '/profile.jpg'} alt={fullName} />
            <AvatarFallback className="bg-muted rounded-2xl text-xl">
              {fullName?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{fullName}</h2>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                {email || phone}
                {isVerified && (
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={
                  role === Role.SUPER_ADMIN
                    ? 'default'
                    : role === Role.ADMIN
                      ? 'secondary'
                      : 'outline'
                }
                className="capitalize"
              >
                {role}
              </Badge>
              {isVerified && (
                <Badge className="border-green-500/20 bg-green-500/10 text-green-600">
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <section>
                <h3 className="text-muted-foreground mb-3 text-sm font-bold tracking-wider uppercase">
                  Account Information
                </h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="border-border/50 flex justify-between border-b py-2">
                    <dt className="text-muted-foreground">User ID</dt>
                    <dd className="font-medium">#{user.userId || 'N/A'}</dd>
                  </div>
                  <div className="border-border/50 flex justify-between border-b py-2">
                    <dt className="text-muted-foreground">Joined At</dt>
                    <dd className="font-medium">
                      <DateFormat date={createdAt} />
                    </dd>
                  </div>
                  <div className="border-border/50 flex justify-between border-b py-2">
                    <dt className="text-muted-foreground">Identifier</dt>
                    <dd className="font-medium">{email || phone}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="space-y-6">
              {isSuperAdmin && (
                <section className="bg-muted/30 border-border/50 rounded-xl border p-4">
                  <h3 className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                    <User2 className="h-4 w-4" /> Administrative Controls
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-semibold">
                        Adjust User Role
                      </label>
                      <Select
                        value={selectedRole}
                        onValueChange={(val) => setSelectedRole(val as Role)}
                        disabled={loading}
                      >
                        <SelectTrigger className="bg-background border-border w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Role.USER}>
                            User (Default)
                          </SelectItem>
                          <SelectItem value={Role.ADMIN}>
                            Administrator
                          </SelectItem>
                          <SelectItem value={Role.SUPER_ADMIN}>
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-blue-600 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
                      disabled={loading || selectedRole === user.role}
                      onClick={handleRoleChange}
                    >
                      {loading ? 'Updating...' : 'Save Role Changes'}
                    </Button>
                  </div>
                </section>
              )}

              <section className="border-border/50 rounded-xl border p-4">
                <h3 className="text-muted-foreground mb-2 text-sm font-bold tracking-wider uppercase">
                  Account Status
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${isVerified ? 'animate-pulse bg-green-500' : 'bg-yellow-500'}`}
                  />
                  <span className="font-medium">
                    {isVerified ? 'Active & Verified' : 'Pending Verification'}
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
