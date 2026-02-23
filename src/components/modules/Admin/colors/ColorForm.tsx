'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useActionHandler from '@/hooks/useActionHandler';
import { createColor, updateColor, IColor } from '@/services/color/color';
import { addColorSchema } from '@/zod/color';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof addColorSchema>;

interface Props {
    color?: IColor;
}

const ColorForm = ({ color }: Props) => {
    const router = useRouter();
    const { executePost } = useActionHandler();
    const isEdit = !!color;

    const form = useForm<FormValues>({
        resolver: zodResolver(addColorSchema),
        defaultValues: {
            name: color?.name || '',
            hex: color?.hex || '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        if (isEdit && color) {
            await executePost({
                action: () => updateColor(data, color._id as string),
                success: {
                    onSuccess: () => {
                        router.refresh();
                    },
                    loadingText: 'Color updating...',
                    message: 'Color updated successfully',
                },
            });
        } else {
            await executePost({
                action: () => createColor(data as IColor),
                success: {
                    onSuccess: () => {
                        form.reset();
                        router.refresh();
                    },
                    loadingText: 'Color adding...',
                    message: 'Color added successfully',
                },
            });
        }
    };

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-bold text-white tracking-tight">{isEdit ? 'Edit Color' : 'Add New Color'}</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Royal Blue" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hex Code (optional)</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input placeholder="#000000" {...field} />
                                    </FormControl>
                                    <div className="h-10 w-10 shrink-0 rounded-md border border-white/20" style={{ backgroundColor: field.value || 'transparent' }} />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-2">
                        <SubmitButton
                            loading={form.formState.isSubmitting}
                            text={isEdit ? 'Update' : 'Add'}
                            loadingEffect
                            icon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ColorForm;
