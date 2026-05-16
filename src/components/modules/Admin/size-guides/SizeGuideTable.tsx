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
import { ISizeGuide } from '@/types';
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
  const [selectedSizeGuide, setSelectedSizeGuide] = useState<
    ISizeGuide | undefined
  >(undefined);

  const handleOpen = (sg?: ISizeGuide) => {
    setSelectedSizeGuide(sg);
    setIsOpen(true);
  };

  const columns: Column<ISizeGuide>[] = [
    {
      header: 'Image',
      accessor: (sg) => (
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10">
          <Image src={sg.image} alt={sg.name} fill className="object-cover" />
        </div>
      ),
    },
    {
      header: 'Name',
      accessor: (sg) => <span className="font-bold">{sg.name}</span>,
    },
    {
      header: 'Actions',
      accessor: (sg) => <SizeGuideActions sizeGuide={sg} onEdit={handleOpen} />,
    },
  ];

  return (
    <ClientTableWrapper
      tableTitle="Size Guides"
      meta={meta}
      action={
        <Button
          onClick={() => handleOpen()}
          className="rounded-full bg-blue-600 px-8 font-black text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New
        </Button>
      }
    >
      <TableFilters />
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
    </ClientTableWrapper>
  );
};

export default SizeGuideTable;
