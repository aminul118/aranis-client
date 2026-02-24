import Container from '@/components/ui/Container';

const TrackOrderPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        Track Order
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        Our order tracking system is coming soon. You'll be able to see the
        real-time status of your tech gadgets here.
      </p>
    </Container>
  );
};

export default TrackOrderPage;
