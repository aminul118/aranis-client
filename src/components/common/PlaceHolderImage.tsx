import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface PlaceHolderImageProps {
  className?: string;
}

const PlaceHolderImage = ({ className }: PlaceHolderImageProps) => {
  return (
    <div
      className={cn(
        'bg-muted flex h-12 w-12 items-center justify-center rounded-md',
        className,
      )}
    >
      <ImageIcon className="text-muted-foreground h-5 w-5" />
    </div>
  );
};

export default PlaceHolderImage;
