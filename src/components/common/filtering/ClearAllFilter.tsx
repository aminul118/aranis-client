import { Button } from '@/components/ui/button';
import { useTransition } from '@/context/useTransition';
import { cn } from '@/lib/utils';
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
      className={cn('w-full md:w-auto', className)}
    >
      Clear Filter
    </Button>
  );
};

export default ClearAllFilter;
