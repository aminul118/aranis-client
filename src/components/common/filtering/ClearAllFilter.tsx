import { Button } from '@/components/ui/button';
import { useTransition } from '@/context/useTransition';
import { cn } from '@/lib/utils';
import { Loader2, XCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  className?: string;
}

const ClearAllFilter = ({ className }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, startTransition } = useTransition();

  const handleClear = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleClear}
      variant="outline"
      className={cn(
        'w-full border-blue-100 bg-blue-50/50 font-bold text-blue-600 hover:bg-blue-100 md:w-auto',
        className,
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Clearing...
        </>
      ) : (
        <>
          <XCircle className="mr-2 h-4 w-4" />
          Clear Filter
        </>
      )}
    </Button>
  );
};

export default ClearAllFilter;
