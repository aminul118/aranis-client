import Container from '@/components/ui/Container';
import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { Clock } from 'lucide-react';
import { Metadata } from 'next';

const PreOrderPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-orange-100 p-4 font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
        <Clock size={40} />
      </div>
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        Pre-Order Now
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        Be the first to get your hands on the latest tech! Our pre-order portal
        is being fine-tuned to give you priority access to upcoming launches.
      </p>
    </Container>
  );
};

export default PreOrderPage;

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMeta(
    '/pre-order',
    'Pre-Order',
    'Be the first to get your hands on the latest premium collections.',
  );
}
