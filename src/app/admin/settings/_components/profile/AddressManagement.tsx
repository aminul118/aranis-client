'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateUser } from '@/services/user/users';
import { IUser, IUserAddress } from '@/types/api.types';
import { BookOpen, Home, MapPin, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  user: IUser;
};

const AddressManagement = ({ user }: Props) => {
  const [addresses, setAddresses] = useState<IUserAddress[]>(
    user.addresses || [],
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<IUserAddress>({
    title: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (updatedAddresses: IUserAddress[]) => {
    setLoading(true);
    try {
      const res = await updateUser(user._id, { addresses: updatedAddresses });
      if (res.success) {
        toast.success('Addresses updated successfully');
        setAddresses(updatedAddresses);
        setIsAdding(false);
        setNewAddress({ title: '', address: '' });
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to update addresses');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = () => {
    if (!newAddress.title || !newAddress.address) {
      toast.error('Please fill in both title and address');
      return;
    }
    if (addresses.length >= 4) {
      toast.error('You can only have up to 4 addresses');
      return;
    }
    const updated = [...addresses, newAddress];
    handleSave(updated);
  };

  const removeAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    handleSave(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Address Book
          </h2>
        </div>
        {addresses.length < 4 && !isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="rounded-full bg-blue-600 px-6 font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:border-blue-900/30 dark:from-blue-950/20 dark:to-[#0a0a0a]"
            >
              {/* Decorative dots (cutouts) */}
              <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />
              <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Home size={16} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {addr.title}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative z-10 h-8 w-8 rounded-full text-red-500 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                    onClick={() => removeAddress(index)}
                    disabled={loading}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {addr.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isAdding && (
          <div className="animate-in slide-in-from-top-4 fade-in overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 shadow-inner duration-300">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-bold">Add New Address</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Label{' '}
                  <span className="text-muted-foreground/50 font-medium normal-case">
                    (e.g. Home, Office)
                  </span>
                </label>
                <Input
                  placeholder="Home"
                  className="bg-background/50 border-border/50 focus:bg-background rounded-xl transition-colors"
                  value={newAddress.title}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, title: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1 space-y-2 sm:col-span-2">
                <label className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Detailed Address
                </label>
                <Textarea
                  placeholder="House #, Street, City"
                  className="bg-background/50 border-border/50 focus:bg-background h-36 rounded-xl transition-colors"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-border/50 rounded-xl"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl bg-indigo-600 text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0"
                onClick={addAddress}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !isAdding && (
          <div className="group border-border/50 bg-muted/5 rounded-3xl border-2 border-dashed py-12 text-center transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5">
            <div className="bg-background ring-border/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm ring-1 transition-transform duration-500 group-hover:scale-110">
              <MapPin className="text-muted-foreground/50 h-8 w-8 transition-colors group-hover:text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold">No addresses found</h3>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
              You haven't saved any delivery addresses yet. Add one now for
              faster checkout.
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="mt-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Add your first address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
