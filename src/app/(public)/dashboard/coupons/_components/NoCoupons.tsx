import { Ticket } from 'lucide-react';

const NoCoupons = () => {
  return (
    <div className="bg-card/30 border-border rounded-3xl border border-dashed py-24 text-center">
      <div className="bg-muted text-muted-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <Ticket size={32} />
      </div>
      <h3 className="mb-2 text-xl font-bold">No coupons found</h3>
      <p className="text-muted-foreground mb-8">
        You don't have any coupons available right now.
      </p>
    </div>
  );
};

export default NoCoupons;
