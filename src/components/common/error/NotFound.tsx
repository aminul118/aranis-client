'use client';

import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackButton from '../button/back-button';

interface NotFoundProps {
  title?: string;
  description?: string;
}

const NotFound = ({
  title = 'Item not found',
  description = 'When admin adds some data, you will find it here.',
}: NotFoundProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-[calc(100vh-535px)] flex-col items-center justify-center px-4 text-center">
      <div className="grid place-items-center p-4">
        <Frown className="text-muted-foreground h-12 w-12 sm:h-16 sm:w-16" />
        <h1 className="mt-6 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <BackButton label="Back" variant="default" />
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
