'use client';

import ImageCropper from '@/components/common/ImageCropper/ImageCropper';
import SubmitButton from '@/components/common/button/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { formatRole } from '@/lib/utils';
import { updateUser, updateUserWithFormData } from '@/services/user/users';
import { IUser } from '@/types/api.types';
import { userUpdateSchema, UserUpdateValues } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, X } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      <CardHeader className="border-border/50 rounded-t-2xl border-b bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pt-12 pb-10">
        <div className="flex flex-col items-center gap-8 px-4 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
              <Avatar className="ring-background relative h-28 w-28 shadow-2xl ring-4 transition-transform duration-300 hover:scale-105">
                <AvatarImage
                  src={displayPicture}
                  alt={displayFullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-3xl font-black">
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
            <div className="space-y-2 text-center sm:text-left">
              <CardTitle className="text-3xl font-black tracking-tight sm:text-4xl">
                {displayFullName}
              </CardTitle>
              <CardDescription className="text-base font-medium opacity-80 sm:text-lg">
                {user.email}
              </CardDescription>
              <div className="mt-2 inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-black tracking-widest text-blue-600 uppercase shadow-sm dark:bg-blue-500/20 dark:text-blue-400">
                {formatRole(user.role)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-6 pb-12 sm:px-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl px-4 text-base transition-shadow focus-visible:ring-blue-500"
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
                    <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl px-4 text-base transition-shadow focus-visible:ring-blue-500"
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
                size="lg"
                className="rounded-xl"
                onClick={() => {
                  setIsEditing(false);
                  setUploadedImageBlob(null);
                  form.reset();
                }}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <SubmitButton className="rounded-xl px-8" />
            </div>
          </form>
        </Form>
      </CardContent>

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
