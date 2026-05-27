import { Gift } from 'lucide-react';

const EmptyGiftCards = () => {
  return (
    <div className="flex h-[30vh] flex-col items-center justify-center text-center">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <Gift className="text-muted-foreground h-10 w-10 opacity-50" />
      </div>
      <h3 className="text-foreground text-2xl font-black tracking-tight">
        No Gift Cards Available
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        No gift cards are available at the moment. Please check back later for
        our new gift card collections.
      </p>
    </div>
  );
};

export default EmptyGiftCards;
