'use client';

import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import LocationForm from '@/components/modules/Admin/location/LocationForm';
import LocationTable from '@/components/modules/Admin/location/LocationTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getAllLocations, ILocation } from '@/services/location/location';
import { MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const LocationsPage = () => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchLocations = async () => {
    const res = await getAllLocations();
    setLocations(res?.data || []);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <ClientTableWrapper
      tableTitle="Outlet Locations"
      description="Manage your physical store presence and outlet details"
      action={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-blue-600 px-6 font-black text-white hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Outlet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-white/5 bg-[#0a0b10] p-0">
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white uppercase italic">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <MapPin size={24} />
                </div>
                Add New <span className="text-blue-600">Outlet</span>
              </DialogTitle>
            </DialogHeader>
            <div className="p-8 pt-4">
              <LocationForm
                onSuccess={() => {
                  setIsOpen(false);
                  fetchLocations();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <LocationTable locations={locations} onRefresh={fetchLocations} />
    </ClientTableWrapper>
  );
};

export default LocationsPage;
