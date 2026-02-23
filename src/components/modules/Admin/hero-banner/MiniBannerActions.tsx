'use client';

import DeleteFromTableDropDown from '@/components/common/actions/DeleteFromTableDropDown';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteMiniBanner, IMiniBanner } from '@/services/hero-banner/hero-banner';
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MiniBannerActions = ({ banner }: { banner: IMiniBanner }) => {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async (id: string) => {
        return await deleteMiniBanner(id);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex justify-end">
                        <Button size="icon" variant="ghost" className="shadow-none" aria-label="Actions">
                            <EllipsisIcon size={16} aria-hidden="true" />
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/admin/mini-banners/${banner._id}/edit`}
                            className="flex cursor-pointer items-center"
                        >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteFromTableDropDown
                onConfirm={() => handleDelete(banner._id as string)}
                open={deleteOpen}
                setOpen={setDeleteOpen}
            />
        </>
    );
};

export default MiniBannerActions;
