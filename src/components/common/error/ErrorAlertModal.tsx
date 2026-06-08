import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ErrorAlertModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  description: string;
  buttonText?: string;
}

export default function ErrorAlertModal({
  isOpen,
  setIsOpen,
  title = 'Action Blocked',
  description,
  buttonText = 'Acknowledge',
}: ErrorAlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card overflow-hidden rounded-[24px] border border-amber-500/20 p-0 shadow-2xl sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center bg-amber-500/10 p-8 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-foreground text-center text-2xl font-black tracking-tighter uppercase italic">
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center text-sm leading-relaxed font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="bg-card/50 p-6">
          <Button
            className="h-14 w-full rounded-xl bg-amber-500 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
