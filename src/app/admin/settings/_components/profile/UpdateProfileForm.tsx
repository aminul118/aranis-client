'use client';

import ImageCropper from '@/components/common/ImageCropper/ImageCropper';
import SubmitButton from '@/components/common/button/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { updateUser, updateUserWithFormData } from '@/services/user/users';
import { IUser } from '@/types/api.types';
import { userUpdateSchema, UserUpdateValues } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  user: IUser;
  setIsEditing: (value: boolean) => void;
};

const UpdateProfileForm = ({ user, setIsEditing }: Props) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [uploadedImageBlob, setUploadedImageBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { executePost } = useActionHandler();

  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture || '',
    },
  });

  const watchedFirstName = form.watch('firstName');
  const watchedLastName = form.watch('lastName');
  const watchedPicture = form.watch('picture');

  const displayFullName =
    `${watchedFirstName || ''} ${watchedLastName || ''}`.trim();
  const displayPicture = watchedPicture || '/profile.jpg';

  const displayInitials = displayFullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    setUploadedImageBlob(croppedImageBlob);
    setShowCropper(false);
    const objectUrl = URL.createObjectURL(croppedImageBlob);
    form.setValue('picture', objectUrl);
  };

  const onSubmit = async (data: UserUpdateValues) => {
    await executePost({
      action: async () => {
        if (uploadedImageBlob) {
          const formData = new FormData();
          formData.append('data', JSON.stringify(data));
          formData.append('file', uploadedImageBlob, 'profile.jpg');
          return updateUserWithFormData(user._id!, formData);
        } else {
          return updateUser(user._id!, data);
        }
      },
      success: {
        onSuccess: () => {
          setIsEditing(false);
          setUploadedImageBlob(null);
          router.refresh();
        },
        message: 'Profile updated successfully',
        loadingText: 'Updating profile...',
      },
      errorMessage: 'Failed to update profile.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
          <Avatar className="relative h-44 w-44 border-[6px] border-gray-300 shadow-sm transition-transform duration-300 hover:scale-105 dark:border-gray-700">
            <AvatarImage
              src={displayPicture}
              alt={displayFullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-100 text-5xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {displayInitials}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-1 text-white">
              <Camera className="h-6 w-6" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Change
              </span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayFullName}
          </h3>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800/50 dark:bg-blue-900/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border-blue-100 bg-white px-4 text-base focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border-blue-100 bg-white px-4 text-base focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6 font-bold"
                onClick={() => {
                  setIsEditing(false);
                  setUploadedImageBlob(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <div className="[&>button]:rounded-full [&>button]:bg-blue-600 [&>button]:px-8 [&>button]:font-bold [&>button]:text-white hover:[&>button]:bg-blue-700">
                <SubmitButton />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default UpdateProfileForm;
