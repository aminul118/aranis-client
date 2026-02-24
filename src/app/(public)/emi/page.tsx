import Container from '@/components/ui/Container';

const EMIPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        EMI Policy
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        We offer flexible EMI facilities for your favorite gadgets. Our updated
        EMI policy and banking partners list will be available here soon.
      </p>
    </Container>
  );
};

export default EMIPage;
