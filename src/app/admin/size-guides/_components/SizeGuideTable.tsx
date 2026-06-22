'use client';

import TableManagement, {
  Column,
} from '@/components/common/table/TableManageMent';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ISizeGuide } from '@/services/size-guide/size-guide.interface';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SizeGuideActions from './SizeGuideActions';
import SizeGuideForm from './SizeGuideForm';

import TableFilters from '@/components/common/table/TableFilters';
import { IMeta } from '@/types';

interface Props {
  sizeGuides: ISizeGuide[];
  meta?: IMeta;
}

const SizeGuideTable = ({ sizeGuides, meta }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedSizeGuide, setSelectedSizeGuide] = useState<
    ISizeGuide | undefined
  >(undefined);

  const handleOpen = (sg?: ISizeGuide) => {
    setSelectedSizeGuide(sg);
    setIsOpen(true);
  };

  const handleViewImage = (image: string) => {
    setPreviewImage(image);
    setIsImageOpen(true);
  };

  const columns: Column<ISizeGuide>[] = [
    {
      header: 'SI',
      accessor: (_, __, globalIndex) => globalIndex,
    },
    {
      header: 'Image',
      accessor: (sg) => (
        <div
          className="group relative h-16 w-16 cursor-zoom-in overflow-hidden rounded-lg border border-white/10"
          onClick={() => handleViewImage(sg.image)}
        >
          <Image
            src={sg.image}
            alt={sg.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Plus className="h-5 w-5 text-white" />
          </div>
        </div>
      ),
    },
    {
      header: 'Name',
      accessor: (sg) => <span className="font-bold">{sg.name}</span>,
      sortKey: 'name',
    },
    {
      header: 'Actions',
      accessor: (sg) => (
        <SizeGuideActions
          sizeGuide={sg}
          onEdit={handleOpen}
          onView={() => handleViewImage(sg.image)}
        />
      ),
    },
  ];

  return (
    <ClientTableWrapper
      tableTitle="Size Guides"
      meta={meta}
      action={
        <Button onClick={() => handleOpen()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Size Guide
        </Button>
      }
    >
      <TableFilters searchPlaceholder="Search by size guide name" />
      <TableManagement
        data={sizeGuides}
        columns={columns as any}
        getRowKey={(sg: any) => sg._id as string}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSizeGuide ? 'Edit Size Guide' : 'Add New Size Guide'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SizeGuideForm
              sizeGuide={selectedSizeGuide}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent
          className="overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[800px]"
          closeButtonClassName="text-red-500 hover:text-red-700 bg-white hover:bg-white/90 rounded-full"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Size Guide Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative flex aspect-auto h-full w-full items-center justify-center overflow-auto">
            {previewImage && (
              <img
                src={previewImage}
                alt="Size Guide Preview"
                className="max-h-[90vh] max-w-none min-w-[600px] rounded-xl object-contain shadow-2xl md:min-w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ClientTableWrapper>
  );
};

export default SizeGuideTable;
