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
  const { isPending, startTransition, setPendingAction } = useTransition();

  const handleClear = () => {
    setPendingAction('Clearing');
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
        'w-full border-red-200 bg-red-50 font-bold text-red-600 hover:bg-red-100 md:w-auto dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20',
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
