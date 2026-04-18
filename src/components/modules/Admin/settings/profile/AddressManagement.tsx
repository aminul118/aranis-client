'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/services/user/users';
import { IUser, IUserAddress } from '@/types/api.types';
import { MapPin, Plus, Trash2 } from 'lucide-react';
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
    <div className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Saved Addresses</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage up to 4 delivery locations
          </p>
        </div>
        {addresses.length < 4 && !isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="border-border bg-muted/20 group flex items-start justify-between rounded-xl border p-4 transition-all hover:border-blue-500/30"
            >
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">
                    {addr.title}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {addr.address}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 transition-all group-hover:opacity-100"
                onClick={() => removeAddress(index)}
                disabled={loading}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        {isAdding && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Label (e.g. Home, Office)
                </label>
                <Input
                  placeholder="Home"
                  value={newAddress.title}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, title: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1 space-y-2 sm:col-span-2">
                <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Detailed Address
                </label>
                <Input
                  placeholder="House #, Street, City"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={addAddress} disabled={loading}>
                {loading ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !isAdding && (
          <div className="border-border rounded-2xl border-2 border-dashed py-8 text-center">
            <MapPin className="text-muted-foreground/30 mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              No addresses saved yet.
            </p>
            <Button
              variant="link"
              onClick={() => setIsAdding(true)}
              className="mt-2"
            >
              Add your first address
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default AddressManagement;
