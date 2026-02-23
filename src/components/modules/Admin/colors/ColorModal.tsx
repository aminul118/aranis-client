'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { IColor } from '@/services/color/color';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import ColorForm from './ColorForm';

interface Props {
    color?: IColor;
    trigger?: ReactNode;
}

const ColorModal = ({ color, trigger }: Props) => {
    const [open, setOpen] = useState(false);
    const isEdit = !!color;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button className="rounded-full bg-blue-600 font-bold hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Color
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Update Color' : 'Add New Color'}</DialogTitle>
                </DialogHeader>
                <ColorForm color={color} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default ColorModal;
