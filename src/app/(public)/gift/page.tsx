import Container from '@/components/ui/Container';

const GiftPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        Gift Card & Offers
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        Looking for the perfect gift? Our gift card system and exclusive
        vouchers are being prepared for you.
      </p>
    </Container>
  );
};

export default GiftPage;
