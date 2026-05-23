'use client';

import DeleteConfirmation from '@/components/common/actions/DeleteConfirmation';
import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  deleteLocation,
  deleteLocationBulk,
  ILocation,
} from '@/services/location/location';
import { MapPin, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import LocationColumn from './LocationColumn';
import LocationForm from './LocationForm';

const LocationTable = ({
  locations,
  onRefresh,
}: {
  locations: ILocation[];
  onRefresh?: () => void;
}) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null,
  );

  const handleEdit = (location: ILocation) => {
    setSelectedLocation(location);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl border-white/5 bg-[#0a0b10] p-0">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white uppercase italic">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                <MapPin size={24} />
              </div>
              Edit <span className="text-blue-600">Outlet</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-8 pt-4">
            {selectedLocation && (
              <LocationForm
                location={selectedLocation}
                onSuccess={() => {
                  setIsEditOpen(false);
                  if (onRefresh) onRefresh();
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-top-4 flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-xl duration-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="font-black">{selectedIds.length}</span>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase">
                Locations Selected
              </p>
              <p className="text-xs font-medium text-blue-100">
                Select an action to apply to all selected items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DeleteConfirmation
              onConfirm={() => deleteLocationBulk(selectedIds)}
              onSuccess={() => {
                setSelectedIds([]);
                if (onRefresh) onRefresh();
              }}
              title="Delete Selected Locations?"
              description={`Are you sure you want to delete ${selectedIds.length} locations? This action cannot be undone.`}
            >
              <Button className="rounded-xl border-none bg-red-500 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/20 hover:bg-red-600">
                <Trash2 size={14} className="mr-2" /> Delete Selected
              </Button>
            </DeleteConfirmation>

            <Button
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="rounded-xl text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <TableFilters />
      <TableManageMent
        columns={LocationColumn}
        data={locations || []}
        getRowKey={(loc) => loc._id as string}
        emptyMessage="No outlet locations found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleEdit}
        onDelete={async (loc) => {
          // Wrapped via DeleteConfirmation in row actions column — no inline confirm needed
          try {
            await deleteLocation(loc._id as string);
            toast.success('Outlet deleted successfully');
            if (onRefresh) onRefresh();
          } catch (error) {
            toast.error('Failed to delete outlet');
          }
        }}
      />
    </div>
  );
};

export default LocationTable;
