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
import { Switch } from '@/components/ui/switch';
import useActionHandler from '@/hooks/useActionHandler';
import { createLocation, updateLocation } from '@/services/location/location';
import type { ILocation } from '@/services/location/location.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarOff, Clock, MapPin, Phone, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const locationSchema = z.object({
  name: z.string().min(1, 'Please provide a name for this outlet'),
  address: z.string().min(1, 'The physical address is required'),
  offDay: z.string().optional(),
  phone: z
    .string()
    .min(1, 'A contact phone number is necessary (comma separated)'),
  hours: z.string().min(1, 'Operating hours must be specified'),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof locationSchema>;

interface Props {
  location?: ILocation;
  onSuccess?: () => void;
}

const LocationForm = ({ location, onSuccess }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();

  const form = useForm<FormValues>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
      offDay: location?.offDay || '',
      phone: Array.isArray(location?.phone)
        ? location.phone.join(', ')
        : location?.phone || '',
      hours: location?.hours || '',
      isActive: location?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      phone: values.phone
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    };

    await executePost({
      action: () =>
        location?._id
          ? updateLocation(location._id, payload as any)
          : createLocation(payload as unknown as ILocation),
      success: {
        loadingText: location?._id
          ? 'Updating outlet...'
          : 'Creating outlet...',
        message: location?._id
          ? 'Outlet updated successfully'
          : 'Outlet created successfully',
        onSuccess: () => {
          if (onSuccess) onSuccess();
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-3xl dark:border-white/5 dark:bg-[#0a0b10] dark:shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase italic">
                      Outlet Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Main Branch - Banani"
                          className="h-12 border-gray-200 bg-gray-50 pl-10 font-bold focus:border-blue-500/50 dark:border-white/5 dark:bg-white/5"
                          {...field}
                        />
                        <MapPin
                          size={16}
                          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase italic">
                      Contact Phone
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="+880 1XXX-XXXXXX, +880 1YYY-YYYYYY"
                          className="h-12 border-gray-200 bg-gray-50 pl-10 font-bold focus:border-emerald-500/50 dark:border-white/5 dark:bg-white/5"
                          {...field}
                        />
                        <Phone
                          size={16}
                          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase italic">
                    Physical Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Block E, Road 11, Banani, Dhaka"
                      className="h-12 border-gray-200 bg-gray-50 font-bold focus:border-blue-500/50 dark:border-white/5 dark:bg-white/5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase italic">
                    Off Day
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Tuesday"
                        className="h-12 border-gray-200 bg-gray-50 pl-10 font-bold focus:border-red-500/50 dark:border-white/5 dark:bg-white/5"
                        {...field}
                      />
                      <CalendarOff
                        size={16}
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase italic">
                      Operating Hours
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="10:00 AM - 10:00 PM"
                          className="h-12 border-gray-200 bg-gray-50 pl-10 font-bold focus:border-amber-500/50 dark:border-white/5 dark:bg-white/5"
                          {...field}
                        />
                        <Clock
                          size={16}
                          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase italic">
                      Status
                    </FormLabel>
                    <div className="flex h-12 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 dark:border-white/5 dark:bg-white/5">
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Outlet is active and visible
                      </span>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8 flex justify-end border-t border-gray-200 pt-8 dark:border-white/5">
              <SubmitButton
                loading={form.formState.isSubmitting}
                text={location?._id ? 'Sync Changes' : 'Create Outlet'}
                loadingEffect
                icon={<Save size={18} />}
                className="h-14 rounded-2xl bg-blue-600 px-12 text-sm font-black tracking-[0.2em] uppercase italic transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/20 active:scale-95"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LocationForm;
